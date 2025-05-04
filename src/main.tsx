
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create offline-capable progressive web app
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
