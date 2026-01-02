import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const Notification = ({ error, success, onClose }) => {
  if (!error && !success) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md ${
      error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
    }`}>
      {error ? (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      )}
      <p className={`text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
        {error || success}
      </p>
      <button onClick={onClose} className="ml-auto">
        <X className={`w-4 h-4 ${error ? 'text-red-500' : 'text-green-500'}`} />
      </button>
    </div>
  );
};
