# 🚀 Quick URL Setup Guide

## 📝 How to Add Your Custom API URLs

### Method 1: Before Deployment (Edit render.yaml)

1. Open `render.yaml`
2. Find line 60 with `REACT_APP_BASE_URL`
3. Replace the URLs with your own:

```yaml
- key: REACT_APP_BASE_URL
  value: '{"Local Backend": "/api", "Your API Name": "https://your-api-url.com"}'
```

### Method 2: After Deployment (Render Dashboard)

1. Go to your Render.com service dashboard
2. Click **"Environment"** tab
3. Find `REACT_APP_BASE_URL` variable
4. Click **"Edit"** 
5. Replace with your configuration:

```json
{"Local Backend": "/api", "Better Price API": "https://your-better-api.com", "Stable API": "https://your-stable-api.com"}
```

6. Click **"Save Changes"**
7. Your service will automatically redeploy

## 🌟 Example Configurations

### Single Custom Server
```json
{"My API": "https://my-api.com/v1"}
```

### Multiple Servers for Comparison
```json
{
  "Local Backend": "/api",
  "Cheap Server": "https://cheap-api.com/v1",
  "Fast Server": "https://fast-api.com/v1", 
  "Reliable Server": "https://reliable-api.com/v1"
}
```

### Real Examples
```json
{
  "Local Backend": "/api",
  "NekoAPI": "https://nekoapi.com",
  "Alternative": "https://alternative-api.com/v1",
  "Backup": "https://backup-api.com/v1"
}
```

## ✅ What You Get

- **Multi-Server Support**: Test tokens across all your servers
- **Real-time Switching**: Switch between APIs without reloading
- **Balance Comparison**: See balances from multiple providers
- **Usage Tracking**: Monitor usage across different servers
- **Automatic Failover**: If one server is down, try others

## 🔧 Server Requirements

Your API should support:
- ✅ OpenAI-compatible endpoints (`/v1/chat/completions`)
- ✅ Token validation (`/v1/dashboard/billing/subscription`)
- ✅ Usage tracking (`/v1/dashboard/billing/usage`)
- ✅ CORS headers for web access

## 💡 Pro Tips

1. **Use descriptive names** like "Fast Server", "Cheap Server"
2. **Always include `https://`** in your URLs
3. **Keep "Local Backend": "/api"** for integrated features
4. **Test your URLs** before deploying
5. **Add multiple servers** for redundancy

## 🚨 Important Notes

- Changes take effect immediately after saving
- Invalid URLs will show errors in the interface
- Keep your API keys secure (never put them in URLs)
- Monitor usage to avoid unexpected charges

---

**That's it!** Your custom API servers will appear as tabs in the interface, and you can switch between them to compare prices, stability, and features. 🎉
