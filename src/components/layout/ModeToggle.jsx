import { memo } from 'react';
import { Upload, Download } from 'lucide-react';

export const ModeToggle = memo(({ mode, onModeChange }) => {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl max-w-sm mx-auto gpu">
      <button
        onClick={() => onModeChange('send')}
        className={`flex-1 py-3 px-5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          mode === 'send' 
            ? 'bg-white text-slate-800 shadow-soft scale-[1.02]' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
        }`}
      >
        <Upload className={`w-4 h-4 transition-transform duration-300 ${mode === 'send' ? 'scale-110' : ''}`} strokeWidth={2} />
        Send
      </button>
      <button
        onClick={() => onModeChange('receive')}
        className={`flex-1 py-3 px-5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          mode === 'receive' 
            ? 'bg-white text-slate-800 shadow-soft scale-[1.02]' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
        }`}
      >
        <Download className={`w-4 h-4 transition-transform duration-300 ${mode === 'receive' ? 'scale-110' : ''}`} strokeWidth={2} />
        Receive
      </button>
    </div>
  );
});
