import { useEffect } from 'react';

export const AdBanner = ({ slot = "1650043805", format = "auto", className = "" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container my-4 ${className}`}>
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
  <div className={`ad-horizontal bg-gray-50 rounded-lg p-2 my-4 ${className}`}>
    <p className="text-xs text-gray-400 text-center mb-1">Advertisement</p>
    <AdBanner slot="1650043805" format="horizontal" />
  </div>
);

export const AdBannerSquare = ({ className = "" }) => (
  <div className={`ad-square bg-gray-50 rounded-lg p-2 my-4 ${className}`}>
    <p className="text-xs text-gray-400 text-center mb-1">Sponsored</p>
    <AdBanner slot="1650043805" format="rectangle" />
  </div>
);
