import { useEffect, useRef, memo, useState } from 'react';

// Ad Unit - each instance gets unique key to prevent conflicts
let adCounter = 0;

const AdUnit = memo(({ slot = "1650043805", format = "auto", width = "100%", height = "90px" }) => {
  const adRef = useRef(null);
  const [adId] = useState(() => `ad-${++adCounter}`);
  const [status, setStatus] = useState('loading'); // loading, success, failed

  useEffect(() => {
    if (typeof window === 'undefined' || status !== 'loading') return;

    let attempts = 0;
    const maxAttempts = 15;
    let timeoutId = null;

    const tryInitAd = () => {
      attempts++;
      const adElement = adRef.current;
      
      if (!adElement) {
        if (attempts < maxAttempts) {
          timeoutId = setTimeout(tryInitAd, 400);
        }
        return;
      }

      const rect = adElement.getBoundingClientRect();
      const actualWidth = Math.floor(rect.width);

      console.log(`[${adId}] Attempt ${attempts}: width=${actualWidth}px`);

      // AdSense needs minimum 300px for most ad formats
      if (actualWidth >= 300) {
        try {
          // Skip if already processed
          if (adElement.dataset.adsbygoogleStatus === 'done') {
            console.log(`[${adId}] Already initialized`);
            setStatus('success');
            return;
          }
          
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`[${adId}] Initialized successfully at ${actualWidth}px`);
          setStatus('success');
        } catch (e) {
          console.error(`[${adId}] Init error:`, e.message);
          // Don't retry on actual AdSense errors - it means the ad loaded but failed
          if (e.message?.includes('No slot size')) {
            // This means AdSense couldn't find a suitable ad - not a width issue
            setStatus('failed');
          } else if (attempts < maxAttempts) {
            timeoutId = setTimeout(tryInitAd, 600);
          } else {
            setStatus('failed');
          }
        }
      } else if (attempts < maxAttempts) {
        // Width too small, retry
        timeoutId = setTimeout(tryInitAd, 400);
      } else {
        console.warn(`[${adId}] Failed: width never reached 300px (got ${actualWidth}px)`);
        setStatus('failed');
      }
    };

    // Start after DOM settles
    timeoutId = setTimeout(tryInitAd, 500);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [adId, status]);

  // Show placeholder for failed ads
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
        backgroundColor: status === 'loading' ? '#f8fafc' : 'transparent',
      }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad - needs min 320px container
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div 
    className={`w-full my-4 ${className}`}
    style={{ minWidth: '320px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div 
        style={{ minHeight: '100px', padding: '8px', minWidth: '304px' }}
      >
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

// Vertical Sidebar Ad - fixed 300px width
export const AdBannerVertical = memo(({ className = "" }) => (
  <div 
    className={`${className}`} 
    style={{ width: '300px', minWidth: '300px', maxWidth: '300px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div style={{ minHeight: '600px', padding: '0', width: '300px' }}>
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

// Square Ad - 300x250
export const AdBannerSquare = memo(({ className = "" }) => (
  <div 
    className={`${className}`} 
    style={{ width: '300px', minWidth: '300px' }}
  >
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div style={{ minHeight: '250px', padding: '0', width: '300px' }}>
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
