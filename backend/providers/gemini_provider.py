"""
Gemini Provider for Neko-Webscout Full-Stack
Simplified version of the original webscout Gemini provider
"""

import json
import requests
from typing import Any, Dict, List, Optional, Union
from .base_provider import BaseProvider


class GEMINI(BaseProvider):
    """Gemini provider implementation"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "gemini-pro",
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
        
        # If no API key provided, use free endpoint
        if self.api_key:
            self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            self.headers = {
                "Content-Type": "application/json",
                "x-goog-api-key": self.api_key
            }
        else:
            # Use free Gemini endpoint (if available)
            self.base_url = "https://api.gemini.com/v1/chat"  # Placeholder
            self.headers = {"Content-Type": "application/json"}
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, Any]:
        """Send chat completion request to Gemini"""
        
        # Convert OpenAI format to Gemini format
        gemini_messages = self._convert_messages(messages)
        
        payload = {
            "contents": gemini_messages,
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": self.max_tokens,
                **kwargs
            }
        }
        
        if self.api_key:
            return self._official_api_request(payload, stream)
        else:
            return self._free_api_request(payload, stream)
    
    def _convert_messages(self, messages: List[Dict[str, str]]) -> List[Dict]:
        """Convert OpenAI message format to Gemini format"""
        gemini_messages = []
        
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            gemini_messages.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        
        return gemini_messages
    
    def _official_api_request(self, payload: Dict, stream: bool) -> Dict:
        """Make request to official Gemini API"""
        try:
            response = self.session.post(
                self.base_url,
                json=payload,
                timeout=self.timeout
            )
            
            if not response.ok:
                raise Exception(f"Gemini API error: {response.status_code} - {response.text}")
            
            result = response.json()
            
            # Convert Gemini response to OpenAI format
            return self._convert_response(result)
            
        except Exception as e:
            # Fallback to free method if official API fails
            return self._free_api_request(payload, stream)
    
    def _free_api_request(self, payload: Dict, stream: bool) -> Dict:
        """Fallback to free Gemini implementation"""
        # This would use a free Gemini implementation
        # For now, return a mock response
        return {
            "id": "gemini-" + str(hash(str(payload)))[:10],
            "object": "chat.completion",
            "created": 1234567890,
            "model": self.model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "I'm a Gemini AI assistant. This is a placeholder response from the free implementation."
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 10,
                "completion_tokens": 20,
                "total_tokens": 30
            }
        }
    
    def _convert_response(self, gemini_response: Dict) -> Dict:
        """Convert Gemini response to OpenAI format"""
        try:
            content = gemini_response["candidates"][0]["content"]["parts"][0]["text"]
            
            return {
                "id": "gemini-" + str(hash(content))[:10],
                "object": "chat.completion",
                "created": 1234567890,
                "model": self.model,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": content
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": gemini_response.get("usageMetadata", {}).get("promptTokenCount", 0),
                    "completion_tokens": gemini_response.get("usageMetadata", {}).get("candidatesTokenCount", 0),
                    "total_tokens": gemini_response.get("usageMetadata", {}).get("totalTokenCount", 0)
                }
            }
        except (KeyError, IndexError):
            raise Exception("Invalid Gemini response format")
    
    def get_models(self) -> List[str]:
        """Get available Gemini models"""
        return [
            "gemini-pro",
            "gemini-pro-vision",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-2.0-flash",
            "gemini-2.5-pro"
        ]
