import { useCallback, useRef, useState, memo } from 'react';
import { Upload, Plus } from 'lucide-react';

export const DropZone = memo(({ onFilesSelected, disabled = false }) => {
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
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center transition-all duration-300 cursor-pointer group gpu ${
        dragActive 
          ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02]' 
          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        dragActive 
          ? 'bg-indigo-100 scale-110 animate-bounceSoft' 
          : 'bg-slate-100 group-hover:bg-indigo-50 group-hover:scale-105'
      }`}>
        <Upload className={`w-7 h-7 transition-all duration-300 ${
          dragActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'
        }`} strokeWidth={1.5} />
      </div>
      
      <p className="text-base font-medium text-slate-700 mb-1">
        Drop files here or click to browse
      </p>
      <p className="text-sm text-slate-400">
        Any file type supported
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="mt-5">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all duration-300 group-hover:scale-105">
          <Plus className="w-4 h-4" />
          Select Files
        </span>
      </div>
    </div>
  );
});
