import { useEffect, useRef } from 'react';

export const AdBanner = ({ slot = "1650043805" }) => {
  const adRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ad already loaded or blocked
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8746222528910149"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export const AdBannerHorizontal = ({ className = "" }) => (
  <div className={`bg-gray-50 rounded-lg p-2 my-4 min-h-[100px] flex flex-col ${className}`}>
    <p className="text-[10px] text-gray-400 text-center">Advertisement</p>
    <div className="flex-1">
      <AdBanner slot="1650043805" />
    </div>
  </div>
);

export const AdBannerSquare = ({ className = "" }) => (
  <div className={`bg-gray-50 rounded-lg p-2 min-h-[260px] flex flex-col ${className}`}>
    <p className="text-[10px] text-gray-400 text-center">Sponsored</p>
    <div className="flex-1">
      <AdBanner slot="1650043805" />
    </div>
  </div>
);

export const AdBannerVertical = ({ className = "" }) => (
  <div className={`bg-gray-50 rounded-lg p-2 min-h-[600px] flex flex-col sticky top-4 ${className}`}>
    <p className="text-[10px] text-gray-400 text-center">Advertisement</p>
    <div className="flex-1">
      <AdBanner slot="1650043805" />
    </div>
  </div>
);
