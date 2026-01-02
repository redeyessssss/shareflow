import { useEffect, useRef, memo, useState } from 'react';

// Ad Unit with visibility detection
let adCounter = 0;

const AdUnit = memo(({ slot = "1650043805", format = "auto", width = "100%", height = "90px" }) => {
  const adRef = useRef(null);
  const [adId] = useState(() => `ad-${++adCounter}`);
  const [status, setStatus] = useState('waiting'); // waiting, loading, success, failed

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const adElement = adRef.current;
    if (!adElement) return;

    let timeoutId = null;
    let observerCleanup = null;

    const initAd = () => {
      if (status !== 'loading') return;
      
      try {
        if (adElement.dataset.adsbygoogleStatus === 'done') {
          console.log(`[${adId}] Already done`);
          setStatus('success');
          return;
        }
        
        const rect = adElement.getBoundingClientRect();
        console.log(`[${adId}] Initializing at ${Math.floor(rect.width)}px`);
        
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setStatus('success');
      } catch (e) {
        console.error(`[${adId}] Error:`, e.message);
        setStatus('failed');
      }
    };

    // Use IntersectionObserver to detect when ad becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            const rect = entry.boundingClientRect;
            console.log(`[${adId}] Visible: ${Math.floor(rect.width)}x${Math.floor(rect.height)}`);
            
            if (rect.width >= 300 && status === 'waiting') {
              setStatus('loading');
              // Small delay to ensure DOM is ready
              timeoutId = setTimeout(initAd, 100);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(adElement);
    observerCleanup = () => observer.disconnect();

    // Fallback: check after delays if observer doesn't trigger
    const fallbackCheck = () => {
      if (status !== 'waiting') return;
      
      const rect = adElement.getBoundingClientRect();
      const style = window.getComputedStyle(adElement);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
      
      if (isVisible && rect.width >= 300) {
        console.log(`[${adId}] Fallback init at ${Math.floor(rect.width)}px`);
        setStatus('loading');
        timeoutId = setTimeout(initAd, 100);
      }
    };

    const fallbackTimers = [
      setTimeout(fallbackCheck, 1000),
      setTimeout(fallbackCheck, 2000),
      setTimeout(fallbackCheck, 4000),
    ];

    return () => {
      if (observerCleanup) observerCleanup();
      if (timeoutId) clearTimeout(timeoutId);
      fallbackTimers.forEach(clearTimeout);
    };
  }, [adId, status]);

  // Trigger init when status changes to loading
  useEffect(() => {
    if (status === 'loading') {
      const adElement = adRef.current;
      if (!adElement) return;
      
      try {
        if (adElement.dataset.adsbygoogleStatus === 'done') {
          setStatus('success');
          return;
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setStatus('success');
      } catch (e) {
        console.error(`[${adId}] Init error:`, e.message);
        setStatus('failed');
      }
    }
  }, [status, adId]);

  if (status === 'failed') {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg"
        style={{ width, height, minHeight: height }}
      >
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
    );
  }

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
        backgroundColor: status === 'waiting' ? '#f8fafc' : 'transparent',
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
