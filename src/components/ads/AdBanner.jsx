import { useEffect, useRef, memo, useState } from 'react';

// Generate unique ID for each ad instance
let adCounter = 0;
const getAdId = () => `ad-${++adCounter}`;

// Core Ad Unit with proper initialization
const AdUnit = memo(({ slot = "1650043805", minHeight = 100 }) => {
  const containerRef = useRef(null);
  const adId = useRef(getAdId());
  const [adPushed, setAdPushed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || adPushed) return;

    let timeoutId;
    let observer;

    const pushAd = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.offsetWidth;
      const ins = container.querySelector('.adsbygoogle');
      
      // Only push if container has width and ad not already pushed
      if (width > 100 && ins && !ins.dataset.adsbygoogleStatus) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdPushed(true);
        } catch (e) {
          // Silent fail for localhost
        }
      }
    };

    // Use Intersection Observer to load ads when visible
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timeoutId = setTimeout(pushAd, 500);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [adPushed]);

  return (
    <div 
      ref={containerRef} 
      id={adId.current}
      style={{ width: '100%', minHeight: `${minHeight}px` }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: 'auto', minHeight: `${minHeight}px` }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad Banner - for content areas
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`w-full my-4 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 flex items-center justify-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Sponsored</span>
      </div>
      <div className="p-3">
        <AdUnit slot="1650043805" minHeight={90} />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad Banner
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Advertisement</span>
      </div>
      <div className="p-3">
        <AdUnit slot="1650043805" minHeight={500} />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad Banner
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Ad</span>
      </div>
      <div className="p-3">
        <AdUnit slot="1650043805" minHeight={250} />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
