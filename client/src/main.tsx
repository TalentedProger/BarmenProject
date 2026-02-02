import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Скрываем лоадер СРАЗУ как только JS выполнился
const hideLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) loader.style.display = 'none';
};

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
  // Скрываем лоадер сразу после вызова render (не ждём rAF)
  hideLoader();
}
