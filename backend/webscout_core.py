"""
Webscout Core API Integration
Main API handler for all webscout functionality
"""

import json
import asyncio
from typing import Any, Dict, List, Optional, Union
from fastapi import HTTPException
from providers import get_provider, get_all_providers
from config import settings


class WebscoutAPI:
    """Main Webscout API handler"""
    
    def __init__(self):
        self.providers = {}
        self.default_provider = settings.DEFAULT_PROVIDER
    
    def get_provider_instance(self, provider_name: str, **kwargs):
        """Get or create a provider instance"""
        provider_key = f"{provider_name}_{hash(str(kwargs))}"
        
        if provider_key not in self.providers:
            provider_class = get_provider(provider_name)
            if not provider_class:
                raise HTTPException(status_code=404, detail=f"Provider '{provider_name}' not found")
            
            self.providers[provider_key] = provider_class(**kwargs)
        
        return self.providers[provider_key]
    
    async def chat_completions(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle OpenAI-compatible chat completions"""
        try:
            # Extract request parameters
            model = request.get("model", self.default_provider)
            messages = request.get("messages", [])
            stream = request.get("stream", False)
            max_tokens = request.get("max_tokens", 1000)
            temperature = request.get("temperature", 0.7)
            
            # Determine provider from model name
            provider_name = self._get_provider_from_model(model)
            
            # Get provider instance
            provider = self.get_provider_instance(
                provider_name,
                model=model,
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            # Make the request
            response = provider.chat(
                messages=messages,
                stream=stream,
                **{k: v for k, v in request.items() if k not in ["model", "messages", "stream"]}
            )
            
            return response
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def search(self, query: str, engine: str = "google", max_results: int = 10) -> Dict[str, Any]:
        """Handle web search requests"""
        try:
            # This would integrate with webscout's search functionality
            # For now, return a mock response
            return {
                "query": query,
                "engine": engine,
                "results": [
                    {
                        "title": f"Search result for: {query}",
                        "url": "https://example.com",
                        "snippet": f"This is a mock search result for '{query}' using {engine} engine."
                    }
                ],
                "total_results": max_results,
                "search_time": 0.5
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def _get_provider_from_model(self, model: str) -> str:
        """Determine provider from model name"""
        model_lower = model.lower()
        
        # Model to provider mapping
        if "gpt" in model_lower or "openai" in model_lower:
            return "openai"
        elif "gemini" in model_lower or "google" in model_lower:
            return "gemini"
        elif "claude" in model_lower or "anthropic" in model_lower:
            return "claude"
        elif "llama" in model_lower and "groq" in model_lower:
            return "groq"
        elif "llama" in model_lower or "meta" in model_lower:
            return "meta"
        elif "command" in model_lower or "cohere" in model_lower:
            return "cohere"
        elif "mixtral" in model_lower or "groq" in model_lower:
            return "groq"
        else:
            # Default to the configured default provider
            return self.default_provider.lower()
    
    def get_available_models(self) -> Dict[str, Any]:
        """Get all available models from all providers"""
        all_models = {}
        providers_info = get_all_providers()
        
        for provider_name in providers_info["providers"]:
            try:
                provider_class = get_provider(provider_name)
                if provider_class:
                    # Create a temporary instance to get models
                    temp_provider = provider_class()
                    models = temp_provider.get_models()
                    all_models[provider_name] = {
                        "models": models,
                        "count": len(models)
                    }
            except Exception as e:
                all_models[provider_name] = {
                    "models": [],
                    "count": 0,
                    "error": str(e)
                }
        
        return {
            "providers": all_models,
            "total_providers": len(all_models),
            "total_models": sum(info.get("count", 0) for info in all_models.values())
        }
    
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Handle image generation requests"""
        try:
            # This would integrate with webscout's image generation
            # For now, return a mock response
            return {
                "prompt": prompt,
                "images": [
                    {
                        "url": "https://via.placeholder.com/512x512?text=Generated+Image",
                        "width": 512,
                        "height": 512
                    }
                ],
                "created": 1234567890
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def text_to_speech(self, text: str, voice: str = "default", **kwargs) -> Dict[str, Any]:
        """Handle text-to-speech requests"""
        try:
            # This would integrate with webscout's TTS functionality
            # For now, return a mock response
            return {
                "text": text,
                "voice": voice,
                "audio_url": "https://example.com/audio.mp3",
                "duration": 5.0
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def get_weather(self, location: str) -> Dict[str, Any]:
        """Handle weather requests"""
        try:
            # This would integrate with webscout's weather functionality
            # For now, return a mock response
            return {
                "location": location,
                "temperature": "22°C",
                "condition": "Sunny",
                "humidity": "65%",
                "wind": "10 km/h"
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
