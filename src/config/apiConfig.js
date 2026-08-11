// Centralized API Base URL configuration supporting Vercel production deployment via VITE_API_BASE_URL or VITE_API_URL
const envUrl = import.meta.env ? (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) : null;

export const API_BASE_URL = envUrl ? envUrl.replace(/\/$/, '') : 'http://localhost:8080';
