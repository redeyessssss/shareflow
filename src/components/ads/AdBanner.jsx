import { useEffect, useRef, memo, useState } from 'react';

// Ad Unit - waits for element to have actual width before initializing
const AdUnit = memo(({ slot = "1650043805", format = "auto", width = "100%", height = "90px" }) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || adLoaded || adFailed) return;

    let attempts = 0;
    const maxAttempts = 10;

    const tryInitAd = () => {
      attempts++;
      const adElement = adRef.current;
      
      if (!adElement) {
        if (attempts < maxAttempts) {
          setTimeout(tryInitAd, 500);
        }
        return;
      }

      // Check if element has actual rendered width
      const rect = adElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(adElement);
      const actualWidth = rect.width || parseFloat(computedStyle.width) || adElement.offsetWidth;

      console.log(`Ad attempt ${attempts}: width=${actualWidth}`);

      if (actualWidth > 100) {
        try {
          // Check if this ad was already initialized
          if (adElement.dataset.adsbygoogleStatus === 'done') {
            setAdLoaded(true);
            return;
          }
          
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
          console.log('Ad initialized successfully');
        } catch (e) {
          console.error('Ad init error:', e);
          if (attempts >= maxAttempts) {
            setAdFailed(true);
          } else {
            setTimeout(tryInitAd, 1000);
          }
        }
      } else if (attempts < maxAttempts) {
        setTimeout(tryInitAd, 500);
      } else {
        console.warn('Ad failed: container never got width');
        setAdFailed(true);
      }
    };

    // Start after a delay to let CSS render
    const timer = setTimeout(tryInitAd, 300);
    return () => clearTimeout(timer);
  }, [adLoaded, adFailed]);

  if (adFailed) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg"
        style={{ width, height, minHeight: height }}
      >
        <span className="text-xs text-slate-400">Ad</span>
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
        height: height,
        minWidth: '300px',
        minHeight: height,
        backgroundColor: '#f8fafc',
      }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad - for content areas
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`w-full my-4 ${className}`}>
    <div 
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      style={{ minWidth: '320px' }}
    >
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div 
        className="flex items-center justify-center"
        style={{ minHeight: '100px', padding: '8px' }}
      >
        <AdUnit 
          slot="1650043805" 
          format="horizontal" 
          width="100%" 
          height="90px" 
        />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad - for sidebars
export const AdBannerVertical = memo(({ className = "" }) => (
  <div 
    className={`${className}`} 
    style={{ width: '300px', minWidth: '300px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div 
        className="flex items-center justify-center"
        style={{ minHeight: '600px', padding: '8px', width: '100%' }}
      >
        <AdUnit 
          slot="1650043805" 
          format="vertical" 
          width="284px" 
          height="600px" 
        />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`${className}`} style={{ minWidth: '300px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div 
        className="flex items-center justify-center"
        style={{ minHeight: '280px', padding: '8px' }}
      >
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
