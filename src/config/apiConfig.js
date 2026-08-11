// Centralized API Base URL configuration
// Defaults to the live production Railway backend URL so all Vercel deployments (production & preview URLs) connect seamlessly
const envUrl = import.meta.env ? (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) : null;

export const API_BASE_URL = envUrl && envUrl.trim() !== ''
  ? envUrl.replace(/\/$/, '')
  : 'https://quadlogic-optinovabd-production.up.railway.app';
