import { useEffect, useRef, memo, useState } from 'react';

// Ad Unit with proper width detection
const AdUnit = memo(({ slot = "1650043805", format = "auto", style = {} }) => {
  const containerRef = useRef(null);
  const initialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialized.current) return;

    const checkAndInitAd = () => {
      const container = containerRef.current;
      if (!container) return false;
      
      // Get actual computed width
      const width = container.getBoundingClientRect().width;
      
      if (width > 0 && !initialized.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
          setIsReady(true);
          return true;
        } catch (e) {
          console.warn('Ad init error:', e);
        }
      }
      return false;
    };

    // Use ResizeObserver to detect when container has width
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && !initialized.current) {
          // Small delay to ensure DOM is fully ready
          setTimeout(checkAndInitAd, 100);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also try after delays as fallback
    const timers = [
      setTimeout(checkAndInitAd, 1000),
      setTimeout(checkAndInitAd, 2000),
      setTimeout(checkAndInitAd, 4000),
    ];

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', minWidth: '280px' }}>
      <ins
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
    </div>
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`w-full my-4 ${className}`} style={{ minWidth: '300px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="p-3" style={{ minHeight: '100px' }}>
        <AdUnit slot="1650043805" format="horizontal" style={{ minHeight: '90px' }} />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Sidebar Ad
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`${className}`} style={{ width: '300px', minWidth: '300px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div style={{ minHeight: '600px', width: '100%', padding: '8px' }}>
        <AdUnit slot="1650043805" format="vertical" style={{ minHeight: '580px' }} />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`w-full ${className}`} style={{ minWidth: '250px' }}>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div className="p-3" style={{ minHeight: '250px' }}>
        <AdUnit slot="1650043805" format="rectangle" style={{ minHeight: '230px' }} />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
