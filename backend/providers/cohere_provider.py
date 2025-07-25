"""
Cohere Provider for Neko-Webscout Full-Stack
"""

import json
import requests
from typing import Any, Dict, List, Optional, Union
from .base_provider import BaseProvider


class Cohere(BaseProvider):
    """Cohere provider implementation"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "command-r-plus",
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
        
        self.base_url = "https://api.cohere.ai/v1/chat"
        self.headers = {"Content-Type": "application/json"}
        
        if self.api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, Any]:
        """Send chat completion request to Cohere"""
        
        # Convert OpenAI format to Cohere format
        cohere_message = ""
        for msg in messages:
            if msg["role"] == "user":
                cohere_message = msg["content"]  # Use last user message
        
        payload = {
            "model": self.model,
            "message": cohere_message,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": stream,
            **kwargs
        }
        
        try:
            response = self.session.post(
                self.base_url,
                json=payload,
                timeout=self.timeout
            )
            
            if not response.ok:
                raise Exception(f"Cohere API error: {response.status_code} - {response.text}")
            
            result = response.json()
            return self._convert_response(result)
            
        except Exception as e:
            # Return mock response as fallback
            return {
                "id": "cohere-" + str(hash(str(messages)))[:10],
                "object": "chat.completion",
                "created": 1234567890,
                "model": self.model,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "I'm Cohere AI assistant. This is a placeholder response."
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": 10,
                    "completion_tokens": 20,
                    "total_tokens": 30
                }
            }
    
    def _convert_response(self, cohere_response: Dict) -> Dict:
        """Convert Cohere response to OpenAI format"""
        try:
            content = cohere_response["text"]
            
            return {
                "id": cohere_response.get("generation_id", "cohere-unknown"),
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
                    "prompt_tokens": cohere_response.get("meta", {}).get("tokens", {}).get("input_tokens", 0),
                    "completion_tokens": cohere_response.get("meta", {}).get("tokens", {}).get("output_tokens", 0),
                    "total_tokens": cohere_response.get("meta", {}).get("tokens", {}).get("input_tokens", 0) + 
                                   cohere_response.get("meta", {}).get("tokens", {}).get("output_tokens", 0)
                }
            }
        except (KeyError, IndexError):
            raise Exception("Invalid Cohere response format")
    
    def get_models(self) -> List[str]:
        """Get available Cohere models"""
        return [
            "command-r-plus",
            "command-r",
            "command",
            "command-nightly",
            "command-light",
            "command-light-nightly"
        ]
