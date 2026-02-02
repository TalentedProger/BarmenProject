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
    
    // Скрываем загрузчик после рендера
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.hideLoader) {
          window.hideLoader();
        }
        if (window.appLoadTimeout) {
          clearTimeout(window.appLoadTimeout);
        }
      });
    });
  } catch (error) {
    console.error('[APP] Render error:', error);
    // Даже при ошибке скрываем лоадер
    if (window.hideLoader) {
      window.hideLoader();
    }
  }
} else {
  console.error('[APP] Root element not found!');
}
