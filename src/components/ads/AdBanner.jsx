import { useEffect, useRef } from 'react';

export const AdBanner = ({ slot = "1650043805", format = "auto", className = "" }) => {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const AdBannerHorizontal = ({ className = "" }) => (
  <div className={`ad-horizontal bg-gray-100 rounded-lg p-3 my-4 min-h-[100px] ${className}`}>
    <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
    <AdBanner slot="1650043805" format="horizontal" />
  </div>
);

export const AdBannerSquare = ({ className = "" }) => (
  <div className={`ad-square bg-gray-100 rounded-lg p-3 min-h-[250px] ${className}`}>
    <p className="text-xs text-gray-400 text-center mb-2">Sponsored</p>
    <AdBanner slot="1650043805" format="rectangle" />
  </div>
);

export const AdBannerVertical = ({ className = "" }) => (
  <div className={`ad-vertical bg-gray-100 rounded-lg p-3 min-h-[600px] sticky top-4 ${className}`}>
    <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
    <AdBanner slot="1650043805" format="vertical" />
  </div>
);
