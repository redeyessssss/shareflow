import { useEffect, useRef, memo, useState } from 'react';

// Single Ad Unit Component
const AdUnit = memo(({ slot = "1650043805", layout = "display" }) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Don't run on server or if already loaded
    if (typeof window === 'undefined' || adLoaded) return;

    const loadAd = () => {
      try {
        if (adRef.current && !adRef.current.dataset.adsbygoogleStatus) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    };

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadAd();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px', threshold: 0 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [adLoaded]);

  // Display ad - auto responsive
  if (layout === "display") {
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
  }

  // In-feed ad
  if (layout === "infeed") {
    return (
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
      />
    );
  }

  // In-article ad
  if (layout === "inarticle") {
    return (
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-8746222528910149"
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
      />
    );
  }

  return null;
});

AdUnit.displayName = 'AdUnit';

// Horizontal Banner - For content areas
export const AdBannerHorizontal = memo(({ className = "" }) => (
  <div className={`ad-container my-6 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium px-2">Sponsored</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <div style={{ minHeight: '100px' }}>
        <AdUnit slot="1650043805" layout="display" />
      </div>
    </div>
  </div>
));

AdBannerHorizontal.displayName = 'AdBannerHorizontal';

// Square Banner - For sidebars
export const AdBannerSquare = memo(({ className = "" }) => (
  <div className={`ad-container ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="text-center mb-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Ad</span>
      </div>
      <div style={{ minHeight: '250px' }}>
        <AdUnit slot="1650043805" layout="display" />
      </div>
    </div>
  </div>
));

AdBannerSquare.displayName = 'AdBannerSquare';

// Vertical Banner - For sidebars (sticky)
export const AdBannerVertical = memo(({ className = "" }) => (
  <div className={`ad-container sticky top-4 ${className}`}>
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="text-center mb-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Advertisement</span>
      </div>
      <div style={{ minHeight: '600px' }}>
        <AdUnit slot="1650043805" layout="display" />
      </div>
    </div>
  </div>
));

AdBannerVertical.displayName = 'AdBannerVertical';

// In-Feed Ad - For between content items
export const AdBannerInFeed = memo(({ className = "" }) => (
  <div className={`ad-container my-4 ${className}`}>
    <AdUnit slot="1650043805" layout="infeed" />
  </div>
));

AdBannerInFeed.displayName = 'AdBannerInFeed';

// In-Article Ad - For within article content
export const AdBannerInArticle = memo(({ className = "" }) => (
  <div className={`ad-container my-6 ${className}`}>
    <AdUnit slot="1650043805" layout="inarticle" />
  </div>
));

AdBannerInArticle.displayName = 'AdBannerInArticle';

export { AdUnit as AdBanner };
