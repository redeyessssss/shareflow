import { memo } from 'react';
import { X } from 'lucide-react';
import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.jsx';

export const FileItem = memo(({ file, onRemove, showRemove = true }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-all duration-200 gpu hover-lift">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
        <span className="text-indigo-500">{getFileIcon(file.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
        <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
      </div>
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-red-50 rounded-lg hover:scale-110 active:scale-95"
        >
          <X className="w-4 h-4 text-red-400 hover:text-red-500" />
        </button>
      )}
    </div>
  );
});
