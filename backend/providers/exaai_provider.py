"""
Exa AI Provider for Neko-Webscout Full-Stack
"""

from typing import Any, Dict, List, Optional, Union
from .base_provider import BaseProvider


class ExaAI(BaseProvider):
    """Exa AI provider implementation"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = "Exa AI"
    
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> Dict:
        """Send chat completion request to Exa AI"""
        return {
            "id": "exaai-placeholder",
            "object": "chat.completion",
            "created": 1234567890,
            "model": "default",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": f"I'm Exa AI AI assistant. This is a placeholder response."
                },
                "finish_reason": "stop"
            }],
            "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
        }
    
    def get_models(self) -> List[str]:
        """Get available Exa AI models"""
        return ["default", "exaai-pro"]
