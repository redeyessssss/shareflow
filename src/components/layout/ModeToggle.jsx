import { Upload, Download } from 'lucide-react';

export const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm max-w-md mx-auto">
      <button
        onClick={() => onModeChange('send')}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
          mode === 'send' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Upload className="w-4 h-4 inline mr-2" />
        Send Files
      </button>
      <button
        onClick={() => onModeChange('receive')}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
          mode === 'receive' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Download className="w-4 h-4 inline mr-2" />
        Receive Files
      </button>
    </div>
  );
};
