// Centralized API Base URL configuration supporting Vercel production deployment via environment variable VITE_API_BASE_URL
export const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  : 'http://localhost:8080';
