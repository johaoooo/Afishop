import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* WhatsApp flottant — façon port 3002 */}
      <a
        href="https://wa.me/2290196062287"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter sur WhatsApp"
        className="pop-wa-float"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
      <BackToTop />
    </div>
  );
}
