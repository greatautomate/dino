# Neko-Webscout Full-Stack API Tool

A comprehensive full-stack application that combines the original Neko API Key Tool functionality with the complete Webscout AI platform, featuring 90+ AI providers, web search, image generation, and more.

## 🚀 Features

### 🔑 Token Management
- **Dual Format Support**: Both NewAPI (sk-...) and Webscout (ws_...) tokens
- **Multi-Server Validation**: Query multiple API servers simultaneously
- **Advanced Authentication**: Comprehensive token management and validation
- **Usage Tracking**: Detailed balance and usage information
- **Export Functionality**: CSV export of validation results

### 🤖 AI Providers (90+)
- **Major Providers**: OpenAI, Google Gemini, Anthropic Claude, GROQ, Meta AI, Cohere
- **Free Providers**: ChatGPT Clone, Free Gemini, Blackbox AI, and more
- **Specialized Providers**: Perplexity, Hugging Face, GitHub Copilot
- **Experimental Providers**: X0GPT, Elmo, Samurai, Flowith
- **Provider Management**: Test, monitor, and manage all providers
- **Model Selection**: Choose from hundreds of available models

### 💬 AI Chat Interface
- **Multi-Provider Chat**: Chat with any of the 90+ AI providers
- **Real-time Conversations**: Seamless chat experience
- **Model Switching**: Switch providers and models mid-conversation
- **Usage Tracking**: Monitor token usage per conversation
- **Chat History**: Persistent conversation history

### 🔍 Web Search
- **Multiple Engines**: Google, DuckDuckGo, Yep search
- **Real-time Results**: Fast and accurate search results
- **Export Results**: Save search results for later use

### 🎨 Image Generation
- **AI-Powered**: Generate images from text descriptions
- **Multiple Providers**: Support for various image generation models
- **High Quality**: Professional-grade image generation

### 🔊 Text-to-Speech
- **Voice Synthesis**: Convert text to natural-sounding speech
- **Multiple Voices**: Choose from different voice options
- **Audio Export**: Download generated audio files

### 🌤️ Weather Information
- **Real-time Data**: Current weather conditions
- **Global Coverage**: Weather data for any location
- **Detailed Information**: Temperature, humidity, wind, and more

### 🎨 User Interface
- **Modern Design**: Clean and intuitive interface with Semi Design UI
- **Dark/Light Theme**: Automatic theme switching
- **Responsive**: Works perfectly on desktop and mobile
- **Tabbed Interface**: Organized feature access
- **Real-time Updates**: Live data and status updates

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and context
- **Semi Design UI**: Professional UI component library
- **Axios**: HTTP client for API requests
- **Papa Parse**: CSV parsing and export
- **React Router**: Client-side routing

### Backend
- **FastAPI**: High-performance Python web framework
- **Uvicorn**: ASGI server for production deployment
- **Pydantic**: Data validation and serialization
- **Async Support**: Full async/await support for better performance

### Deployment
- **Render.com**: Primary deployment platform
- **Docker**: Containerized deployment
- **Multi-stage Build**: Optimized production builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd neko-api-key-tool-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Start development servers**
   ```bash
   npm run start:dev
   ```

   This starts:
   - React frontend on http://localhost:3000
   - Python backend on http://localhost:8000

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Feature flags
REACT_APP_ENABLE_WEBSCOUT=true
REACT_APP_ENABLE_SEARCH=true
REACT_APP_ENABLE_IMAGE_GEN=true
REACT_APP_ENABLE_TTS=true
REACT_APP_ENABLE_WEATHER=true

# Server configuration
REACT_APP_BASE_URL={"Local Backend": "/api", "NewAPI Server": "https://api.example.com"}

# Display settings
REACT_APP_SHOW_BALANCE=true
REACT_APP_SHOW_DETAIL=true
REACT_APP_SHOW_ICONGITHUB=true

# Default provider settings
REACT_APP_DEFAULT_PROVIDER=openai
REACT_APP_DEFAULT_MODEL=gpt-3.5-turbo

# Optional API keys (for enhanced functionality)
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key
COHERE_API_KEY=your_cohere_key
```

## 🌐 Deployment

### Render.com (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. **Connect Repository**
   - Go to [Render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure Service**
   - **Build Command**: `npm install && npm run build && cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python main.py`
   - **Environment**: Node

3. **Set Environment Variables** in Render dashboard

4. **Deploy** - Render will automatically build and deploy

### Docker Deployment

```bash
# Build the full-stack image
docker build -f Dockerfile.fullstack -t neko-webscout .

# Run the container
docker run -p 8000:8000 \
  -e NO_AUTH=true \
  -e REACT_APP_ENABLE_WEBSCOUT=true \
  neko-webscout
```

## 📖 Usage Guide

### Token Validation
1. Go to the "Token Query" tab
2. Enter your API key (NewAPI or Webscout format)
3. Click "Add Token" to add it to your collection
4. Click "Validate" to check the token across all configured servers
5. View detailed results including balance, usage, and server status

### AI Chat
1. Navigate to the "AI Chat" tab
2. Select your preferred AI provider and model
3. Start chatting with the AI
4. Switch providers/models anytime during the conversation

### Provider Management
1. Go to "Provider Management" tab
2. View all 90+ available providers
3. Test individual providers
4. Monitor provider status and available models

### Web Search
1. Access "Webscout Features" tab
2. Enter your search query
3. Select search engine (Google, DuckDuckGo, Yep)
4. View and export results

### Additional Features
- **Image Generation**: Create AI-generated images from text
- **Text-to-Speech**: Convert text to audio
- **Weather**: Get real-time weather information

## 🔧 API Documentation

The backend provides a comprehensive REST API:

- `GET /api/health` - Health check
- `GET /api/providers` - List all AI providers
- `GET /api/models` - Get all available models
- `POST /api/chat/completions` - OpenAI-compatible chat endpoint
- `GET /api/search` - Web search
- `POST /api/images/generations` - Image generation
- `POST /api/audio/speech` - Text-to-speech
- `GET /api/weather` - Weather information
- `POST /api/auth/validate` - Token validation
- `POST /api/auth/usage` - Token usage details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check the [Deployment Guide](DEPLOYMENT.md) for detailed setup instructions
- Review the GitHub issues for common problems and solutions
- Monitor application logs for detailed error information

## 🎯 Roadmap

- [ ] Real-time streaming chat responses
- [ ] Chat conversation persistence
- [ ] Advanced provider analytics
- [ ] Custom provider integration
- [ ] Multi-user support
- [ ] API rate limiting dashboard
- [ ] Advanced search filters
- [ ] Image editing capabilities
- [ ] Voice input support
