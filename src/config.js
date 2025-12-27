/**
 * ============================================================
 * CONFIG.JS - Environment Variables
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Exports the API URL from environment variables.
 * 
 * WHY USE ENVIRONMENT VARIABLES?
 * - Different URLs for development vs production
 * - Keeps sensitive info out of code
 * - Easy to change without editing code
 * 
 * HOW IT WORKS:
 * 1. Create a .env file in your project root:
 *    VITE_API_URL=http://localhost:8000
 * 
 * 2. For production (Netlify), set environment variable:
 *    VITE_API_URL=https://plot-twist-you-are-the-author-fdc848555cc9.herokuapp.com
 * 
 * 3. Vite makes it available via import.meta.env
 * 
 * NOTE: Vite requires env vars to start with VITE_ to be exposed to frontend
 */

export const API_URL = import.meta.env.VITE_API_URL;
