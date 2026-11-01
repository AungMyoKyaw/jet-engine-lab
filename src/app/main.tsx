import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import './ui/style.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load',()=>{navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(()=>{ /* Offline cache optional: direct website still works. */ });});
}
