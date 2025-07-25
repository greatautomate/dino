"""
Configuration settings for Neko-Webscout Full-Stack application
"""

import os
from typing import Optional, Dict, Any
from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # API configuration
    API_TITLE: str = "Neko-Webscout Full-Stack API"
    API_DESCRIPTION: str = "Unified API for Neko token management and Webscout AI providers"
    API_VERSION: str = "1.0.0"
    
    # Authentication
    NO_AUTH: bool = True  # Default to no auth for easier setup
    NO_RATE_LIMIT: bool = True
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # Database
    MONGODB_URL: Optional[str] = None
    DATA_DIR: str = "./data"
    
    # Provider settings
    DEFAULT_PROVIDER: str = "ChatGPT"
    
    # External API keys (optional)
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    COHERE_API_KEY: Optional[str] = None
    
    # NewAPI compatibility
    NEWAPI_SERVERS: Dict[str, str] = {
        "server1": "https://api.server1.com",
        "server2": "https://api.server2.com"
    }
    
    # Feature flags
    SHOW_BALANCE: bool = True
    SHOW_DETAIL: bool = True
    SHOW_GITHUB_ICON: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


def get_provider_config() -> Dict[str, Any]:
    """Get provider configuration"""
    return {
        "openai": {
            "api_key": settings.OPENAI_API_KEY,
            "enabled": bool(settings.OPENAI_API_KEY)
        },
        "google": {
            "api_key": settings.GOOGLE_API_KEY,
            "enabled": bool(settings.GOOGLE_API_KEY)
        },
        "anthropic": {
            "api_key": settings.ANTHROPIC_API_KEY,
            "enabled": bool(settings.ANTHROPIC_API_KEY)
        },
        "cohere": {
            "api_key": settings.COHERE_API_KEY,
            "enabled": bool(settings.COHERE_API_KEY)
        }
    }


def get_newapi_config() -> Dict[str, str]:
    """Get NewAPI server configuration"""
    # Try to parse from environment variable if it's JSON
    newapi_base_url = os.environ.get("REACT_APP_BASE_URL")
    if newapi_base_url:
        try:
            import json
            return json.loads(newapi_base_url)
        except (json.JSONDecodeError, TypeError):
            pass
    
    return settings.NEWAPI_SERVERS
