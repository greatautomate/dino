# Migration Guide: From Vercel to Render.com

## 🔄 Why Migrate from Vercel to Render.com?

The original Neko API Key Tool was designed for **Vercel deployment** as a simple React frontend. However, with the integration of **90+ Webscout AI providers** and additional features, we needed a platform that supports:

- **Full-Stack Applications**: Python backend + React frontend
- **Persistent Processes**: Long-running server processes
- **WebSocket Support**: Real-time features
- **File Storage**: Data persistence
- **Better Resource Limits**: More generous free tier

**Render.com** provides all these capabilities while maintaining ease of deployment.

## 📋 Migration Checklist

### ✅ What's Preserved from Original Neko Tool
- ✅ **Token Validation**: All original NewAPI token validation functionality
- ✅ **Multi-Server Support**: Query multiple NewAPI servers simultaneously
- ✅ **Environment Variables**: Same configuration options as Vercel
- ✅ **UI/UX**: Enhanced but familiar interface
- ✅ **Export Features**: CSV export functionality maintained
- ✅ **Responsive Design**: Mobile and desktop compatibility

### 🆕 What's New with Render.com Deployment
- 🆕 **90+ AI Providers**: OpenAI, Gemini, Claude, GROQ, Meta, Cohere, and more
- 🆕 **AI Chat Interface**: Direct chat with any AI provider
- 🆕 **Web Search**: Google, DuckDuckGo, Yep search engines
- 🆕 **Image Generation**: AI-powered image creation
- 🆕 **Text-to-Speech**: Voice synthesis capabilities
- 🆕 **Weather Data**: Real-time weather information
- 🆕 **Provider Management**: Test and monitor AI providers
- 🆕 **Webscout Token Support**: Both NewAPI (sk-...) and Webscout (ws_...) formats

## 🔧 Environment Variable Migration

### Original Vercel Configuration
```env
# Original Vercel environment variables
REACT_APP_SHOW_BALANCE=true
REACT_APP_SHOW_DETAIL=true
REACT_APP_BASE_URL={"server1": "https://nekoapi.com", "server2": "https://gf.nekoapi.com"}
REACT_APP_SHOW_ICONGITHUB=true
```

### New Render.com Configuration
```env
# Preserved original settings
REACT_APP_SHOW_BALANCE=true
REACT_APP_SHOW_DETAIL=true
REACT_APP_SHOW_ICONGITHUB=true

# Enhanced server configuration (includes local backend)
REACT_APP_BASE_URL={"Local Backend": "/api", "NewAPI Server 1": "https://nekoapi.com", "NewAPI Server 2": "https://gf.nekoapi.com"}

# New Webscout features (all optional)
REACT_APP_ENABLE_WEBSCOUT=true
REACT_APP_ENABLE_SEARCH=true
REACT_APP_ENABLE_IMAGE_GEN=true
REACT_APP_ENABLE_TTS=true
REACT_APP_ENABLE_WEATHER=true

# Default AI provider settings
REACT_APP_DEFAULT_PROVIDER=openai
REACT_APP_DEFAULT_MODEL=gpt-3.5-turbo
```

## 🚀 Step-by-Step Migration

### 1. Backup Your Current Vercel Deployment
- Export your current environment variables from Vercel dashboard
- Note your custom domain settings (if any)
- Save any important configuration

### 2. Deploy to Render.com

#### Option A: Use Our Enhanced Version
```bash
# Clone the enhanced repository
git clone <this-enhanced-repo-url>
cd neko-api-key-tool-main

# Deploy to Render.com using render.yaml
# Go to Render.com → New Blueprint → Connect Repository
```

#### Option B: Migrate Your Existing Repository
```bash
# Add the enhanced backend to your existing repo
# Copy the backend/ folder from this repository
# Update package.json with new scripts
# Add render.yaml configuration
```

### 3. Configure Environment Variables
Set the environment variables in Render.com dashboard using the new configuration above.

### 4. Test Deployment
- Verify original token validation functionality works
- Test new AI provider features
- Confirm all environment variables are properly set

### 5. Update DNS (if using custom domain)
- Point your custom domain from Vercel to Render.com
- Update DNS records as needed

## 🔍 Feature Comparison

| Feature | Original (Vercel) | Enhanced (Render.com) |
|---------|-------------------|----------------------|
| **Token Validation** | ✅ NewAPI only | ✅ NewAPI + Webscout |
| **Multi-Server Query** | ✅ Yes | ✅ Yes + Local Backend |
| **Export to CSV** | ✅ Yes | ✅ Yes |
| **Responsive UI** | ✅ Yes | ✅ Enhanced |
| **AI Chat** | ❌ No | ✅ 90+ Providers |
| **Web Search** | ❌ No | ✅ Multiple Engines |
| **Image Generation** | ❌ No | ✅ AI-Powered |
| **Text-to-Speech** | ❌ No | ✅ Voice Synthesis |
| **Weather Data** | ❌ No | ✅ Real-time |
| **Provider Management** | ❌ No | ✅ Full Management |
| **Deployment Cost** | 🆓 Free | 🆓 Free (750h/month) |

## 🛠️ Troubleshooting Migration Issues

### Common Issues and Solutions

1. **Environment Variables Not Working**
   - Ensure variables are set in Render.com dashboard, not in code
   - Check variable names match exactly (case-sensitive)
   - Restart the service after changing variables

2. **Build Failures**
   - Verify Node.js and Python versions are compatible
   - Check that all dependencies are properly listed
   - Review build logs in Render.com dashboard

3. **Original Functionality Missing**
   - Confirm `REACT_APP_BASE_URL` includes your NewAPI servers
   - Verify `REACT_APP_SHOW_BALANCE` and `REACT_APP_SHOW_DETAIL` are set
   - Check that token validation endpoints are accessible

4. **Performance Differences**
   - Render.com free tier may have different performance characteristics
   - Consider upgrading to paid tier for production use
   - Monitor resource usage in Render.com dashboard

## 📞 Support and Resources

### Getting Help
- **Render.com Documentation**: [https://render.com/docs](https://render.com/docs)
- **GitHub Issues**: Report problems in the repository
- **Migration Support**: Check the DEPLOYMENT.md for detailed instructions

### Useful Links
- **Render.com Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
- **Original Neko Tool**: For reference and comparison
- **Webscout Documentation**: For understanding new AI provider features

## 🎉 Migration Benefits

After migrating to Render.com, you'll have:

1. **All Original Features**: Everything from the Vercel version works the same
2. **90+ AI Providers**: Access to a vast ecosystem of AI models
3. **Enhanced UI**: Better user experience with more features
4. **Real-time Chat**: Direct interaction with AI providers
5. **Additional Tools**: Search, image generation, TTS, weather
6. **Better Scalability**: Room to grow with more features
7. **Cost Effective**: Generous free tier with upgrade options

The migration preserves all your existing functionality while adding powerful new capabilities!
