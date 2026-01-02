import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { Header, ModeToggle, FeatureCards } from './components/layout';
import { Notification } from './components/ui';
import { AdBannerHorizontal, AdBannerVertical } from './components/ads';
import { useNotification } from './hooks/useNotification';
import { Shield, Zap, Globe, UserCheck } from 'lucide-react';

// Lazy load heavy components
const SendFiles = lazy(() => import('./components/features/SendFiles').then(m => ({ default: m.SendFiles })));
const ReceiveFiles = lazy(() => import('./components/features/ReceiveFiles').then(m => ({ default: m.ReceiveFiles })));

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 p-8">
    <div className="h-32 bg-slate-200 rounded-2xl" />
    <div className="h-10 bg-slate-200 rounded-xl w-3/4 mx-auto" />
    <div className="h-12 bg-slate-200 rounded-xl" />
  </div>
);

export default function FileShareApp() {
  const [mode, setMode] = useState('send');
  const [initialCode, setInitialCode] = useState('');
  const [mounted, setMounted] = useState(false);
  const { error, setError, success, setSuccess, clearNotifications } = useNotification();

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setInitialCode(code.toUpperCase());
      setMode('receive');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearNotifications();
  };

  return (
    <div className={`min-h-screen ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
      <Notification error={error} success={success} onClose={clearNotifications} />
      
      {/* Hero Section */}
      <header className="relative overflow-hidden gpu">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="animate-fadeInUp">
            <Header />
          </div>
          <p className="mt-5 text-slate-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            Share files securely with auto-expiring links, password protection, and download limits.
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 -mt-8 relative z-20">
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Left Sidebar */}
          <aside className="hidden xl:block w-[260px] flex-shrink-0 animate-slideInLeft">
            <AdBannerVertical />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Mobile Top Ad */}
            <div className="xl:hidden animate-fadeInUp">
              <AdBannerHorizontal />
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: '50ms' }}>
              <ModeToggle mode={mode} onModeChange={handleModeChange} />
            </div>

            <div className="glass rounded-2xl shadow-elevated p-6 md:p-8 animate-scaleIn hover-glow" style={{ animationDelay: '100ms' }}>
              <Suspense fallback={<LoadingSkeleton />}>
                {mode === 'send' ? (
                  <SendFiles onError={setError} onSuccess={setSuccess} />
                ) : (
                  <ReceiveFiles onError={setError} onSuccess={setSuccess} initialCode={initialCode} />
                )}
              </Suspense>
            </div>

            {/* Features */}
            <div className="animate-fadeInUp" style={{ animationDelay: '150ms' }}>
              <FeatureCards />
            </div>

            {/* Mid Content Ad */}
            <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              <AdBannerHorizontal />
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-[260px] flex-shrink-0 animate-slideInRight">
            <AdBannerVertical />
          </aside>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-800 mb-12">
            Why Choose ShareFlow?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 stagger-children">
            <StatCard icon={Shield} value="256-bit" label="Encryption" />
            <StatCard icon={Zap} value="100MB+" label="File Support" />
            <StatCard icon={Globe} value="Global" label="Access" />
            <StatCard icon={UserCheck} value="No Signup" label="Required" />
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <AdBannerHorizontal />
      </div>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            <StepCard step="01" title="Upload" desc="Drag and drop your files" />
            <StepCard step="02" title="Share" desc="Get a unique 6-digit code" />
            <StepCard step="03" title="Download" desc="Recipients access instantly" />
          </div>
        </div>
      </section>

      {/* Pre-Footer Ad */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AdBannerHorizontal />
      </div>

      {/* Footer */}
      <footer className="glass-dark text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-lg mb-3 gradient-text">ShareFlow</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Secure, fast, and easy file sharing. No registration needed.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm uppercase tracking-wider text-slate-300 mb-4">Features</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>Auto-expiring links</li>
                <li>Password protection</li>
                <li>Download limits</li>
                <li>Share via link or code</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm uppercase tracking-wider text-slate-300 mb-4">Legal</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors duration-200">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-200">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-200">Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 mt-10 pt-6 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} ShareFlow
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatCard = memo(({ icon: Icon, value, label }) => (
  <div className="text-center group gpu">
    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-soft hover-lift">
      <Icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
    </div>
    <p className="text-xl font-semibold text-slate-800">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
));

const StepCard = memo(({ step, title, desc }) => (
  <div className="glass rounded-2xl p-6 text-center card-hover gpu">
    <span className="text-xs font-medium text-indigo-500 tracking-wider">{step}</span>
    <h3 className="font-semibold text-slate-800 mt-2 mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
));
