import { useEffect, useRef, memo } from 'react';

const AdUnit = memo(({ slot, format = "auto", responsive = true, style = {} }) => {
  const adRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !adRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loaded.current) {
          loaded.current = true;
          try { 
            (window.adsbygoogle = window.adsbygoogle || []).push({}); 
          } catch (e) {
            console.log('Ad load error:', e);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ 
        display: 'block',
        width: '100%',
        height: 'auto',
        minHeight: style.minHeight || '100px',
        ...style
      }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
});

AdUnit.displayName = 'AdUnit';

// Horizontal Banner - Responsive
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`ad-container rounded-2xl bg-white border border-slate-200 p-4 shadow-sm ${className}`}>
    <div className="flex items-center justify-center gap-2 mb-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Sponsored</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </div>
    <div className="ad-wrapper" style={{ minHeight: '90px', width: '100%' }}>
      <AdUnit 
        slot="1650043805" 
        format="horizontal"
        style={{ minHeight: '90px' }}
      />
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Square/Rectangle Banner
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`ad-container rounded-2xl bg-white border border-slate-200 p-4 shadow-sm ${className}`}>
    <div className="text-center mb-3">
      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Ad</span>
    </div>
    <div className="ad-wrapper" style={{ minHeight: '250px', width: '100%' }}>
      <AdUnit 
        slot="1650043805" 
        format="rectangle"
        style={{ minHeight: '250px' }}
      />
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

// Vertical/Sidebar Banner
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`ad-container rounded-2xl bg-white border border-slate-200 p-4 shadow-sm sticky top-4 ${className}`}>
    <div className="text-center mb-3">
      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Advertisement</span>
    </div>
    <div className="ad-wrapper" style={{ minHeight: '600px', width: '100%' }}>
      <AdUnit 
        slot="1650043805" 
        format="vertical"
        style={{ minHeight: '600px' }}
      />
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

export { AdUnit as AdBanner };
