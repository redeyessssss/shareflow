import { X } from 'lucide-react';
import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.jsx';

export const FileItem = ({ file, onRemove, showRemove = true }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
      <div className="text-indigo-600">{getFileIcon(file.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      )}
    </div>
  );
};
