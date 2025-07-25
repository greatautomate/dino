"""
OI VSCode Provider for Neko-Webscout Full-Stack
"""

from typing import Any, Dict, List, Optional, Union
from .base_provider import BaseProvider


class oivscode(BaseProvider):
    """OI VSCode provider implementation"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = "OI VSCode"
    
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> Dict:
        """Send chat completion request to OI VSCode"""
        return {
            "id": "oivscode-placeholder",
            "object": "chat.completion",
            "created": 1234567890,
            "model": "default",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": f"I'm OI VSCode AI assistant. This is a placeholder response."
                },
                "finish_reason": "stop"
            }],
            "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
        }
    
    def get_models(self) -> List[str]:
        """Get available OI VSCode models"""
        return ["default", "oivscode-pro"]
