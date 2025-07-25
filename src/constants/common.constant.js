export const ITEMS_PER_PAGE = 10; // this value must keep same as the one defined in backend!

// Environment configuration
export const SHOW_BALANCE = process.env.REACT_APP_SHOW_BALANCE !== 'false';
export const SHOW_DETAIL = process.env.REACT_APP_SHOW_DETAIL !== 'false';
export const SHOW_ICONGITHUB = process.env.REACT_APP_SHOW_ICONGITHUB !== 'false';

// Support both NewAPI servers and local backend
export const BASE_URL = JSON.parse(process.env.REACT_APP_BASE_URL || '{"Local Backend": "/api"}');

// Webscout feature flags
export const ENABLE_WEBSCOUT = process.env.REACT_APP_ENABLE_WEBSCOUT !== 'false';
export const ENABLE_SEARCH = process.env.REACT_APP_ENABLE_SEARCH !== 'false';
export const ENABLE_IMAGE_GEN = process.env.REACT_APP_ENABLE_IMAGE_GEN !== 'false';
export const ENABLE_TTS = process.env.REACT_APP_ENABLE_TTS !== 'false';
export const ENABLE_WEATHER = process.env.REACT_APP_ENABLE_WEATHER !== 'false';

// Default provider settings
export const DEFAULT_PROVIDER = process.env.REACT_APP_DEFAULT_PROVIDER || 'openai';
export const DEFAULT_MODEL = process.env.REACT_APP_DEFAULT_MODEL || 'gpt-3.5-turbo';

// Token validation patterns
export const TOKEN_PATTERNS = {
  newapi: /^sk-[a-zA-Z0-9]{48}$/,
  webscout: /^ws_[a-zA-Z0-9]{32}$/
};

// API endpoints
export const API_ENDPOINTS = {
  health: '/api/health',
  providers: '/api/providers',
  models: '/api/models',
  chat: '/api/chat/completions',
  search: '/api/search',
  images: '/api/images/generations',
  speech: '/api/audio/speech',
  weather: '/api/weather',
  validateToken: '/api/auth/validate',
  tokenUsage: '/api/auth/usage'
};
