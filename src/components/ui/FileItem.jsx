import { memo } from 'react';
import { X } from 'lucide-react';
import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.jsx';

export const FileItem = memo(({ file, onRemove, showRemove = true }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-indigo-50/30 rounded-xl group hover:from-indigo-50 hover:to-purple-50/50 transition-all duration-300 gpu hover-lift border border-indigo-100 shadow-sm">
      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
        <span className="text-indigo-500 text-lg">{getFileIcon(file.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
        <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
      </div>
      {showRemove && onRemove && (
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-50 rounded-xl hover:scale-110 active:scale-95 hover:rotate-90">
          <X className="w-5 h-5 text-red-400 hover:text-red-500" />
        </button>
      )}
    </div>
  );
});
