import { useCallback, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export const DropZone = ({ onFilesSelected, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleChange = useCallback((e) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  }, [onFilesSelected]);

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-4 border-dashed rounded-xl p-12 text-center transition-all ${
        dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
      }`}
    >
      <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to browse</p>
      <p className="text-sm text-gray-500 mb-4">Support for any file type</p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        disabled={disabled}
      >
        Select Files
      </button>
    </div>
  );
};
