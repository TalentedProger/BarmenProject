import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Диагностика загрузки для мобильных устройств
declare global {
  interface Window {
    loadStart: number;
    loadSteps: string[];
    hideLoader: () => void;
    logStep: (step: string) => void;
  }
}

if (window.logStep) window.logStep('main.tsx executing');

console.log('[LOAD] main.tsx started', new Date().toISOString());
console.log('[LOAD] User Agent:', navigator.userAgent);
console.log('[LOAD] Screen:', window.innerWidth, 'x', window.innerHeight);
console.log('[LOAD] Online:', navigator.onLine);
console.log('[LOAD] Connection:', (navigator as any).connection?.effectiveType || 'unknown');

const rootElement = document.getElementById("root");
if (rootElement) {
  if (window.logStep) window.logStep('Rendering React app');
  console.log('[LOAD] Root element found, rendering App...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('[LOAD] App rendered successfully');
    if (window.logStep) window.logStep('React rendered');
    
    // Скрываем загрузчик после первого рендера
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.hideLoader) window.hideLoader();
      });
    });
  } catch (error) {
    console.error('[LOAD] App render error:', error);
    if (window.logStep) window.logStep('ERROR: ' + error);
    // Показываем ошибку пользователю
    rootElement.innerHTML = `<div style="padding:20px;color:#ff6b6b;font-family:sans-serif;background:#0A0A0D;min-height:100vh;">
      <h2>Ошибка загрузки</h2>
      <p>${error}</p>
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
