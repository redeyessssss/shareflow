import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { Header, ModeToggle, FeatureCards } from './components/layout';
import { Notification } from './components/ui';
import { AdBannerHorizontal, AdBannerVertical } from './components/ads';
import { useNotification } from './hooks/useNotification';
import { Shield, Zap, Globe, UserCheck } from 'lucide-react';

const SendFiles = lazy(() => import('./components/features/SendFiles').then(m => ({ default: m.SendFiles })));
const ReceiveFiles = lazy(() => import('./components/features/ReceiveFiles').then(m => ({ default: m.ReceiveFiles })));

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 p-8">
    <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl" />
    <div className="h-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl w-3/4 mx-auto" />
    <div className="h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-gradient" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-300/50 to-purple-300/50 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-300/40 to-orange-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-cyan-300/40 to-blue-300/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-24 text-center">
          <div className="animate-fadeInUp"><Header /></div>
          <p className="mt-6 text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            Share files securely with <span className="text-indigo-600 font-semibold">auto-expiring links</span>, 
            <span className="text-purple-600 font-semibold"> password protection</span>, and 
            <span className="text-pink-600 font-semibold"> download limits</span>. No registration required.
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 lg:py-12 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar Ad */}
          <aside className="hidden lg:flex lg:w-[320px] flex-shrink-0" style={{ minWidth: '320px' }}>
            <div className="sticky top-4 w-full">
              <AdBannerVertical />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Mobile Ad */}
            <div className="lg:hidden">
              <AdBannerHorizontal />
            </div>
            
            <div className="animate-fadeInUp" style={{ animationDelay: '50ms' }}>
              <ModeToggle mode={mode} onModeChange={handleModeChange} />
            </div>
            
            <div className="bg-white rounded-3xl shadow-elevated p-6 md:p-8 animate-scaleIn hover-glow border border-indigo-100/50" style={{ animationDelay: '100ms' }}>
              <Suspense fallback={<LoadingSkeleton />}>
                {mode === 'send' ? (
                  <SendFiles onError={setError} onSuccess={setSuccess} />
                ) : (
                  <ReceiveFiles onError={setError} onSuccess={setSuccess} initialCode={initialCode} />
                )}
              </Suspense>
            </div>
            
            <div className="animate-fadeInUp" style={{ animationDelay: '150ms' }}>
              <FeatureCards />
            </div>
            
            <AdBannerHorizontal />
          </div>

          {/* Right Sidebar Ad */}
          <aside className="hidden lg:flex lg:w-[320px] flex-shrink-0" style={{ minWidth: '320px' }}>
            <div className="sticky top-4 w-full">
              <AdBannerVertical />
            </div>
          </aside>
        </div>
      </div>

      {/* Why Choose ShareFlow */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Why Choose <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">ShareFlow</span>?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 stagger-children">
            <StatCard icon={Shield} value="256-bit" label="Encryption" color="indigo" />
            <StatCard icon={Zap} value="100MB+" label="File Support" color="amber" />
            <StatCard icon={Globe} value="Global" label="Access" color="emerald" />
            <StatCard icon={UserCheck} value="No Signup" label="Required" color="pink" />
          </div>
        </div>
      </section>

      {/* Ad after Why Choose */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBannerHorizontal />
      </div>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 stagger-children">
            <StepCard step="01" title="Upload" desc="Drag and drop your files" color="indigo" />
            <StepCard step="02" title="Share" desc="Get a unique 6-digit code" color="purple" />
            <StepCard step="03" title="Download" desc="Recipients access instantly" color="pink" />
          </div>
        </div>
      </section>

      {/* Ad after How It Works */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBannerHorizontal />
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white py-12 px-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ShareFlow</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Secure, fast, and easy file sharing. No registration needed.</p>
            </div>
            <div>
              <h3 className="font-medium text-sm uppercase tracking-wider text-slate-400 mb-4">Features</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="hover:text-indigo-400 transition-colors cursor-pointer">Auto-expiring links</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Password protection</li>
                <li className="hover:text-pink-400 transition-colors cursor-pointer">Download limits</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Share via link or code</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm uppercase tracking-wider text-slate-400 mb-4">Legal</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} ShareFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatCard = memo(({ icon: Icon, value, label, color }) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-400 shadow-indigo-200',
    amber: 'from-amber-500 to-orange-400 shadow-amber-200',
    emerald: 'from-emerald-500 to-teal-400 shadow-emerald-200',
    pink: 'from-pink-500 to-rose-400 shadow-pink-200',
  };
  return (
    <div className="text-center group gpu">
      <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg hover-lift`}>
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
      </div>
      <p className="text-xl md:text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
});

const StepCard = memo(({ step, title, desc, color }) => {
  const colors = { indigo: 'from-indigo-500 to-indigo-400', purple: 'from-purple-500 to-violet-400', pink: 'from-pink-500 to-rose-400' };
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 text-center card-hover gpu shadow-lg border border-slate-100">
      <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${colors[color]} text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-base md:text-lg font-bold shadow-lg`}>{step}</div>
      <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm md:text-base">{desc}</p>
    </div>
  );
});
