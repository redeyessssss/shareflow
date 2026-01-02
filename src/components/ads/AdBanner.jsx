import { useEffect, useRef } from 'react';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const AdBanner = ({ slot = "1650043805", format = "auto", style = {} }) => {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isDev || isLoaded.current) return;
    
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          isLoaded.current = true;
        }
      } catch (e) {
        console.log('AdSense not available');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show placeholder on localhost
  if (isDev) {
    return (
      <div 
        className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium"
        style={{ minHeight: style.minHeight || '100px', ...style }}
      >
        <div className="text-center p-4">
          <p className="text-gray-400 text-xs mb-1">Advertisement</p>
          <p>Ad will appear here on live site</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const AdBannerHorizontal = ({ className = "" }) => (
  <div className={`bg-gray-100 rounded-lg p-3 my-4 ${className}`}>
    <AdBanner slot="1650043805" format="horizontal" style={{ minHeight: '90px' }} />
  </div>
);

export const AdBannerSquare = ({ className = "" }) => (
  <div className={`bg-gray-100 rounded-lg p-3 ${className}`}>
    <AdBanner slot="1650043805" format="rectangle" style={{ minHeight: '250px' }} />
  </div>
);

export const AdBannerVertical = ({ className = "" }) => (
  <div className={`bg-gray-100 rounded-lg p-3 sticky top-4 ${className}`}>
    <AdBanner slot="1650043805" format="vertical" style={{ minHeight: '600px' }} />
  </div>
);
