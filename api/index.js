// Vercel Serverless Function Entry Point
import app, { initializeApp } from './server.js';

// Initialize the app on first request
let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await initializeApp();
    initialized = true;
  }
  return app(req, res);
}