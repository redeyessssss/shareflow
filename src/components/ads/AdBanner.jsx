import { useEffect, useRef, memo, useState } from 'react';

// Simple Ad Unit - loads when mounted
const AdUnit = memo(({ slot = "1650043805", format = "auto", style = {} }) => {
  const adRef = useRef(null);
  const initialized = useRef(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialized.current) return;

    const initAd = () => {
      try {
        const container = adRef.current?.parentElement;
        if (container && container.offsetWidth > 0 && !initialized.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
      } catch (e) {
        console.warn('Ad init error:', e);
        setAdError(true);
      }
    };

    // Try multiple times with increasing delays
    const timers = [
      setTimeout(initAd, 500),
      setTimeout(initAd, 1500),
      setTimeout(initAd, 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (adError) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg"
        style={{ minHeight: style.minHeight || '90px' }}
      >
        <span className="text-xs text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ 
        display: 'block', 
        width: '100%',
        minHeight: style.minHeight || '90px',
        ...style 
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
  <div className={`w-full my-4 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="p-3" style={{ minHeight: '100px' }}>
        <AdUnit slot="1650043805" style={{ minHeight: '90px' }} />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad - Fixed for left/right sidebars
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`${className}`} style={{ width: '100%', maxWidth: '300px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div className="p-2" style={{ minHeight: '600px', width: '100%' }}>
        <AdUnit slot="1650043805" format="vertical" style={{ minHeight: '580px', width: '100%' }} />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div className="p-3" style={{ minHeight: '250px' }}>
        <AdUnit slot="1650043805" style={{ minHeight: '230px' }} />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
