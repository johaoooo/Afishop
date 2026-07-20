import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import SplashScreen from './components/SplashScreen.tsx'

function Root() {
  const [ready, setReady] = useState(false);

  return (
    <StrictMode>
      {!ready ? (
        <SplashScreen onFinish={() => setReady(true)} />
      ) : (
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      )}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />)
