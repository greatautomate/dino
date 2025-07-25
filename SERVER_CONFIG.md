# 🔧 Server Configuration Guide

## Quick Setup for Custom API Servers

### 📝 How to Add Your Own API URLs

1. **In Render.com Dashboard:**
   - Go to your deployed service
   - Click "Environment" tab
   - Find `REACT_APP_BASE_URL` variable
   - Replace with your custom configuration

2. **Format:**
   ```json
   {"Display Name": "https://your-api-url.com"}
   ```

### 🌟 Example Configurations

#### Single Server (Simple)
```json
{"My API Server": "https://your-api.com"}
```

#### Multiple Servers (Comparison)
```json
{
  "Local Backend": "/api",
  "Better Price Server": "https://cheap-api.com/v1",
  "Stable Server": "https://reliable-api.com/v1", 
  "No Subscription Server": "https://free-api.com/v1",
  "Premium Server": "https://premium-api.com/v1"
}
```

#### Real-World Examples
```json
{
  "Local Backend": "/api",
  "NekoAPI": "https://nekoapi.com",
  "GF NekoAPI": "https://gf.nekoapi.com",
  "Your Custom API": "https://your-domain.com/api/v1"
}
```

### 🚀 Common API Providers

Replace these URLs with your actual API endpoints:

```json
{
  "Local Backend": "/api",
  "OpenAI Compatible": "https://api.openai.com/v1",
  "Custom NewAPI": "https://your-newapi-instance.com",
  "Alternative Provider": "https://alternative-api.com/v1",
  "Backup Server": "https://backup-api.com/v1"
}
```

### 🔑 Features

- **Multi-Server Support**: Compare multiple API providers simultaneously
- **Real-time Switching**: Switch between servers without reloading
- **Token Validation**: Test tokens across all configured servers
- **Balance Checking**: View balance from multiple providers
- **Usage Tracking**: Monitor usage across different servers

### 📋 Server Requirements

Your API server should support:
- ✅ **OpenAI-compatible endpoints** (`/v1/chat/completions`)
- ✅ **Token validation** (`/v1/dashboard/billing/subscription`)
- ✅ **Usage tracking** (`/v1/dashboard/billing/usage`)
- ✅ **CORS headers** for web access

### 🛠️ Quick Deployment Steps

1. **Fork this repository**
2. **Edit render.yaml** with your API URLs
3. **Deploy to Render.com**
4. **Set environment variables** in Render dashboard
5. **Test your configuration**

### 🔧 Environment Variable Format

```bash
REACT_APP_BASE_URL={"Server Name": "https://your-api.com", "Another Server": "https://another-api.com"}
```

### 💡 Pro Tips

1. **Use descriptive names** for your servers (e.g., "Fast Server", "Cheap Server")
2. **Include protocol** (https://) in URLs
3. **Test endpoints** before deploying
4. **Keep backup servers** for redundancy
5. **Monitor costs** across different providers

### 🚨 Security Notes

- ✅ **Never commit API keys** to version control
- ✅ **Use environment variables** for sensitive data
- ✅ **Enable HTTPS** for all API endpoints
- ✅ **Rotate tokens** regularly
- ✅ **Monitor usage** to prevent unexpected charges

### 📞 Support

If you need help configuring your servers:
1. Check the deployment logs in Render.com
2. Verify your API endpoints are accessible
3. Test token format (NewAPI: `sk-...`, Webscout: `ws_...`)
4. Ensure CORS is properly configured on your API server

---

**Ready to deploy?** Just update the `REACT_APP_BASE_URL` in render.yaml with your preferred API servers and deploy to Render.com! 🚀
