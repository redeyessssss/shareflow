import { useState, useCallback, useEffect, memo } from 'react';
import { Share2, Lock, Copy, Check, RefreshCw, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { DropZone, FileItem, ProgressBar } from '../ui';
import { uploadFiles, createShare, generateShareCode } from '../../services/shareService';

export const SendFiles = memo(({ onError, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [expiryTime, setExpiryTime] = useState('1h');
  const [password, setPassword] = useState('');
  const [maxDownloads, setMaxDownloads] = useState('unlimited');
  const [message, setMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const getShareLink = () => `${window.location.origin}?code=${generatedCode}`;

  useEffect(() => {
    return () => { files.forEach(file => { if (file.preview) URL.revokeObjectURL(file.preview); }); };
  }, [files]);

  const handleFilesSelected = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file, name: file.name, size: file.size, type: file.type || 'application/octet-stream',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles(prev => {
      const fileToRemove = prev[index];
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetForm = useCallback(() => {
    setFiles([]); setGeneratedCode(''); setPassword(''); setMessage('');
    setExpiryTime('1h'); setMaxDownloads('unlimited'); setUploadProgress(0); setShowOptions(false);
  }, []);

  const handleGenerateCode = async () => {
    if (files.length === 0) { onError('Please select at least one file to share.'); return; }
    const code = generateShareCode();
    setUploading(true); setUploadProgress(0);
    try {
      const uploadedFiles = await uploadFiles(files, code, setUploadProgress);
      await createShare({ code, files: uploadedFiles, expiryTime, password, maxDownloads, message });
      setGeneratedCode(code); onSuccess('Files uploaded successfully!');
    } catch (err) { onError(err.message || 'Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const copyToClipboard = async (text, type) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    if (type === 'code') { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
    else { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  return (
    <div className="gpu">
      <DropZone onFilesSelected={handleFilesSelected} disabled={uploading} />

      {files.length > 0 && (
        <div className="mt-6 space-y-2 animate-fadeInUp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-700">{files.length} file{files.length > 1 ? 's' : ''} selected</h3>
            {!uploading && !generatedCode && (
              <button onClick={() => setFiles([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors duration-200">Clear all</button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto stagger-children">
            {files.map((file, index) => (<FileItem key={index} file={file} onRemove={() => removeFile(index)} showRemove={!uploading} />))}
          </div>
        </div>
      )}

      {uploading && <ProgressBar progress={uploadProgress} />}

      {files.length > 0 && !generatedCode && !uploading && (
        <div className="mt-6 space-y-4 animate-fadeInUp">
          <button onClick={() => setShowOptions(!showOptions)} className="w-full py-3 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-sm font-medium text-slate-600 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 flex items-center justify-between group border border-indigo-100/50">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-500" />Advanced Options</span>
            <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-300 ${showOptions ? 'rotate-180' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${showOptions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 rounded-xl border border-indigo-100/50">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Expiry Time</label>
                  <select value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)} className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm input-modern">
                    <option value="10m">10 minutes</option><option value="1h">1 hour</option><option value="6h">6 hours</option><option value="24h">24 hours</option><option value="7d">7 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Max Downloads</label>
                  <select value={maxDownloads} onChange={(e) => setMaxDownloads(e.target.value)} className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm input-modern">
                    <option value="1">1 time</option><option value="5">5 times</option><option value="10">10 times</option><option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Password (Optional)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave empty for no password" className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm input-modern" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Message (Optional)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a note for the recipient..." rows="2" className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm input-modern resize-none" />
              </div>
            </div>
          </div>

          <button onClick={handleGenerateCode} className="w-full py-4 btn-primary text-white rounded-xl font-medium flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />Generate Share Code
          </button>
        </div>
      )}

      {generatedCode && (
        <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 animate-scaleIn">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounceSoft shadow-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800">Files Ready to Share</h3>
          </div>
          
          <div className="mb-4 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Share Code</label>
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-soft hover-glow border border-indigo-100/50">
              <code className="flex-1 text-2xl font-bold gradient-text text-center tracking-[0.3em] font-mono">{generatedCode}</code>
              <button onClick={() => copyToClipboard(generatedCode, 'code')} className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mb-5 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Direct Link</label>
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-soft border border-indigo-100/50">
              <input type="text" readOnly value={getShareLink()} className="flex-1 text-sm text-slate-500 bg-transparent outline-none truncate px-2" />
              <button onClick={() => copyToClipboard(getShareLink(), 'link')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 active:scale-95">
                {copiedLink ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}{copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-500 justify-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <span className="px-3 py-1 bg-white rounded-full shadow-soft border border-indigo-50">Expires: {expiryTime}</span>
            <span className="px-3 py-1 bg-white rounded-full shadow-soft border border-indigo-50">Downloads: {maxDownloads}</span>
            {password && <span className="px-3 py-1 bg-white rounded-full shadow-soft border border-indigo-50">🔒 Protected</span>}
          </div>

          <button onClick={resetForm} className="mt-5 w-full py-3 bg-white text-slate-600 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-soft hover-lift border border-indigo-100/50">
            <RefreshCw className="w-4 h-4" />Share More Files
          </button>
        </div>
      )}
    </div>
  );
});
