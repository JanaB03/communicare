import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("🔍 DEBUGGING: main.tsx is executing");
const rootElement = document.getElementById('root');
console.log("🔍 DEBUGGING: Root element:", rootElement);

try {
  console.log("🔍 DEBUGGING: About to render App");
  createRoot(rootElement!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log("🔍 DEBUGGING: App render called successfully");
} catch (error) {
  console.error("🔍 DEBUGGING ERROR:", error);
  // Create an error display element that will show up even if React fails
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.margin = '20px';
  errorDiv.style.background = '#ffdddd';
  errorDiv.style.border = '1px solid #ff0000';
  errorDiv.innerHTML = `<h2>Error rendering app:</h2><pre>${error}</pre>`;
  document.body.appendChild(errorDiv);
}