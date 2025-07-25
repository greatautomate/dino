# Neko-Webscout Render.com Deployment Guide

## 🚀 Render.com Deployment (Migrated from Vercel)

This project has been **migrated from Vercel to Render.com** to support the full-stack architecture with integrated Webscout AI providers.

### Why Render.com?
- **Full-Stack Support**: Unlike Vercel's serverless functions, Render.com supports persistent Python backends
- **90+ AI Providers**: Better suited for the integrated Webscout functionality
- **Free Tier**: Generous free tier with 750 hours/month
- **Easy Deployment**: Simple configuration with automatic builds

### Prerequisites
- GitHub repository with your code
- Render.com account (free tier available)
- Node.js 18+ and Python 3.11+ (for local development)

## 🎯 Quick Deployment (Recommended)

### Method 1: One-Click Deploy with render.yaml

1. **Fork/Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd neko-api-key-tool-main
   ```

2. **Deploy to Render**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and deploy

### Method 2: Manual Web Service Setup

1. **Connect Repository**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `neko-webscout-fullstack`
   - **Environment**: `Node`
   - **Build Command**: `npm run render:build`
   - **Start Command**: `npm run render:start`
   - **Auto-Deploy**: Yes

3. **Environment Variables**
   Set these in the Render dashboard:
   ```env
   # Core functionality
   REACT_APP_ENABLE_WEBSCOUT=true

   # 🔧 CUSTOMIZE YOUR API SERVERS HERE:
   # Add any API URLs you want - better price, stability, no subscription, etc.
   # Format: {"Display Name": "https://your-api-url.com"}
   REACT_APP_BASE_URL={"Local Backend": "/api", "Better Price Server": "https://your-better-api.com", "Stable Server": "https://your-stable-api.com"}

   # Display settings (same as original Vercel config)
   REACT_APP_SHOW_BALANCE=true
   REACT_APP_SHOW_DETAIL=true
   REACT_APP_SHOW_ICONGITHUB=true

   # Additional features
   REACT_APP_ENABLE_SEARCH=true
   REACT_APP_ENABLE_IMAGE_GEN=true
   REACT_APP_ENABLE_TTS=true
   REACT_APP_ENABLE_WEATHER=true
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy

## 🔧 Customizing API Servers

### Adding Your Own API URLs

You can easily add any API server URLs you want by modifying the `REACT_APP_BASE_URL` environment variable:

#### In render.yaml (before deployment):
```yaml
- key: REACT_APP_BASE_URL
  value: '{"Local Backend": "/api", "Your Better API": "https://your-api.com", "Cheap Server": "https://cheap-api.com"}'
```

#### In Render.com Dashboard (after deployment):
1. Go to your service dashboard
2. Click "Environment" tab
3. Find `REACT_APP_BASE_URL`
4. Update with your preferred servers:

```json
{
  "Local Backend": "/api",
  "Better Price Server": "https://your-better-price-api.com",
  "Better Stability Server": "https://your-stable-api.com",
  "No Subscription Server": "https://your-free-api.com"
}
```

### 🌟 Benefits of Multiple Servers

- **Price Comparison**: Compare costs across different providers
- **Reliability**: Fallback options if one server is down
- **Performance**: Choose the fastest server for your location
- **Features**: Different servers may offer different models/capabilities

### 📋 Server Requirements

Your API servers should support:
- OpenAI-compatible endpoints (`/v1/chat/completions`)
- Token validation (`/v1/dashboard/billing/subscription`)
- Usage tracking (`/v1/dashboard/billing/usage`)
- CORS headers for web access

See [SERVER_CONFIG.md](SERVER_CONFIG.md) for detailed configuration examples.

### Using render.yaml (Infrastructure as Code)

1. **Add render.yaml to your repository** (already included)
2. **Create Blueprint**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect and use `render.yaml`

## 🐳 Docker Deployment

### Local Docker Build
```bash
# Build the full-stack image
docker build -f Dockerfile.fullstack -t neko-webscout .

# Run the container
docker run -p 8000:8000 \
  -e NO_AUTH=true \
  -e NO_RATE_LIMIT=true \
  -e REACT_APP_ENABLE_WEBSCOUT=true \
  neko-webscout
```

### Docker Compose
```yaml
version: '3.8'
services:
  neko-webscout:
    build:
      context: .
      dockerfile: Dockerfile.fullstack
    ports:
      - "8000:8000"
    environment:
      - NO_AUTH=true
      - NO_RATE_LIMIT=true
      - REACT_APP_ENABLE_WEBSCOUT=true
    volumes:
      - ./data:/app/data
```

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- pip

### Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Start development servers
npm run start:dev
```

This will start:
- React frontend on http://localhost:3000
- Python backend on http://localhost:8000

## 🌐 Environment Configuration

### Required Environment Variables
```bash
# Server configuration
PORT=8000
NO_AUTH=true
NO_RATE_LIMIT=true

# Feature flags
REACT_APP_ENABLE_WEBSCOUT=true
REACT_APP_ENABLE_SEARCH=true
REACT_APP_ENABLE_IMAGE_GEN=true
REACT_APP_ENABLE_TTS=true
REACT_APP_ENABLE_WEATHER=true

# Server configuration
REACT_APP_BASE_URL={"Local Backend": "/api", "External Server": "https://api.example.com"}

# Display settings
REACT_APP_SHOW_BALANCE=true
REACT_APP_SHOW_DETAIL=true
REACT_APP_SHOW_ICONGITHUB=true
```

### Optional API Keys (for enhanced functionality)
```bash
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key
COHERE_API_KEY=your_cohere_key
```

## 📊 Features

### ✅ Integrated Features
- **90+ AI Providers**: OpenAI, Gemini, Claude, GROQ, Meta, Cohere, and more
- **Token Validation**: Support for both NewAPI (sk-...) and Webscout (ws_...) formats
- **Multi-Server Support**: Query multiple API servers simultaneously
- **Web Search**: Google, DuckDuckGo, Yep search engines
- **Image Generation**: AI-powered image creation
- **Text-to-Speech**: Convert text to audio
- **Weather Information**: Real-time weather data
- **Export Functionality**: CSV export of validation results

### 🎨 UI Features
- **Dark/Light Theme**: Automatic theme switching
- **Responsive Design**: Works on desktop and mobile
- **Provider Selection**: Easy switching between AI providers
- **Real-time Validation**: Instant token validation feedback
- **Tabbed Interface**: Organized feature access

## 🔒 Security Notes

### Production Deployment
1. **Set NO_AUTH=false** for production use
2. **Configure rate limiting** by setting NO_RATE_LIMIT=false
3. **Use HTTPS** for all external communications
4. **Secure API keys** using environment variables
5. **Enable CORS** restrictions for your domain

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor usage and set up alerts

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure Node.js 18+ and Python 3.11+ are installed
   - Check that all dependencies are properly installed
   - Verify environment variables are set correctly

2. **Provider Errors**
   - Check API key validity and format
   - Verify network connectivity
   - Review provider-specific rate limits

3. **Deployment Issues**
   - Check Render logs for detailed error messages
   - Ensure all required files are committed to repository
   - Verify environment variables in Render dashboard

### Support
- Check the GitHub repository for issues and documentation
- Review Render.com documentation for deployment help
- Monitor application logs for detailed error information

## 📈 Scaling

### Performance Optimization
- Enable Redis caching (upgrade to paid Render plan)
- Use CDN for static assets
- Implement request queuing for high traffic
- Monitor resource usage and scale accordingly

### High Availability
- Use Render's auto-scaling features
- Implement health checks and monitoring
- Set up backup and disaster recovery
- Consider multi-region deployment for global users
