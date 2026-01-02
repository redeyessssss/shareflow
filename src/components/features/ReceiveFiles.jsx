import { useState, useCallback, useEffect, memo } from 'react';
import { Download, Loader, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { fetchShare, incrementDownloadCount, deleteShare } from '../../services/shareService';
import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.jsx';

export const ReceiveFiles = memo(({ onError, onSuccess, initialCode = '' }) => {
  const [shareCode, setShareCode] = useState(initialCode);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [senderMessage, setSenderMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);

  useEffect(() => { if (initialCode && initialCode.length === 6) setShareCode(initialCode); }, [initialCode]);

  const handleReceive = async () => {
    if (shareCode.length !== 6) { onError('Please enter a valid 6-character code.'); return; }
    setLoading(true); setDownloadedFiles([]); setSenderMessage('');
    try {
      const fetchedShare = await fetchShare(shareCode);
      if (fetchedShare.password && fetchedShare.password !== downloadPassword) { onError('Incorrect password.'); return; }
      if (fetchedShare.max_downloads !== 'unlimited' && fetchedShare.downloads >= parseInt(fetchedShare.max_downloads)) { onError('Download limit reached.'); return; }
      if (new Date(fetchedShare.expires_at) < new Date()) { onError('This share has expired.'); return; }
      await incrementDownloadCount(shareCode, fetchedShare.downloads);
      const newCount = fetchedShare.downloads + 1;
      if (fetchedShare.max_downloads !== 'unlimited' && newCount >= parseInt(fetchedShare.max_downloads)) {
        setTimeout(() => deleteShare(shareCode, fetchedShare.files), 1000);
      }
      setDownloadedFiles(fetchedShare.files || []);
      if (fetchedShare.message) setSenderMessage(fetchedShare.message);
      onSuccess('Files retrieved successfully!');
    } catch (err) { onError(err.message || 'Error retrieving files.'); }
    finally { setLoading(false); }
  };

  const downloadFile = async (file, index) => {
    setDownloadingFile(index);
    try {
      const response = await fetch(file.url); const blob = await response.blob();
      const url = window.URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = file.name; document.body.appendChild(link);
      link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(url);
    } catch { window.open(file.url, '_blank'); }
    finally { setTimeout(() => setDownloadingFile(null), 500); }
  };

  const resetForm = useCallback(() => { setShareCode(''); setDownloadPassword(''); setDownloadedFiles([]); setSenderMessage(''); }, []);

  return (
    <div className="gpu">
      {downloadedFiles.length === 0 ? (
        <div className="animate-fadeIn">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float shadow-xl">
              <Download className="w-12 h-12 text-indigo-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Receive Files</h2>
            <p className="text-slate-500">Enter the 6-digit code to access shared files</p>
          </div>

          <div className="max-w-sm mx-auto space-y-5">
            <div className="animate-fadeInUp" style={{ animationDelay: '50ms' }}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Share Code</label>
              <input type="text" value={shareCode} onChange={(e) => setShareCode(e.target.value.toUpperCase())} placeholder="XXXXXX" maxLength="6"
                className="w-full p-5 text-3xl text-center font-black tracking-[0.4em] font-mono border-3 border-indigo-200 rounded-2xl input-modern uppercase placeholder:text-indigo-200 placeholder:font-normal focus:border-indigo-400 bg-gradient-to-br from-white to-indigo-50/30" />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Password (if required)</label>
              <input type="password" value={downloadPassword} onChange={(e) => setDownloadPassword(e.target.value)} placeholder="Enter password"
                className="w-full p-4 border-2 border-indigo-100 rounded-xl text-sm input-modern" />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '150ms' }}>
              <button onClick={handleReceive} disabled={shareCode.length !== 6 || loading}
                className="w-full py-5 btn-primary text-white rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl">
                {loading ? (<><Loader className="w-5 h-5 animate-spin" />Loading...</>) : (<><Sparkles className="w-5 h-5" />Access Files<ArrowRight className="w-5 h-5" /></>)}
              </button>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 rounded-2xl animate-fadeInUp border border-indigo-100" style={{ animationDelay: '200ms' }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">How it works</p>
            <ul className="text-sm text-slate-600 space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">1</span>
                Enter the 6-digit code shared with you
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">2</span>
                Enter password if the share is protected
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">3</span>
                Download your files instantly
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="animate-scaleIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounceSoft shadow-xl shadow-emerald-200">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-slate-800">Files Ready!</h3>
          </div>

          {senderMessage && (
            <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 animate-fadeInUp">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">💬 Message from sender</p>
              <p className="text-slate-700">{senderMessage}</p>
            </div>
          )}

          <div className="space-y-3 mb-6 stagger-children">
            {downloadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-indigo-50/30 rounded-2xl hover:from-indigo-50 hover:to-purple-50/50 transition-all duration-300 group hover-lift border border-indigo-100 shadow-md">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-indigo-500 text-xl">{getFileIcon(file.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <button 
                  onClick={() => downloadFile(file, index)} 
                  disabled={downloadingFile === index}
                  className="px-5 py-3 btn-download text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                  <Download className={`w-5 h-5 download-icon ${downloadingFile === index ? 'animate-bounceSoft' : ''}`} />
                  <span className="hidden sm:inline">{downloadingFile === index ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
            ))}
          </div>

          <button onClick={resetForm} className="w-full py-4 btn-secondary text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg border border-indigo-100">
            <RefreshCw className="w-5 h-5" />
            Enter Another Code
          </button>
        </div>
      )}
    </div>
  );
});
