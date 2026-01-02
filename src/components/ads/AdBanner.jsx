import { useEffect, useRef, memo } from 'react';

// Core Ad Unit Component
const AdUnit = memo(({ slot = "1650043805", format = "auto", layoutKey = "" }) => {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = setTimeout(() => {
      if (!isLoaded.current && adRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        } catch (e) {
          console.log('Ad error:', e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const adProps = {
    ref: adRef,
    className: "adsbygoogle",
    style: { display: 'block' },
    'data-ad-client': "ca-pub-8746222528910149",
    'data-ad-slot': slot,
    'data-ad-format': format,
    'data-full-width-responsive': "true"
  };

  if (layoutKey) {
    adProps['data-ad-layout-key'] = layoutKey;
  }

  return <ins {...adProps} />;
});

AdUnit.displayName = 'AdUnit';

// Horizontal Ad - For content sections
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`w-full my-6 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-center mb-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="min-h-[100px] flex items-center justify-center bg-slate-50 rounded-lg">
        <AdUnit slot="1650043805" format="auto" />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Vertical Ad - For sidebars
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`w-full sticky top-4 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-center mb-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advertisement</span>
      </div>
      <div className="min-h-[600px] flex items-center justify-center bg-slate-50 rounded-lg">
        <AdUnit slot="1650043805" format="auto" />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// Square Ad - For sidebars
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`w-full ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-center mb-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ad</span>
      </div>
      <div className="min-h-[250px] flex items-center justify-center bg-slate-50 rounded-lg">
        <AdUnit slot="1650043805" format="auto" />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

export { AdUnit as AdBanner };
