import { useEffect, useRef } from 'react';

export const AdBanner = ({ slot = "1650043805", format = "auto", className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('Ad error:', e);
    }
  }, []);

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export const AdBannerHorizontal = ({ className = "" }) => (
  <div className={`ad-wrapper bg-gray-50 rounded-lg p-2 my-4 min-h-[100px] ${className}`}>
    <p className="text-[10px] text-gray-400 text-center mb-1">Advertisement</p>
    <AdBanner slot="1650043805" format="auto" />
  </div>
);

export const AdBannerSquare = ({ className = "" }) => (
  <div className={`ad-wrapper bg-gray-50 rounded-lg p-2 min-h-[260px] ${className}`}>
    <p className="text-[10px] text-gray-400 text-center mb-1">Sponsored</p>
    <AdBanner slot="1650043805" format="auto" />
  </div>
);

export const AdBannerVertical = ({ className = "" }) => (
  <div className={`ad-wrapper bg-gray-50 rounded-lg p-2 min-h-[600px] sticky top-4 ${className}`}>
    <p className="text-[10px] text-gray-400 text-center mb-1">Advertisement</p>
    <AdBanner slot="1650043805" format="auto" />
  </div>
);
