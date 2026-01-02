import { memo } from 'react';
import { Upload, Download } from 'lucide-react';

export const ModeToggle = memo(({ mode, onModeChange }) => {
  return (
    <div className="flex gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-2xl max-w-md mx-auto shadow-lg border border-indigo-100/50 gpu">
      <button
        onClick={() => onModeChange('send')}
        className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
          mode === 'send' 
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]' 
            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        {mode === 'send' && <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />}
        <Upload className={`w-5 h-5 relative z-10 transition-transform duration-300 ${mode === 'send' ? 'animate-bounceSoft' : ''}`} strokeWidth={2} />
        <span className="relative z-10">Send Files</span>
      </button>
      <button
        onClick={() => onModeChange('receive')}
        className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
          mode === 'receive' 
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]' 
            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        {mode === 'receive' && <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />}
        <Download className={`w-5 h-5 relative z-10 transition-transform duration-300 ${mode === 'receive' ? 'animate-bounceSoft' : ''}`} strokeWidth={2} />
        <span className="relative z-10">Receive Files</span>
      </button>
    </div>
  );
});
