import { useEffect, useRef, memo } from 'react';

const AdUnit = memo(({ slot = "1650043805" }) => {
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
          } catch (e) {}
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
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

export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`ad-section rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-3 my-6 ${className}`}>
    <div className="flex items-center justify-center gap-2 mb-2">
      <div className="h-px flex-1 bg-gray-300" />
      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Sponsored</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
    <div className="min-h-[90px]">
      <AdUnit slot="1650043805" />
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`ad-section rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-3 ${className}`}>
    <div className="text-center mb-2">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Ad</span>
    </div>
    <div className="min-h-[250px]">
      <AdUnit slot="1650043805" />
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`ad-section rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 p-3 sticky top-4 ${className}`}>
    <div className="text-center mb-2">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Advertisement</span>
    </div>
    <div className="min-h-[500px]">
      <AdUnit slot="1650043805" />
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

export { AdUnit as AdBanner };
