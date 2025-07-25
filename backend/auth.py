"""
Authentication Manager for Neko-Webscout Full-Stack
Handles both NewAPI and Webscout API key formats
"""

import re
import json
import asyncio
import aiohttp
from typing import Dict, List, Optional, Any
from fastapi import HTTPException
from config import settings, get_newapi_config


class AuthManager:
    """Unified authentication manager"""
    
    def __init__(self):
        self.newapi_servers = get_newapi_config()
    
    async def validate_token(self, token: str) -> Dict[str, Any]:
        """Validate API token (both NewAPI and Webscout formats)"""
        
        # Determine token type
        token_type = self._get_token_type(token)
        
        if token_type == "newapi":
            return await self._validate_newapi_token(token)
        elif token_type == "webscout":
            return await self._validate_webscout_token(token)
        else:
            raise HTTPException(status_code=400, detail="Invalid token format")
    
    def _get_token_type(self, token: str) -> str:
        """Determine token type from format"""
        if re.match(r'^sk-[a-zA-Z0-9]{48}$', token):
            return "newapi"
        elif re.match(r'^ws_[a-zA-Z0-9]{32}$', token):
            return "webscout"
        else:
            return "unknown"
    
    async def _validate_newapi_token(self, token: str) -> Dict[str, Any]:
        """Validate NewAPI token across multiple servers"""
        results = {}
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            
            for server_name, base_url in self.newapi_servers.items():
                task = self._check_newapi_server(session, server_name, base_url, token)
                tasks.append(task)
            
            # Wait for all server checks to complete
            server_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for i, (server_name, _) in enumerate(self.newapi_servers.items()):
                result = server_results[i]
                if isinstance(result, Exception):
                    results[server_name] = {
                        "status": "error",
                        "error": str(result)
                    }
                else:
                    results[server_name] = result
        
        return {
            "token": token,
            "token_type": "newapi",
            "servers": results,
            "valid_servers": [name for name, result in results.items() 
                            if result.get("status") == "valid"]
        }
    
    async def _check_newapi_server(
        self, 
        session: aiohttp.ClientSession, 
        server_name: str, 
        base_url: str, 
        token: str
    ) -> Dict[str, Any]:
        """Check token validity on a specific NewAPI server"""
        try:
            # Try to get subscription info
            headers = {"Authorization": f"Bearer {token}"}
            
            async with session.get(
                f"{base_url}/v1/dashboard/billing/subscription",
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=10)
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    return {
                        "status": "valid",
                        "server": server_name,
                        "balance": data.get("hard_limit_usd", "Unknown"),
                        "usage": data.get("usage", {}),
                        "subscription": data
                    }
                elif response.status == 401:
                    return {
                        "status": "invalid",
                        "server": server_name,
                        "error": "Invalid token"
                    }
                else:
                    return {
                        "status": "error",
                        "server": server_name,
                        "error": f"HTTP {response.status}"
                    }
                    
        except asyncio.TimeoutError:
            return {
                "status": "timeout",
                "server": server_name,
                "error": "Request timeout"
            }
        except Exception as e:
            return {
                "status": "error",
                "server": server_name,
                "error": str(e)
            }
    
    async def _validate_webscout_token(self, token: str) -> Dict[str, Any]:
        """Validate Webscout token"""
        try:
            # This would validate against webscout's authentication system
            # For now, return a mock validation
            
            # Extract token parts (ws_[32chars])
            if len(token) == 35 and token.startswith("ws_"):
                return {
                    "token": token,
                    "token_type": "webscout",
                    "status": "valid",
                    "user_id": token[3:13],  # First 10 chars after ws_
                    "permissions": ["chat", "search", "image", "tts"],
                    "rate_limit": {
                        "requests_per_minute": 60,
                        "requests_per_day": 1000
                    },
                    "usage": {
                        "requests_today": 45,
                        "tokens_used": 12500
                    }
                }
            else:
                return {
                    "token": token,
                    "token_type": "webscout",
                    "status": "invalid",
                    "error": "Invalid webscout token format"
                }
                
        except Exception as e:
            return {
                "token": token,
                "token_type": "webscout",
                "status": "error",
                "error": str(e)
            }
    
    async def get_token_usage(self, token: str) -> Dict[str, Any]:
        """Get detailed token usage information"""
        validation_result = await self.validate_token(token)
        
        if validation_result.get("token_type") == "newapi":
            return await self._get_newapi_usage(token, validation_result)
        elif validation_result.get("token_type") == "webscout":
            return await self._get_webscout_usage(token, validation_result)
        else:
            raise HTTPException(status_code=400, detail="Invalid token")
    
    async def _get_newapi_usage(self, token: str, validation_result: Dict) -> Dict[str, Any]:
        """Get NewAPI token usage details"""
        usage_data = {}
        
        for server_name, server_result in validation_result.get("servers", {}).items():
            if server_result.get("status") == "valid":
                usage_data[server_name] = {
                    "balance": server_result.get("balance"),
                    "usage": server_result.get("usage", {}),
                    "subscription": server_result.get("subscription", {})
                }
        
        return {
            "token": token,
            "token_type": "newapi",
            "usage_by_server": usage_data
        }
    
    async def _get_webscout_usage(self, token: str, validation_result: Dict) -> Dict[str, Any]:
        """Get Webscout token usage details"""
        return {
            "token": token,
            "token_type": "webscout",
            "usage": validation_result.get("usage", {}),
            "rate_limit": validation_result.get("rate_limit", {}),
            "permissions": validation_result.get("permissions", [])
        }
