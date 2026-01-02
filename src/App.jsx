import { useState, useEffect } from 'react';
import { Header, ModeToggle, FeatureCards } from './components/layout';
import { Notification } from './components/ui';
import { SendFiles, ReceiveFiles } from './components/features';
import { useNotification } from './hooks/useNotification';

export default function FileShareApp() {
  const [mode, setMode] = useState('send');
  const [initialCode, setInitialCode] = useState('');
  const { error, setError, success, setSuccess, clearNotifications } = useNotification();

  // Check URL for share code on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setInitialCode(code.toUpperCase());
      setMode('receive');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearNotifications();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Notification error={error} success={success} onClose={clearNotifications} />
        <Header />
        <ModeToggle mode={mode} onModeChange={handleModeChange} />

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {mode === 'send' ? (
            <SendFiles onError={setError} onSuccess={setSuccess} />
          ) : (
            <ReceiveFiles onError={setError} onSuccess={setSuccess} initialCode={initialCode} />
          )}
        </div>

        <FeatureCards />
      </div>
    </div>
  );
}
