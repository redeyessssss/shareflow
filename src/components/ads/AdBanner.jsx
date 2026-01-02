import { useEffect, useRef, memo, useState } from 'react';

// Ad slot IDs for different sizes
const AD_SLOTS = {
  sidebar: '8339575239',    // 300x600
  horizontal: '5426810745', // 728x90
  mobile: '4113729078',     // 320x100
};

// Ad Unit with single initialization
let adCounter = 0;

const AdUnit = memo(({ slot, width, height, format = "auto" }) => {
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
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;

      if (!isVisible) return;

      initAttempted.current = true;
      
      try {
        if (adElement.dataset.adsbygoogleStatus === 'done') {
          console.log(`[${adId}] Already initialized`);
          setInitialized(true);
          return;
        }
        
        console.log(`[${adId}] Initializing ${width}x${height} at ${Math.floor(rect.width)}x${Math.floor(rect.height)}`);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setInitialized(true);
        
        setTimeout(() => {
          const status = adElement.dataset.adsbygoogleStatus;
          const filled = adElement.getAttribute('data-ad-status');
          console.log(`[${adId}] Status: ${status}, Filled: ${filled || 'checking...'}`);
        }, 2000);
        
      } catch (e) {
        console.error(`[${adId}] Error:`, e.message);
        initAttempted.current = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0 && !initAttempted.current) {
            timeoutId = setTimeout(initAd, 100);
          }
        });
      },
      { threshold: 0.01 }
    );

    observer.observe(adElement);
    observerCleanup = () => observer.disconnect();

    const fallbackTimer = setTimeout(() => {
      if (!initAttempted.current) initAd();
    }, 2000);

    return () => {
      if (observerCleanup) observerCleanup();
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, [adId, initialized, width, height]);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{
        display: 'inline-block',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: initialized ? 'transparent' : '#f8fafc',
      }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
    />
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad - 728x90
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`w-full my-4 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="flex justify-center items-center p-2" style={{ minHeight: '94px' }}>
        <AdUnit 
          slot={AD_SLOTS.horizontal}
          width={728}
          height={90}
        />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad - 300x600
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`${className}`} style={{ width: '300px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div className="flex justify-center items-center" style={{ minHeight: '604px' }}>
        <AdUnit 
          slot={AD_SLOTS.sidebar}
          width={300}
          height={600}
        />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Mobile Ad - 320x100
export const AdBannerMobile = memo(({ className = "" }) => (
  <div className={`w-full my-4 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="flex justify-center items-center p-2" style={{ minHeight: '104px' }}>
        <AdUnit 
          slot={AD_SLOTS.mobile}
          width={320}
          height={100}
        />
      </div>
    </div>
  </div>
));

AdBannerMobile.displayName = 'AdBannerMobile';

// Square Ad - 300x250 (using sidebar slot as fallback)
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`${className}`} style={{ width: '300px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div className="flex justify-center items-center" style={{ minHeight: '254px' }}>
        <AdUnit 
          slot={AD_SLOTS.sidebar}
          width={300}
          height={250}
        />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
