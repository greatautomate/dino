"""
GitHub Copilot Provider for Neko-Webscout Full-Stack
"""

from typing import Any, Dict, List, Optional, Union
from .base_provider import BaseProvider


class GithubChat(BaseProvider):
    """GitHub Copilot provider implementation"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = "GitHub Copilot"
    
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> Dict:
        """Send chat completion request to GitHub Copilot"""
        return {
            "id": "github-placeholder",
            "object": "chat.completion",
            "created": 1234567890,
            "model": "default",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": f"I'm GitHub Copilot AI assistant. This is a placeholder response."
                },
                "finish_reason": "stop"
            }],
            "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
        }
    
    def get_models(self) -> List[str]:
        """Get available GitHub Copilot models"""
        return ["default", "github-pro"]
