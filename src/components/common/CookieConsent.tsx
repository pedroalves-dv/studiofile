'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show on client side and if consent not already given
    if (typeof window !== 'undefined') {
      const hasConsented = localStorage.getItem('sf-cookie-consent');
      if (!hasConsented) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('sf-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleMinimalOnly = () => {
    localStorage.setItem('sf-cookie-consent', 'minimal');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ink text-canvas z-40 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-mono text-sm uppercase letter-spacing-display font-semibold mb-2">
            Cookie Consent
          </h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimalOnly}
            className="whitespace-nowrap"
          >
            Necessary Only
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAcceptAll}
            className="whitespace-nowrap"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
