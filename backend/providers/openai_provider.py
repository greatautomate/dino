"""
OpenAI Provider for Neko-Webscout Full-Stack
Simplified version of the original webscout OpenAI provider
"""

import json
import requests
import httpx
from typing import Any, AsyncGenerator, Dict, List, Optional, Union
from .base_provider import BaseProvider, AsyncBaseProvider


class OPENAI(BaseProvider):
    """OpenAI provider implementation"""
    
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-3.5-turbo",
        max_tokens: int = 600,
        temperature: float = 1.0,
        timeout: int = 30,
        base_url: str = "https://api.openai.com/v1/chat/completions",
        **kwargs
    ):
        super().__init__(**kwargs)
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.timeout = timeout
        self.base_url = base_url
        
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, Any]:
        """Send chat completion request"""
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": stream,
            **kwargs
        }
        
        if stream:
            return self._stream_response(payload)
        else:
            return self._non_stream_response(payload)
    
    def _stream_response(self, payload: Dict):
        """Handle streaming response"""
        response = self.session.post(
            self.base_url,
            json=payload,
            stream=True,
            timeout=self.timeout
        )
        
        if not response.ok:
            raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
        
        for line in response.iter_lines(decode_unicode=True):
            if line.startswith("data: "):
                data = line[6:]
                if data == "[DONE]":
                    break
                try:
                    yield json.loads(data)
                except json.JSONDecodeError:
                    continue
    
    def _non_stream_response(self, payload: Dict) -> Dict:
        """Handle non-streaming response"""
        response = self.session.post(
            self.base_url,
            json=payload,
            timeout=self.timeout
        )
        
        if not response.ok:
            raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
        
        return response.json()
    
    def get_models(self) -> List[str]:
        """Get available models"""
        return [
            "gpt-4",
            "gpt-4-turbo",
            "gpt-4-turbo-preview",
            "gpt-3.5-turbo",
            "gpt-3.5-turbo-16k"
        ]


class AsyncOPENAI(AsyncBaseProvider):
    """Async OpenAI provider implementation"""
    
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-3.5-turbo",
        max_tokens: int = 600,
        temperature: float = 1.0,
        timeout: int = 30,
        base_url: str = "https://api.openai.com/v1/chat/completions",
        **kwargs
    ):
        super().__init__(**kwargs)
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.timeout = timeout
        self.base_url = base_url
        
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, AsyncGenerator]:
        """Send async chat completion request"""
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": stream,
            **kwargs
        }
        
        async with httpx.AsyncClient() as client:
            if stream:
                return self._stream_response(client, payload)
            else:
                return await self._non_stream_response(client, payload)
    
    async def _stream_response(self, client: httpx.AsyncClient, payload: Dict):
        """Handle async streaming response"""
        async with client.stream(
            "POST",
            self.base_url,
            json=payload,
            headers=self.headers,
            timeout=self.timeout
        ) as response:
            if response.status_code != 200:
                raise Exception(f"OpenAI API error: {response.status_code}")
            
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        yield json.loads(data)
                    except json.JSONDecodeError:
                        continue
    
    async def _non_stream_response(self, client: httpx.AsyncClient, payload: Dict) -> Dict:
        """Handle async non-streaming response"""
        response = await client.post(
            self.base_url,
            json=payload,
            headers=self.headers,
            timeout=self.timeout
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
        
        return response.json()
    
    async def get_models(self) -> List[str]:
        """Get available models"""
        return [
            "gpt-4",
            "gpt-4-turbo", 
            "gpt-4-turbo-preview",
            "gpt-3.5-turbo",
            "gpt-3.5-turbo-16k"
        ]
