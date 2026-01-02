import { memo } from 'react';
import { Upload, Download } from 'lucide-react';

export const ModeToggle = memo(({ mode, onModeChange }) => {
  return (
    <div className="flex gap-1 p-1.5 bg-white/80 backdrop-blur-sm rounded-2xl max-w-sm mx-auto shadow-soft border border-indigo-100/50 gpu">
      <button
        onClick={() => onModeChange('send')}
        className={`flex-1 py-3 px-5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          mode === 'send' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-[1.02]' 
            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        <Upload className={`w-4 h-4 transition-transform duration-300 ${mode === 'send' ? 'scale-110' : ''}`} strokeWidth={2} />
        Send
      </button>
      <button
        onClick={() => onModeChange('receive')}
        className={`flex-1 py-3 px-5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          mode === 'receive' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-[1.02]' 
            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        <Download className={`w-4 h-4 transition-transform duration-300 ${mode === 'receive' ? 'scale-110' : ''}`} strokeWidth={2} />
        Receive
      </button>
    </div>
  );
});
