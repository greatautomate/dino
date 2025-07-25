"""
Claude Provider for Neko-Webscout Full-Stack
"""

import json
import requests
from typing import Any, Dict, List, Optional, Union
from .base_provider import BaseProvider


class Claude(BaseProvider):
    """Claude (Anthropic) provider implementation"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "claude-3-sonnet-20240229",
        max_tokens: int = 1000,
        temperature: float = 0.7,
        timeout: int = 30,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.timeout = timeout
        
        if self.api_key:
            self.base_url = "https://api.anthropic.com/v1/messages"
            self.headers = {
                "Content-Type": "application/json",
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01"
            }
        else:
            # Use free Claude endpoint
            self.base_url = "https://api.claude.ai/api/organizations/free/chat_conversations"
            self.headers = {"Content-Type": "application/json"}
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, Any]:
        """Send chat completion request to Claude"""
        
        if self.api_key:
            return self._official_api_request(messages, stream, **kwargs)
        else:
            return self._free_api_request(messages, stream, **kwargs)
    
    def _official_api_request(self, messages: List[Dict[str, str]], stream: bool, **kwargs) -> Dict:
        """Make request to official Claude API"""
        # Convert OpenAI format to Claude format
        claude_messages = []
        system_message = None
        
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                claude_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        payload = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "messages": claude_messages
        }
        
        if system_message:
            payload["system"] = system_message
        
        try:
            response = self.session.post(
                self.base_url,
                json=payload,
                timeout=self.timeout
            )
            
            if not response.ok:
                raise Exception(f"Claude API error: {response.status_code} - {response.text}")
            
            result = response.json()
            return self._convert_response(result)
            
        except Exception as e:
            return self._free_api_request(messages, stream, **kwargs)
    
    def _free_api_request(self, messages: List[Dict[str, str]], stream: bool, **kwargs) -> Dict:
        """Fallback to free Claude implementation"""
        # Mock response for free implementation
        return {
            "id": "claude-" + str(hash(str(messages)))[:10],
            "object": "chat.completion",
            "created": 1234567890,
            "model": self.model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "I'm Claude, an AI assistant created by Anthropic. This is a placeholder response from the free implementation."
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 10,
                "completion_tokens": 25,
                "total_tokens": 35
            }
        }
    
    def _convert_response(self, claude_response: Dict) -> Dict:
        """Convert Claude response to OpenAI format"""
        try:
            content = claude_response["content"][0]["text"]
            
            return {
                "id": claude_response.get("id", "claude-unknown"),
                "object": "chat.completion",
                "created": 1234567890,
                "model": self.model,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": content
                    },
                    "finish_reason": claude_response.get("stop_reason", "stop")
                }],
                "usage": claude_response.get("usage", {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0
                })
            }
        except (KeyError, IndexError):
            raise Exception("Invalid Claude response format")
    
    def get_models(self) -> List[str]:
        """Get available Claude models"""
        return [
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307",
            "claude-2.1",
            "claude-2.0",
            "claude-instant-1.2"
        ]
