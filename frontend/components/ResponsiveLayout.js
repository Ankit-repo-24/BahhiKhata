import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

export default function ResponsiveLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Public pages that don't need authentication
  const publicPages = ['/', '/login', '/register', '/about'];
  const isPublicPage = publicPages.includes(router.pathname);

  if (isPublicPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <DesktopLayout>{children}</DesktopLayout>
  );
}