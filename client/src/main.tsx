// ПЕРВАЯ СТРОКА - логируем что модуль начал выполняться
if (typeof window !== 'undefined' && window.logStep) {
  window.logStep('main.tsx module start');
}

import { createRoot } from "react-dom/client";

if (typeof window !== 'undefined' && window.logStep) {
  window.logStep('react-dom loaded');
}

import App from "./App";

if (typeof window !== 'undefined' && window.logStep) {
  window.logStep('App.tsx loaded');
}

import "./index.css";

if (typeof window !== 'undefined' && window.logStep) {
  window.logStep('CSS loaded');
}

// Диагностика загрузки для мобильных устройств
declare global {
  interface Window {
    loadStart: number;
    loadSteps: string[];
    loadErrors: string[];
    hideLoader: () => void;
    logStep: (step: string) => void;
  }
}

console.log('[LOAD] main.tsx fully imported', new Date().toISOString());
console.log('[LOAD] User Agent:', navigator.userAgent);
console.log('[LOAD] Screen:', window.innerWidth, 'x', window.innerHeight);
console.log('[LOAD] Online:', navigator.onLine);
console.log('[LOAD] Connection:', (navigator as any).connection?.effectiveType || 'unknown');

const rootElement = document.getElementById("root");
if (rootElement) {
  if (window.logStep) window.logStep('Mounting React');
  console.log('[LOAD] Root element found, rendering App...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('[LOAD] App rendered successfully');
    if (window.logStep) window.logStep('React mounted');
    
    // Скрываем загрузчик после первого рендера
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.logStep) window.logStep('First paint');
        if (window.hideLoader) window.hideLoader();
      });
    });
  } catch (error: any) {
    console.error('[LOAD] App render error:', error);
    if (window.logStep) window.logStep('RENDER ERROR: ' + (error?.message || error));
    // Показываем ошибку пользователю
    rootElement.innerHTML = `<div style="padding:20px;color:#ff6b6b;font-family:sans-serif;background:#0A0A0D;min-height:100vh;">
      <h2>Ошибка загрузки</h2>
      <p>${error?.message || error}</p>
      <p style="color:#888;font-size:12px;">User Agent: ${navigator.userAgent}</p>
      <button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;background:#00D9FF;border:none;border-radius:8px;color:#000;cursor:pointer;">
        Перезагрузить
      </button>
    </div>`;
    if (window.hideLoader) window.hideLoader();
  }
} else {
  console.error('[LOAD] Root element not found!');
  if (window.logStep) window.logStep('ERROR: Root not found');
}
