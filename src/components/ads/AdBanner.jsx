import { useEffect, useRef, memo } from 'react';

// Simple Ad Unit - loads when mounted
const AdUnit = memo(({ slot = "1650043805", style = {} }) => {
  const adRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialized.current) return;

    // Wait for DOM to be ready and container to have width
    const timer = setTimeout(() => {
      try {
        const container = adRef.current?.parentElement;
        if (container && container.offsetWidth > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
      } catch (e) {
        // Silent fail
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      data-ad-format="auto"
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

// Vertical Sidebar Ad
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`${className}`} style={{ width: '100%', minWidth: '250px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div className="p-3" style={{ minHeight: '500px', width: '100%' }}>
        <AdUnit slot="1650043805" style={{ minHeight: '480px' }} />
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
