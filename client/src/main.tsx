import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Типы для глобальных переменных загрузчика
declare global {
  interface Window {
    appReady: boolean;
    appLoadTimeout: number;
    hideLoader: () => void;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    
    // Скрываем загрузчик после первого рендера
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.hideLoader) {
          window.hideLoader();
        }
        // Очищаем таймаут безопасности
        if (window.appLoadTimeout) {
          clearTimeout(window.appLoadTimeout);
        }
      });
    });
  } catch (error: any) {
    console.error('[APP] Render error:', error);
    rootElement.innerHTML = `<div style="padding:20px;color:#ff6b6b;font-family:system-ui,sans-serif;background:#0A0A0D;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="font-size:48px;margin-bottom:16px;">🍸</div>
      <h2 style="color:#00D9FF;margin-bottom:12px;">Ошибка загрузки</h2>
      <p style="color:#888;margin-bottom:20px;">${error?.message || 'Неизвестная ошибка'}</p>
      <button onclick="location.reload()" style="padding:12px 24px;background:#00D9FF;border:none;border-radius:8px;color:#000;cursor:pointer;font-weight:500;">
        Перезагрузить
      </button>
    </div>`;
    if (window.hideLoader) window.hideLoader();
  }
} else {
  console.error('[APP] Root element not found!');
}
