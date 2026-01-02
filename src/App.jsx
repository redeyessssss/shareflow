import { useState, useEffect } from 'react';
import { Header, ModeToggle, FeatureCards } from './components/layout';
import { Notification } from './components/ui';
import { SendFiles, ReceiveFiles } from './components/features';
import { AdBannerHorizontal, AdBannerVertical, AdBannerSquare } from './components/ads';
import { useNotification } from './hooks/useNotification';
import { Shield, Zap, Globe, Users } from 'lucide-react';

export default function FileShareApp() {
  const [mode, setMode] = useState('send');
  const [initialCode, setInitialCode] = useState('');
  const { error, setError, success, setSuccess, clearNotifications } = useNotification();

  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Notification error={error} success={success} onClose={clearNotifications} />
      
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-10 md:py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Header />
          <p className="mt-4 text-indigo-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Share files securely with auto-expiring links, password protection, and download limits. 
            <span className="hidden md:inline"> No registration required.</span>
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          
          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden xl:block w-[280px] flex-shrink-0 space-y-6">
            <AdBannerVertical />
            <AdBannerSquare />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Mobile Top Ad */}
            <div className="xl:hidden">
              <AdBannerHorizontal />
            </div>

            <ModeToggle mode={mode} onModeChange={handleModeChange} />

            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 p-5 md:p-8 border border-gray-100">
              {mode === 'send' ? (
                <SendFiles onError={setError} onSuccess={setSuccess} />
              ) : (
                <ReceiveFiles onError={setError} onSuccess={setSuccess} initialCode={initialCode} />
              )}
            </div>

            {/* Mid Content Ad */}
            <AdBannerHorizontal />

            {/* Features */}
            <FeatureCards />

            {/* Mobile Bottom Ad */}
            <div className="xl:hidden">
              <AdBannerHorizontal />
            </div>
          </main>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden xl:block w-[280px] flex-shrink-0 space-y-6">
            <AdBannerVertical />
            <AdBannerSquare />
          </aside>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16 px-4 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose ShareFlow?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatCard icon={Shield} title="Secure" value="256-bit" desc="Encryption" color="indigo" />
            <StatCard icon={Zap} title="Fast" value="100MB+" desc="File Support" color="amber" />
            <StatCard icon={Globe} title="Global" value="Worldwide" desc="Access" color="emerald" />
            <StatCard icon={Users} title="Free" value="No Signup" desc="Required" color="purple" />
          </div>
        </div>
      </section>

      {/* Full Width Ad */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AdBannerHorizontal />
      </div>

      {/* How It Works */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard number="1" title="Upload Files" desc="Drag and drop or select files to share" />
            <StepCard number="2" title="Get Share Code" desc="Receive a unique 6-character code and link" />
            <StepCard number="3" title="Share & Download" desc="Share the code and recipients can download" />
          </div>
        </div>
      </section>

      {/* Pre-Footer Ad */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AdBannerHorizontal />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-4 text-indigo-400">ShareFlow</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Secure, fast, and easy file sharing for everyone. No registration needed.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>✓ Auto-expiring links</li>
                <li>✓ Password protection</li>
                <li>✓ Download limits</li>
                <li>✓ Share via link or code</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition">Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ShareFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, desc, color }) => {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  
  return (
    <div className="text-center group">
      <div className={`w-14 h-14 md:w-16 md:h-16 ${colors[color]} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 md:w-8 md:h-8" />
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
};

const StepCard = ({ number, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-200">
      {number}
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
  </div>
);
