import { useEffect, useRef, useState } from 'react';

interface KonfHubWidgetProps {
  eventId?: string;
  buttonId?: string;
  mode?: 'button' | 'iframe';
  ticketId?: string;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  className?: string;
}

/**
 * KonfHub Widget Component
 * Integrates KonfHub's ticketing widget for seamless pass purchases
 */
export function KonfHubWidget({
  eventId = import.meta.env.VITE_KONFHUB_EVENT_ID || 'final-tcet-esummit26',
  buttonId = import.meta.env.VITE_KONFHUB_BUTTON_ID || 'btn_a2352136e92a',
  mode = 'iframe',
  ticketId,
  onSuccess,
  onClose,
  className = '',
}: KonfHubWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (mode === 'button') {
      let currentRetryCount = 0;
      const baseDelay = isMobile ? 2000 : 500;

      const loadScript = () => {
        const script = document.createElement('script');
        script.src = 'https://widget.konfhub.com/widget.js';
        script.setAttribute('button_id', buttonId);
        script.async = true;

        script.onload = () => {
          setIsLoading(false);
          setHasError(false);
          setRetryCount(0); // Reset retry count on success
        };

        script.onerror = () => {
          console.error(`Failed to load KonfHub widget script (attempt ${currentRetryCount + 1})`);
          currentRetryCount++;
          setRetryCount(currentRetryCount);

          if (currentRetryCount < maxRetries) {
            // Exponential backoff: 2^retryCount * baseDelay
            const delay = Math.pow(2, currentRetryCount) * baseDelay;
            setTimeout(loadScript, delay);
          } else {
            setIsLoading(false);
            setHasError(true);
          }
        };

        if (widgetRef.current) {
          widgetRef.current.appendChild(script);
        }
      };

      // Initial delay before first attempt
      const timeoutId = setTimeout(loadScript, baseDelay);

      return () => {
        clearTimeout(timeoutId);
        if (widgetRef.current) {
          const scripts = widgetRef.current.querySelectorAll('script');
          scripts.forEach(script => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          });
        }
      };
    } else {
      // Iframe mode - use timeout to assume successful load
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, isMobile ? 3000 : 2000); // Give more time on mobile
      
      return () => clearTimeout(timeoutId);
    }
  }, [mode, buttonId, isMobile, maxRetries]);

  // Listen for messages from KonfHub widget
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from KonfHub
      if (event.origin !== 'https://konfhub.com' && event.origin !== 'https://widget.konfhub.com') {
        return;
      }

      const data = event.data;

      if (data.type === 'konfhub_purchase_complete') {
        // KonfHub purchase completed successfully
        onSuccess?.(data);
      } else if (data.type === 'konfhub_widget_closed') {
        // KonfHub widget closed by user
        onClose?.();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onClose]);

  // Allow KonfHub widget on mobile — improve robustness with load handlers and retries
  // (Previously disabled mobile to avoid loops; re-enable with safer behavior)

  if (mode === 'button') {
    if (hasError && retryCount >= maxRetries) {
      // Show fallback UI after max retries
      return (
        <div className={`flex items-center justify-center p-8 bg-muted/50 rounded-lg ${className}`}>
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="font-semibold mb-2">Pass Booking Temporarily Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We're experiencing technical difficulties with our booking system.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Please try again later or contact support if the issue persists.
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setRetryCount(0);
                setIsLoading(true);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div ref={widgetRef} className={className}>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">
                {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading booking system...'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Iframe mode with load/retry handling
  const iframeSrc = `https://konfhub.com/widget/${eventId}?desc=false&secondaryBg=F7F7F7&ticketBg=F7F7F7&borderCl=F7F7F7&bg=FFFFFF&fontColor=1e1f24&ticketCl=1e1f24&btnColor=d0021b&fontFamily=Hind&borderRadius=10&widget_type=standard${ticketId ? `&tickets=${ticketId}&ticketId=${ticketId}%7C1` : ''}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setRetryCount(0);
  };

  // simple iframe retry when widget fails to load (network issues / KonfHub rate limits)
  useEffect(() => {
    if (!isLoading || retryCount >= maxRetries) return;

    const timer = setTimeout(() => {
      // if still loading after reasonable time, increment retry and attempt soft reload
      setRetryCount((c) => {
        const next = c + 1;
        if (next <= maxRetries) {
          const iframe = document.getElementById('konfhub-widget') as HTMLIFrameElement | null;
          if (iframe) {
            // soft reload
            iframe.src = iframeSrc + `&reload=${Date.now()}`;
          }
        }
        if (next >= maxRetries) {
          setHasError(true);
          setIsLoading(false);
        }
        return next;
      });
    }, isMobile ? 5000 : 3000);

    return () => clearTimeout(timer);
  }, [isLoading, retryCount, maxRetries, isMobile, iframeSrc]);

  // compute mobile-friendly iframe height so KonfHub content fills the dialog
  const mobileIframeHeight = 'calc(100vh - 140px)'; // leave space for dialog header/controls

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading booking system...'}
            </p>
          </div>
        </div>
      )}
      <iframe
        src={iframeSrc}
        id="konfhub-widget"
        title={`Register for ${import.meta.env.VITE_APP_NAME || 'E-Summit 2026'}`}
        width="100%"
        height={isMobile ? mobileIframeHeight : undefined}
        style={{
          border: 'none',
          minHeight: isMobile ? mobileIframeHeight : '60vh',
          height: isMobile ? mobileIframeHeight : '80vh',
          maxHeight: isMobile ? `calc(100vh - 80px)` : '90vh',
          display: 'block'
        }}
        className="rounded-lg w-full h-full"
        loading="eager"
        allow="fullscreen; payment; clipboard-write; encrypted-media; geolocation; microphone; camera"
        allowFullScreen
        onLoad={handleIframeLoad}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
          <div className="bg-muted/80 p-6 rounded-lg text-center max-w-md">
            <div className="text-xl font-semibold mb-2">Booking Unavailable</div>
            <div className="text-sm text-muted-foreground mb-4">We couldn't load the booking widget. Please try again or use a desktop.</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  setRetryCount(0);
                  setHasError(false);
                  setIsLoading(true);
                  const iframe = document.getElementById('konfhub-widget') as HTMLIFrameElement | null;
                  if (iframe) iframe.src = iframeSrc + `&reload=${Date.now()}`;
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Retry
              </button>
              <button
                onClick={() => onClose?.()}
                className="px-4 py-2 border rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
