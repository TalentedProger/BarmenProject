import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Типы для глобальных переменных загрузчика
declare global {
  interface Window {
    appReady: boolean;
    appLoadTimeout: number;
    loadProgressInterval: number;
    hideLoader: () => void;
    logLoadStep: (step: string) => void;
    logLoadError: (error: unknown, source?: string) => void;
    showLoadError: (reason: string) => void;
    loadSteps: Array<{ step: string; time: string }>;
    loadErrors: Array<{ error: string; source: string; time: string }>;
  }
}

// Логирование этапа
const logStep = (step: string) => {
  if (window.logLoadStep) {
    window.logLoadStep(step);
  } else {
    console.log('[LOAD]', step);
  }
};

// Логирование ошибки
const logError = (error: unknown, source?: string) => {
  if (window.logLoadError) {
    window.logLoadError(error, source);
  } else {
    console.error('[LOAD ERROR]', source, error);
  }
};

logStep('main.tsx module started executing');

const rootElement = document.getElementById("root");

function showFatalError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Неизвестная ошибка";

  logError(error, 'showFatalError');

  if (rootElement) {
    rootElement.innerHTML = `<div style="padding:20px;color:#ff6b6b;font-family:system-ui,sans-serif;background:#0A0A0D;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="font-size:48px;margin-bottom:16px;">🍸</div>
      <h2 style="color:#00D9FF;margin-bottom:12px;">Ошибка загрузки</h2>
      <p style="color:#888;margin-bottom:20px;max-width:520px;text-align:center;">${message}</p>
      <button onclick="location.reload()" style="padding:12px 24px;background:#00D9FF;border:none;border-radius:8px;color:#000;cursor:pointer;font-weight:500;">
        Перезагрузить
      </button>
    </div>`;
  }

  if (window.hideLoader) window.hideLoader();
  if (window.appLoadTimeout) clearTimeout(window.appLoadTimeout);
  if (window.loadProgressInterval) clearInterval(window.loadProgressInterval);
}

window.addEventListener("error", (event) => {
  // Не ломаем UX из‑за случайных ошибок загрузки ресурсов (favicon и т.п.)
  const target = event.target as any;
  if (target && (target.tagName === "IMG" || target.tagName === "LINK" || target.tagName === "SCRIPT")) {
    logStep('Resource load error (ignored): ' + (target.src || target.href || 'unknown'));
    return;
  }

  showFatalError((event as ErrorEvent).error || (event as any).message);
});

window.addEventListener("unhandledrejection", (event) => {
  showFatalError((event as PromiseRejectionEvent).reason);
});

logStep('Root element: ' + (rootElement ? 'found' : 'NOT FOUND'));

if (rootElement) {
  try {
    logStep('Creating React root');
    const root = createRoot(rootElement);
    
    logStep('Rendering App component');
    root.render(<App />);
    
    logStep('App rendered, scheduling hideLoader');
    
    // Скрываем загрузчик после первого рендера
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        logStep('Double rAF callback, calling hideLoader');
        if (window.hideLoader) {
          window.hideLoader();
        }
        // Очищаем таймаут безопасности
        if (window.appLoadTimeout) {
          clearTimeout(window.appLoadTimeout);
        }
        if (window.loadProgressInterval) {
          clearInterval(window.loadProgressInterval);
        }
      });
    });
  } catch (error: any) {
    logError(error, 'main.tsx catch block');
    showFatalError(error);
  }
} else {
  logError('Root element not found!', 'main.tsx');
  console.error('[APP] Root element not found!');
}
