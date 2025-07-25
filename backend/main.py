"""
Neko-Webscout Full-Stack Backend
FastAPI server with integrated Webscout AI providers and search capabilities
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

# Import webscout modules (we'll copy them here)
from webscout_core import WebscoutAPI
from providers import get_all_providers
from auth import AuthManager
from config import settings

# Create FastAPI app
app = FastAPI(
    title="Neko-Webscout Full-Stack API",
    description="Unified API for Neko token management and Webscout AI providers",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
webscout_api = WebscoutAPI()
auth_manager = AuthManager()

# API Routes
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "neko-webscout-fullstack"}

@app.get("/api/providers")
async def get_providers():
    """Get all available AI providers"""
    return get_all_providers()

@app.get("/api/models")
async def get_models():
    """Get all available models from all providers"""
    return webscout_api.get_available_models()

@app.post("/api/chat/completions")
async def chat_completions(request: dict):
    """OpenAI-compatible chat completions endpoint"""
    return await webscout_api.chat_completions(request)

@app.get("/api/search")
async def web_search(q: str, engine: str = "google", max_results: int = 10):
    """Web search endpoint"""
    return await webscout_api.search(q, engine, max_results)

@app.post("/api/images/generations")
async def generate_image(request: dict):
    """Image generation endpoint"""
    prompt = request.get("prompt", "")
    return await webscout_api.generate_image(prompt, **request)

@app.post("/api/audio/speech")
async def text_to_speech(request: dict):
    """Text-to-speech endpoint"""
    text = request.get("input", "")
    voice = request.get("voice", "default")
    return await webscout_api.text_to_speech(text, voice, **request)

@app.get("/api/weather")
async def get_weather(location: str):
    """Weather information endpoint"""
    return await webscout_api.get_weather(location)

@app.post("/api/auth/validate")
async def validate_token(request: dict):
    """Validate API token (both NewAPI and Webscout formats)"""
    token = request.get("token", "")
    return await auth_manager.validate_token(token)

@app.post("/api/auth/usage")
async def get_token_usage(request: dict):
    """Get detailed token usage information"""
    token = request.get("token", "")
    return await auth_manager.get_token_usage(token)

# Serve React app for Render.com deployment
@app.get("/", include_in_schema=False)
async def serve_react_app():
    """Serve the React frontend"""
    build_path = os.path.join(os.path.dirname(__file__), "..", "build", "index.html")
    if os.path.exists(build_path):
        return FileResponse(build_path)
    else:
        return {"message": "Frontend not built. Run 'npm run build' first."}

# Mount static files for Render.com
build_dir = os.path.join(os.path.dirname(__file__), "..", "build")
if os.path.exists(build_dir):
    static_dir = os.path.join(build_dir, "static")
    if os.path.exists(static_dir):
        app.mount("/static", StaticFiles(directory=static_dir), name="static")

    # Serve all other static files and handle client-side routing
    @app.get("/{path:path}", include_in_schema=False)
    async def serve_static_files(path: str):
        """Serve static files and handle client-side routing"""
        file_path = os.path.join(build_dir, path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        else:
            # For client-side routing, return index.html
            return FileResponse(os.path.join(build_dir, "index.html"))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
