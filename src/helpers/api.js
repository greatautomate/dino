import { showError } from './utils';
import axios from 'axios';
import { API_ENDPOINTS, BASE_URL, TOKEN_PATTERNS } from '../constants/common.constant';

export const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : '',
  timeout: 30000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
    return Promise.reject(error);
  }
);

// Webscout API functions
export const webscoutAPI = {
  // Health check
  health: () => API.get(API_ENDPOINTS.health),

  // Provider management
  getProviders: () => API.get(API_ENDPOINTS.providers),
  getModels: () => API.get(API_ENDPOINTS.models),

  // Chat completions
  chatCompletions: (data) => API.post(API_ENDPOINTS.chat, data),

  // Search
  search: (query, engine = 'google', maxResults = 10) =>
    API.get(API_ENDPOINTS.search, { params: { q: query, engine, max_results: maxResults } }),

  // Image generation
  generateImage: (data) => API.post(API_ENDPOINTS.images, data),

  // Text-to-speech
  textToSpeech: (data) => API.post(API_ENDPOINTS.speech, data),

  // Weather
  getWeather: (location) => API.get(API_ENDPOINTS.weather, { params: { location } }),

  // Authentication
  validateToken: (token) => API.post(API_ENDPOINTS.validateToken, { token }),
  getTokenUsage: (token) => API.post(API_ENDPOINTS.tokenUsage, { token }),
};

// Token validation helper
export const validateTokenFormat = (token) => {
  if (TOKEN_PATTERNS.newapi.test(token)) {
    return { valid: true, type: 'newapi' };
  } else if (TOKEN_PATTERNS.webscout.test(token)) {
    return { valid: true, type: 'webscout' };
  } else {
    return { valid: false, type: 'unknown' };
  }
};

// NewAPI compatibility functions
export const nekoAPI = {
  // Query multiple servers for token validation
  queryServers: async (apikey) => {
    const results = {};
    const tokenValidation = validateTokenFormat(apikey);

    for (const [serverName, baseUrl] of Object.entries(BASE_URL)) {
      try {
        if (baseUrl === '/api' || baseUrl.startsWith('/api')) {
          // Use local backend for both NewAPI and Webscout tokens
          const response = await webscoutAPI.validateToken(apikey);
          results[serverName] = response.data;
        } else {
          // Use external NewAPI server (only for NewAPI tokens)
          if (tokenValidation.type === 'newapi') {
            const response = await axios.get(`${baseUrl}/v1/dashboard/billing/subscription`, {
              headers: { Authorization: `Bearer ${apikey}` },
              timeout: 10000
            });
            results[serverName] = {
              status: 'valid',
              server: serverName,
              balance: response.data.hard_limit_usd,
              usage: response.data.usage,
              subscription: response.data
            };
          } else {
            results[serverName] = {
              status: 'unsupported',
              server: serverName,
              error: 'Webscout tokens not supported on external NewAPI servers'
            };
          }
        }
      } catch (error) {
        results[serverName] = {
          status: 'error',
          server: serverName,
          error: error.response?.data?.error?.message || error.message
        };
      }
    }

    return results;
  }
};
