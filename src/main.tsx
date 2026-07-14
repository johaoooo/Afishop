import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import SplashScreen from './components/SplashScreen.tsx'

function Root() {
  const [ready, setReady] = useState(false);

  return (
    <StrictMode>
      {!ready && <SplashScreen onFinish={() => setReady(true)} />}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <HelmetProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </HelmetProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />)
