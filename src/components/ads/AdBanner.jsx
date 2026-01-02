import { useEffect, useRef, memo, useState } from 'react';

// Core Ad Unit with proper visibility check
const AdUnit = memo(({ slot = "1650043805" }) => {
  const adRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const pushed = useRef(false);

  // Check if container is visible and has width
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkVisibility = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const hasWidth = rect.width > 0;
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (hasWidth && isInViewport && !isVisible) {
          setIsVisible(true);
        }
      }
    };

    // Initial check after a delay
    const timer = setTimeout(checkVisibility, 500);
    
    // Also check on scroll and resize
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [isVisible]);

  // Push ad only when visible and has width
  useEffect(() => {
    if (!isVisible || pushed.current) return;

    const pushAd = () => {
      if (containerRef.current && adRef.current) {
        const width = containerRef.current.offsetWidth;
        
        if (width > 0) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
          } catch (e) {
            // Silently fail - ads may not load on localhost
          }
        }
      }
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(pushAd, 300);
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div ref={containerRef} style={{ width: '100%', minWidth: '200px' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          height: 'auto'
        }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad Banner
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Sponsored</span>
      </div>
      <div className="p-4" style={{ minHeight: '100px', minWidth: '300px' }}>
        <AdUnit slot="1650043805" />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad Banner
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`w-full ${className}`} style={{ minWidth: '250px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Advertisement</span>
      </div>
      <div className="p-3" style={{ minHeight: '600px', minWidth: '240px' }}>
        <AdUnit slot="1650043805" />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad Banner
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Ad</span>
      </div>
      <div className="p-3" style={{ minHeight: '250px', minWidth: '250px' }}>
        <AdUnit slot="1650043805" />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
