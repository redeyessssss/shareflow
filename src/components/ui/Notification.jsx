import { memo } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const Notification = memo(({ error, success, onClose }) => {
  if (!error && !success) return null;
  const isError = !!error;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-elevated flex items-center gap-3 max-w-sm animate-slideInRight gpu ${
      isError ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'
    }`}>
      {isError ? (
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
      ) : (
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 animate-bounceSoft">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </div>
      )}
      <p className={`text-sm font-medium ${isError ? 'text-red-700' : 'text-emerald-700'}`}>{error || success}</p>
      <button onClick={onClose} className={`ml-auto p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${isError ? 'hover:bg-red-100' : 'hover:bg-emerald-100'}`}>
        <X className={`w-4 h-4 ${isError ? 'text-red-400' : 'text-emerald-400'}`} />
      </button>
    </div>
  );
});
