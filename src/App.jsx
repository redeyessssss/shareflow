import { useState, useEffect } from 'react';
import { Header, ModeToggle, FeatureCards } from './components/layout';
import { Notification } from './components/ui';
import { SendFiles, ReceiveFiles } from './components/features';
import { AdBannerHorizontal } from './components/ads';
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Header />
          <p className="mt-4 text-indigo-100 text-lg max-w-2xl mx-auto">
            Share files securely with auto-expiring links, password protection, and download limits. No registration required.
          </p>
        </div>
      </div>

      {/* Ad Banner - Top */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBannerHorizontal />
      </div>

      {/* Main App Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ModeToggle mode={mode} onModeChange={handleModeChange} />

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {mode === 'send' ? (
            <SendFiles onError={setError} onSuccess={setSuccess} />
          ) : (
            <ReceiveFiles onError={setError} onSuccess={setSuccess} initialCode={initialCode} />
          )}
        </div>
      </div>

      {/* Ad Banner - Middle */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBannerHorizontal />
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FeatureCards />
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Choose ShareFlow?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard icon={Shield} title="Secure" value="256-bit" desc="Encryption" />
            <StatCard icon={Zap} title="Fast" value="100MB+" desc="File Support" />
            <StatCard icon={Globe} title="Global" value="Worldwide" desc="Access" />
            <StatCard icon={Users} title="Free" value="No Signup" desc="Required" />
          </div>
        </div>
      </div>

      {/* Ad Banner - Before Footer */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBannerHorizontal />
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard number="1" title="Upload Files" desc="Drag and drop or select files to share" />
            <StepCard number="2" title="Get Share Code" desc="Receive a unique 6-character code and link" />
            <StepCard number="3" title="Share & Download" desc="Share the code and recipients can download" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">ShareFlow</h3>
              <p className="text-gray-400 text-sm">Secure, fast, and easy file sharing for everyone.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Auto-expiring links</li>
                <li>• Password protection</li>
                <li>• Download limits</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Legal</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Privacy Policy</li>
                <li>• Terms of Service</li>
                <li>• Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            © 2026 ShareFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, desc }) => (
  <div className="text-center p-4">
    <Icon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);
