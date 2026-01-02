import { useCallback, useRef, useState, memo } from 'react';
import { Upload, Plus, Sparkles } from 'lucide-react';

export const DropZone = memo(({ onFilesSelected, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) onFilesSelected(e.dataTransfer.files);
  }, [onFilesSelected]);

  const handleChange = useCallback((e) => {
    if (e.target.files) onFilesSelected(e.target.files);
  }, [onFilesSelected]);

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative border-3 border-dashed rounded-3xl p-12 md:p-16 text-center transition-all duration-300 cursor-pointer group gpu ${
        dragActive 
          ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02]' 
          : 'border-indigo-200 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Animated background gradient on hover */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-100/0 via-purple-100/0 to-pink-100/0 group-hover:from-indigo-100/30 group-hover:via-purple-100/30 group-hover:to-pink-100/30 transition-all duration-500 ${dragActive ? 'from-indigo-100/50 via-purple-100/50 to-pink-100/50' : ''}`} />
      
      <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        dragActive 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 scale-110 animate-bounceSoft shadow-xl' 
          : 'bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:scale-105 group-hover:shadow-xl'
      }`}>
        <Upload className={`w-9 h-9 transition-all duration-300 ${
          dragActive ? 'text-white' : 'text-indigo-500 group-hover:text-white'
        }`} strokeWidth={1.5} />
      </div>
      
      <p className="relative text-lg font-semibold text-slate-700 mb-2">Drop files here or click to browse</p>
      <p className="relative text-sm text-slate-400 mb-6">Any file type supported • Up to 100MB</p>
      
      <input ref={fileInputRef} type="file" multiple onChange={handleChange} className="hidden" disabled={disabled} />
      
      <div className="relative">
        <button className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-white rounded-xl text-sm font-semibold shadow-xl">
          <Sparkles className="w-5 h-5" />
          Select Files
        </button>
      </div>
    </div>
  );
});
