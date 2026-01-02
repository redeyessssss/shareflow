import { memo } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const Notification = memo(({ error, success, onClose }) => {
  if (!error && !success) return null;
  const isError = !!error;

  return (
    <div className={`fixed top-4 right-4 z-50 p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm animate-slideInRight gpu border-2 ${
      isError ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
    }`}>
      {isError ? (
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
      ) : (
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounceSoft shadow-lg">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      )}
      <p className={`text-sm font-semibold ${isError ? 'text-red-700' : 'text-emerald-700'}`}>{error || success}</p>
      <button onClick={onClose} className={`ml-auto p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isError ? 'hover:bg-red-100' : 'hover:bg-emerald-100'}`}>
        <X className={`w-5 h-5 ${isError ? 'text-red-400' : 'text-emerald-400'}`} />
      </button>
    </div>
  );
});
