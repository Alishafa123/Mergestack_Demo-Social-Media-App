import '@/index.css';
import App from '@/App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { JotaiProvider } from 'jotai-controller';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </StrictMode>,
);
