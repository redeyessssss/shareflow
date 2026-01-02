import { useState, useCallback, useEffect, memo } from 'react';
import { Share2, Lock, Copy, Check, RefreshCw, Link as LinkIcon, ChevronDown, Sparkles } from 'lucide-react';
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
        <div className="mt-8 space-y-3 animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs">{files.length}</span>
              file{files.length > 1 ? 's' : ''} selected
            </h3>
            {!uploading && !generatedCode && (
              <button onClick={() => setFiles([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors duration-200 hover:scale-105">Clear all</button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto stagger-children">
            {files.map((file, index) => (<FileItem key={index} file={file} onRemove={() => removeFile(index)} showRemove={!uploading} />))}
          </div>
        </div>
      )}

      {uploading && <ProgressBar progress={uploadProgress} />}

      {files.length > 0 && !generatedCode && !uploading && (
        <div className="mt-8 space-y-4 animate-fadeInUp">
          <button onClick={() => setShowOptions(!showOptions)} className="w-full py-4 px-5 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl text-sm font-semibold text-slate-600 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 flex items-center justify-between group border border-indigo-100">
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </span>
              Advanced Options
            </span>
            <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${showOptions ? 'rotate-180' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-400 ease-out ${showOptions ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-4 p-5 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 rounded-xl border border-indigo-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expiry Time</label>
                  <select value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)} className="w-full p-3 bg-white border-2 border-indigo-100 rounded-xl text-sm input-modern font-medium">
                    <option value="10m">10 minutes</option><option value="1h">1 hour</option><option value="6h">6 hours</option><option value="24h">24 hours</option><option value="7d">7 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Max Downloads</label>
                  <select value={maxDownloads} onChange={(e) => setMaxDownloads(e.target.value)} className="w-full p-3 bg-white border-2 border-indigo-100 rounded-xl text-sm input-modern font-medium">
                    <option value="1">1 time</option><option value="5">5 times</option><option value="10">10 times</option><option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password (Optional)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave empty for no password" className="w-full p-3 bg-white border-2 border-indigo-100 rounded-xl text-sm input-modern" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message (Optional)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a note for the recipient..." rows="2" className="w-full p-3 bg-white border-2 border-indigo-100 rounded-xl text-sm input-modern resize-none" />
              </div>
            </div>
          </div>

          <button onClick={handleGenerateCode} className="w-full py-5 btn-primary text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-xl">
            <Sparkles className="w-5 h-5" />
            Generate Share Code
          </button>
        </div>
      )}

      {generatedCode && (
        <div className="mt-8 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-indigo-100 animate-scaleIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounceSoft shadow-xl shadow-emerald-200">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-slate-800">Files Ready to Share!</h3>
          </div>
          
          <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Share Code</label>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-lg hover-glow border border-indigo-100">
              <code className="flex-1 text-3xl font-black gradient-text-animated text-center tracking-[0.4em] font-mono">{generatedCode}</code>
              <button onClick={() => copyToClipboard(generatedCode, 'code')} className={`p-4 rounded-xl transition-all duration-300 shadow-lg ${copiedCode ? 'bg-emerald-500' : 'btn-copy'} text-white`}>
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Direct Link</label>
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-lg border border-indigo-100">
              <input type="text" readOnly value={getShareLink()} className="flex-1 text-sm text-slate-500 bg-transparent outline-none truncate px-2 font-medium" />
              <button onClick={() => copyToClipboard(getShareLink(), 'link')} className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold ${copiedLink ? 'bg-emerald-500 text-white' : 'btn-secondary text-indigo-600'}`}>
                {copiedLink ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <span className="px-4 py-2 bg-white rounded-full shadow-md border border-indigo-100 text-sm font-medium text-slate-600">⏱️ Expires: {expiryTime}</span>
            <span className="px-4 py-2 bg-white rounded-full shadow-md border border-indigo-100 text-sm font-medium text-slate-600">📥 Downloads: {maxDownloads}</span>
            {password && <span className="px-4 py-2 bg-white rounded-full shadow-md border border-indigo-100 text-sm font-medium text-slate-600">🔒 Protected</span>}
          </div>

          <button onClick={resetForm} className="mt-8 w-full py-4 btn-secondary text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg border border-indigo-100">
            <RefreshCw className="w-5 h-5" />
            Share More Files
          </button>
        </div>
      )}
    </div>
  );
});
