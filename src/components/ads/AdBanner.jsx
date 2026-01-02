import { useEffect, useRef, memo, useState } from 'react';

// Ad Unit with single initialization
let adCounter = 0;

const AdUnit = memo(({ slot = "1650043805", format = "auto", width = "100%", height = "90px" }) => {
  const adRef = useRef(null);
  const [adId] = useState(() => `ad-${++adCounter}`);
  const [initialized, setInitialized] = useState(false);
  const initAttempted = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized || initAttempted.current) return;

    const adElement = adRef.current;
    if (!adElement) return;

    let timeoutId = null;
    let observerCleanup = null;

    const initAd = () => {
      if (initAttempted.current || initialized) return;
      
      const rect = adElement.getBoundingClientRect();
      const style = window.getComputedStyle(adElement);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width >= 300;

      if (!isVisible) return;

      initAttempted.current = true;
      
      try {
        if (adElement.dataset.adsbygoogleStatus === 'done') {
          console.log(`[${adId}] Already initialized`);
          setInitialized(true);
          return;
        }
        
        console.log(`[${adId}] Initializing at ${Math.floor(rect.width)}x${Math.floor(rect.height)}`);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setInitialized(true);
        console.log(`[${adId}] Success`);
      } catch (e) {
        console.error(`[${adId}] Error:`, e.message);
        initAttempted.current = false; // Allow retry on error
      }
    };

    // Use IntersectionObserver to detect when ad becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0 && !initAttempted.current) {
            const rect = entry.boundingClientRect;
            if (rect.width >= 300) {
              timeoutId = setTimeout(initAd, 100);
            }
          }
        });
      },
      { threshold: 0.01 }
    );

    observer.observe(adElement);
    observerCleanup = () => observer.disconnect();

    // Fallback: try once after delay if observer doesn't trigger
    const fallbackTimer = setTimeout(() => {
      if (!initAttempted.current) {
        initAd();
      }
    }, 2000);

    return () => {
      if (observerCleanup) observerCleanup();
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, [adId, initialized]);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{
        display: 'block',
        width: width,
        minWidth: '300px',
        height: height,
        minHeight: height,
        backgroundColor: initialized ? 'transparent' : '#f8fafc',
      }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div 
    className={`w-full my-4 ${className}`}
    style={{ minWidth: '320px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div style={{ minHeight: '100px', padding: '8px', minWidth: '304px' }}>
        <AdUnit 
          slot="1650043805" 
          format="auto" 
          width="100%" 
          height="90px" 
        />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad
export const AdBannerVertical = memo(({ className = "" }) => (
  <div 
    className={`${className}`} 
    style={{ width: '300px', minWidth: '300px', maxWidth: '300px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div style={{ minHeight: '600px', width: '300px' }}>
        <AdUnit 
          slot="1650043805" 
          format="vertical" 
          width="300px" 
          height="600px" 
        />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad
export const AdBannerSquare = memo(({ className = "" }) => (
  <div 
    className={`${className}`} 
    style={{ width: '300px', minWidth: '300px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div style={{ minHeight: '250px', width: '300px' }}>
        <AdUnit 
          slot="1650043805" 
          format="rectangle" 
          width="300px" 
          height="250px" 
        />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
