"""
Complete Webscout Provider Integration
All providers from the original AIWorldNew webscout project
"""

# Import all individual provider files
try:
    from .AI21 import AI21
except ImportError:
    AI21 = None

try:
    from .Aitopia import Aitopia
except ImportError:
    Aitopia = None

try:
    from .AllenAI import AllenAI
except ImportError:
    AllenAI = None

try:
    from .Andi import AndiSearch
except ImportError:
    AndiSearch = None

try:
    from .Blackboxai import BLACKBOXAI
except ImportError:
    BLACKBOXAI = None

try:
    from .ChatGPTClone import ChatGPTClone
except ImportError:
    ChatGPTClone = None

try:
    from .ChatSandbox import ChatSandbox
except ImportError:
    ChatSandbox = None

try:
    from .Cloudflare import Cloudflare
except ImportError:
    Cloudflare = None

try:
    from .Cohere import Cohere
except ImportError:
    Cohere = None

try:
    from .Deepinfra import DeepInfra
except ImportError:
    DeepInfra = None

try:
    from .ExaAI import ExaAI
except ImportError:
    ExaAI = None

try:
    from .ExaChat import ExaChat
except ImportError:
    ExaChat = None

try:
    from .Flowith import Flowith
except ImportError:
    Flowith = None

try:
    from .FreeGemini import FreeGemini
except ImportError:
    FreeGemini = None

try:
    from .Gemini import GEMINI
except ImportError:
    GEMINI = None

try:
    from .GithubChat import GithubChat
except ImportError:
    GithubChat = None

try:
    from .GizAI import GizAI
except ImportError:
    GizAI = None

try:
    from .Glider import GliderAI
except ImportError:
    GliderAI = None

try:
    from .Groq import GROQ
except ImportError:
    GROQ = None

try:
    from .HeckAI import HeckAI
except ImportError:
    HeckAI = None

try:
    from .HuggingFaceChat import HuggingFaceChat
except ImportError:
    HuggingFaceChat = None

try:
    from .Hunyuan import Hunyuan
except ImportError:
    Hunyuan = None

try:
    from .Jadve import JadveOpenAI
except ImportError:
    JadveOpenAI = None

try:
    from .Koboldai import KOBOLDAI
except ImportError:
    KOBOLDAI = None

try:
    from .LambdaChat import LambdaChat
except ImportError:
    LambdaChat = None

try:
    from .Llama3 import Llama3
except ImportError:
    Llama3 = None

try:
    from .MCPCore import MCPCore
except ImportError:
    MCPCore = None

try:
    from .Marcus import Marcus
except ImportError:
    Marcus = None

try:
    from .Nemotron import NEMOTRON
except ImportError:
    NEMOTRON = None

try:
    from .Netwrck import Netwrck
except ImportError:
    Netwrck = None

try:
    from .OLLAMA import OLLAMA
except ImportError:
    OLLAMA = None

try:
    from .OpenGPT import OpenGPT
except ImportError:
    OpenGPT = None

try:
    from .Openai import OPENAI
except ImportError:
    OPENAI = None

try:
    from .PI import PI
except ImportError:
    PI = None

try:
    from .Perplexitylabs import PerplexityLabs
except ImportError:
    PerplexityLabs = None

try:
    from .QwenLM import QwenLM
except ImportError:
    QwenLM = None

try:
    from .Reka import REKA
except ImportError:
    REKA = None

try:
    from .StandardInput import StandardInputAI
except ImportError:
    StandardInputAI = None

try:
    from .TeachAnything import TeachAnything
except ImportError:
    TeachAnything = None

try:
    from .TextPollinationsAI import TextPollinationsAI
except ImportError:
    TextPollinationsAI = None

try:
    from .TwoAI import TwoAI
except ImportError:
    TwoAI = None

try:
    from .TypliAI import TypliAI
except ImportError:
    TypliAI = None

try:
    from .Venice import Venice
except ImportError:
    Venice = None

try:
    from .VercelAI import VercelAI
except ImportError:
    VercelAI = None

try:
    from .WiseCat import WiseCat
except ImportError:
    WiseCat = None

try:
    from .WrDoChat import WrDoChat
except ImportError:
    WrDoChat = None

try:
    from .Writecream import Writecream
except ImportError:
    Writecream = None

try:
    from .WritingMate import WritingMate
except ImportError:
    WritingMate = None

# Import subdirectory providers
try:
    from . import AISEARCH
except ImportError:
    AISEARCH = None

try:
    from . import OPENAI
except ImportError:
    OPENAI = None

try:
    from . import HF_space
except ImportError:
    HF_space = None

try:
    from . import STT
except ImportError:
    STT = None

try:
    from . import TTI
except ImportError:
    TTI = None

try:
    from . import TTS
except ImportError:
    TTS = None

# Create provider registry
PROVIDER_REGISTRY = {}

# Add all available providers
for name, provider in globals().items():
    if provider is not None and not name.startswith('_') and name not in ['PROVIDER_REGISTRY']:
        PROVIDER_REGISTRY[name.lower()] = provider

def get_all_providers():
    """Get all available providers"""
    return {
        "providers": list(PROVIDER_REGISTRY.keys()),
        "count": len(PROVIDER_REGISTRY),
        "categories": {
            "major": ["openai", "gemini", "groq", "cohere"],
            "free": ["blackboxai", "freegemini", "chatgptclone"],
            "specialized": ["perplexitylabs", "huggingfacechat", "githubchat"],
            "experimental": ["flowith", "x0gpt", "samurai"]
        },
        "subdirectories": {
            "aisearch": "AI-powered search providers",
            "openai": "OpenAI-compatible providers", 
            "hf_space": "Hugging Face space providers",
            "stt": "Speech-to-Text providers",
            "tti": "Text-to-Image providers",
            "tts": "Text-to-Speech providers"
        }
    }

def get_provider(name: str):
    """Get a specific provider by name"""
    return PROVIDER_REGISTRY.get(name.lower())

__all__ = list(PROVIDER_REGISTRY.keys()) + ["get_all_providers", "get_provider", "PROVIDER_REGISTRY"]
