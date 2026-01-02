import { useState, useCallback, useEffect, memo } from 'react';
import { Download, Loader, RefreshCw, ArrowRight } from 'lucide-react';
import { fetchShare, incrementDownloadCount, deleteShare } from '../../services/shareService';
import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.jsx';

export const ReceiveFiles = memo(({ onError, onSuccess, initialCode = '' }) => {
  const [shareCode, setShareCode] = useState(initialCode);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [senderMessage, setSenderMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    if (initialCode && initialCode.length === 6) {
      setShareCode(initialCode);
    }
  }, [initialCode]);

  const handleReceive = async () => {
    if (shareCode.length !== 6) {
      onError('Please enter a valid 6-character code.');
      return;
    }

    setLoading(true);
    setDownloadedFiles([]);
    setSenderMessage('');

    try {
      const fetchedShare = await fetchShare(shareCode);

      if (fetchedShare.password && fetchedShare.password !== downloadPassword) {
        onError('Incorrect password. Please try again.');
        return;
      }

      if (fetchedShare.max_downloads !== 'unlimited' && 
          fetchedShare.downloads >= parseInt(fetchedShare.max_downloads)) {
        onError('Download limit reached for this share.');
        return;
      }

      if (new Date(fetchedShare.expires_at) < new Date()) {
        onError('This share has expired.');
        return;
      }

      await incrementDownloadCount(shareCode, fetchedShare.downloads);
      
      const newDownloadCount = fetchedShare.downloads + 1;
      if (fetchedShare.max_downloads !== 'unlimited' && 
          newDownloadCount >= parseInt(fetchedShare.max_downloads)) {
        setTimeout(() => {
          deleteShare(shareCode, fetchedShare.files);
        }, 1000);
      }

      setShareData(fetchedShare);
      setDownloadedFiles(fetchedShare.files || []);
      if (fetchedShare.message) setSenderMessage(fetchedShare.message);
      onSuccess('Files retrieved successfully!');
    } catch (err) {
      onError(err.message || 'Error retrieving files.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(file.url, '_blank');
    }
  };

  const resetForm = useCallback(() => {
    setShareCode('');
    setDownloadPassword('');
    setDownloadedFiles([]);
    setSenderMessage('');
    setShareData(null);
  }, []);

  return (
    <div className="gpu">
      {downloadedFiles.length === 0 ? (
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
              <Download className="w-7 h-7 text-indigo-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Receive Files</h2>
            <p className="text-sm text-slate-500">Enter the 6-digit code to access shared files</p>
          </div>

          <div className="max-w-sm mx-auto space-y-4">
            <div className="animate-fadeInUp" style={{ animationDelay: '50ms' }}>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Share Code</label>
              <input
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength="6"
                className="w-full p-4 text-2xl text-center font-bold tracking-[0.3em] font-mono border-2 border-slate-200 rounded-xl input-modern uppercase placeholder:text-slate-300"
              />
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Password (if required)</label>
              <input
                type="password"
                value={downloadPassword}
                onChange={(e) => setDownloadPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border-2 border-slate-200 rounded-xl text-sm input-modern"
              />
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: '150ms' }}>
              <button
                onClick={handleReceive}
                disabled={shareCode.length !== 6 || loading}
                className="w-full py-4 btn-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Access Files
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">How it works</p>
            <ul className="text-sm text-slate-600 space-y-2 stagger-children">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                Enter the 6-digit code shared with you
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                Enter password if the share is protected
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                Download your files
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="animate-scaleIn">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounceSoft">
              <Download className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Files Ready</h3>
          </div>

          {senderMessage && (
            <div className="mb-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fadeInUp">
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">Message</p>
              <p className="text-sm text-slate-700">{senderMessage}</p>
            </div>
          )}

          <div className="space-y-2 mb-5 stagger-children">
            {downloadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 group hover-lift">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <span className="text-indigo-500">{getFileIcon(file.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => downloadFile(file)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium flex items-center gap-1 hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={resetForm}
            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2 hover-lift"
          >
            <RefreshCw className="w-4 h-4" />
            Enter Another Code
          </button>
        </div>
      )}
    </div>
  );
});
