import { useEffect, useRef, memo } from 'react';

// Core Ad Unit
const AdUnit = memo(({ slot = "1650043805" }) => {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || pushed.current) return;
    
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !pushed.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        }
      } catch (e) {
        console.log('Ad push error:', e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%' }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad Banner
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`ad-horizontal w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Sponsored</span>
      </div>
      <div className="p-4" style={{ minHeight: '100px' }}>
        <AdUnit slot="1650043805" />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad Banner
export const AdBannerVertical = memo(({ className = "", position = "left" }) => (
  <div className={`ad-vertical w-full ${className}`} style={{ width: '100%' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Advertisement</span>
      </div>
      <div className="p-3" style={{ minHeight: '600px' }}>
        <AdUnit slot="1650043805" />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad Banner
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`ad-square w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Ad</span>
      </div>
      <div className="p-3" style={{ minHeight: '250px' }}>
        <AdUnit slot="1650043805" />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
