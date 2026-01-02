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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Notification error={error} success={success} onClose={clearNotifications} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Header />
          <p className="mt-4 text-indigo-100 text-base md:text-lg max-w-2xl mx-auto px-4">
            Share files securely with auto-expiring links, password protection, and download limits. No registration required.
          </p>
        </div>
      </div>

      {/* Main Layout with Sidebars */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              <AdBannerVertical />
              <AdBannerSquare />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Ad - Top */}
            <div className="lg:hidden">
              <AdBannerHorizontal />
            </div>

            <ModeToggle mode={mode} onModeChange={handleModeChange} />

            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 lg:p-8">
              {mode === 'send' ? (
                <SendFiles onError={setError} onSuccess={setSuccess} />
              ) : (
                <ReceiveFiles onError={setError} onSuccess={setSuccess} initialCode={initialCode} />
              )}
            </div>

            {/* Ad Banner - After Main Content */}
            <AdBannerHorizontal className="mt-6" />

            {/* Features Section */}
            <div className="py-8">
              <FeatureCards />
            </div>

            {/* Mobile Ad - Middle */}
            <div className="lg:hidden">
              <AdBannerHorizontal />
            </div>
          </main>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              <AdBannerVertical />
              <AdBannerSquare />
            </div>
          </aside>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8">
            Why Choose ShareFlow?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard icon={Shield} title="Secure" value="256-bit" desc="Encryption" />
            <StatCard icon={Zap} title="Fast" value="100MB+" desc="File Support" />
            <StatCard icon={Globe} title="Global" value="Worldwide" desc="Access" />
            <StatCard icon={Users} title="Free" value="No Signup" desc="Required" />
          </div>
        </div>
      </div>

      {/* Ad Banner - Full Width */}
      <div className="max-w-6xl mx-auto px-4">
        <AdBannerHorizontal />
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StepCard number="1" title="Upload Files" desc="Drag and drop or select files to share" />
            <StepCard number="2" title="Get Share Code" desc="Receive a unique 6-character code and link" />
            <StepCard number="3" title="Share & Download" desc="Share the code and recipients can download" />
          </div>
        </div>
      </div>

      {/* Mobile Ad - Before Footer */}
      <div className="lg:hidden px-4">
        <AdBannerHorizontal />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-3">ShareFlow</h3>
              <p className="text-gray-400 text-sm">Secure, fast, and easy file sharing for everyone.</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-3">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Auto-expiring links</li>
                <li>• Password protection</li>
                <li>• Download limits</li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-3">Legal</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Privacy Policy</li>
                <li>• Terms of Service</li>
                <li>• Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 text-center text-gray-400 text-sm">
            © 2026 ShareFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, desc }) => (
  <div className="text-center p-3 md:p-4">
    <Icon className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 mx-auto mb-2 md:mb-3" />
    <p className="text-xs md:text-sm text-gray-500">{title}</p>
    <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-xs md:text-sm text-gray-500">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-3 md:mb-4">
      {number}
    </div>
    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">{title}</h3>
    <p className="text-xs md:text-sm text-gray-600">{desc}</p>
  </div>
);
