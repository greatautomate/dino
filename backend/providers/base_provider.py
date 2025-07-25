"""
Base Provider Classes for Neko-Webscout Full-Stack
Simplified base classes for all AI providers
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union, AsyncGenerator


class BaseProvider(ABC):
    """Base class for all AI providers"""
    
    def __init__(self, **kwargs):
        self.name = self.__class__.__name__
        self.config = kwargs
    
    @abstractmethod
    def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, Any]:
        """Send chat completion request"""
        pass
    
    @abstractmethod
    def get_models(self) -> List[str]:
        """Get available models for this provider"""
        pass
    
    def get_info(self) -> Dict[str, Any]:
        """Get provider information"""
        return {
            "name": self.name,
            "models": self.get_models(),
            "supports_streaming": True,
            "supports_functions": False,
            "config": self.config
        }


class AsyncBaseProvider(ABC):
    """Base class for async AI providers"""
    
    def __init__(self, **kwargs):
        self.name = self.__class__.__name__
        self.config = kwargs
    
    @abstractmethod
    async def chat(
        self,
        messages: List[Dict[str, str]],
        stream: bool = False,
        **kwargs
    ) -> Union[Dict, AsyncGenerator]:
        """Send async chat completion request"""
        pass
    
    @abstractmethod
    async def get_models(self) -> List[str]:
        """Get available models for this provider"""
        pass
    
    async def get_info(self) -> Dict[str, Any]:
        """Get provider information"""
        return {
            "name": self.name,
            "models": await self.get_models(),
            "supports_streaming": True,
            "supports_functions": False,
            "config": self.config
        }


class ProviderError(Exception):
    """Base exception for provider errors"""
    pass


class AuthenticationError(ProviderError):
    """Authentication error"""
    pass


class RateLimitError(ProviderError):
    """Rate limit error"""
    pass


class ModelNotFoundError(ProviderError):
    """Model not found error"""
    pass


class InvalidRequestError(ProviderError):
    """Invalid request error"""
    pass
