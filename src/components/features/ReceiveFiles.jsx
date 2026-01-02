import { useState, useCallback, useEffect } from 'react';
import { Download, Loader, RefreshCw } from 'lucide-react';
import { FileItem } from '../ui';
import { fetchShare, incrementDownloadCount } from '../../services/shareService';
import { getFileIcon, formatFileSize } from '../../utils/fileHelpers.jsx';

export const ReceiveFiles = ({ onError, onSuccess, initialCode = '' }) => {
  const [shareCode, setShareCode] = useState(initialCode);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [senderMessage, setSenderMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fetch if initialCode is provided
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
      const shareData = await fetchShare(shareCode);

      if (shareData.password && shareData.password !== downloadPassword) {
        onError('Incorrect password. Please try again.');
        return;
      }

      if (shareData.max_downloads !== 'unlimited' && 
          shareData.downloads >= parseInt(shareData.max_downloads)) {
        onError('Download limit reached for this share.');
        return;
      }

      if (new Date(shareData.expires_at) < new Date()) {
        onError('This share has expired.');
        return;
      }

      await incrementDownloadCount(shareCode, shareData.downloads);
      setDownloadedFiles(shareData.files || []);
      if (shareData.message) setSenderMessage(shareData.message);
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
  }, []);

  return (
    <div>
      <div className="text-center mb-6">
        <Download className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Receive Files</h2>
        <p className="text-gray-600">Enter the share code to download files</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Share Code</label>
          <input
            type="text"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit code"
            maxLength="6"
            className="w-full p-4 text-2xl text-center font-bold tracking-wider border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password (if required)</label>
          <input
            type="password"
            value={downloadPassword}
            onChange={(e) => setDownloadPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleReceive}
          disabled={shareCode.length !== 6 || loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Access Files
            </>
          )}
        </button>
      </div>

      {downloadedFiles.length > 0 && (
        <div className="mt-8 max-w-md mx-auto">
          {senderMessage && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-800 mb-1">Message from sender:</p>
              <p className="text-sm text-indigo-700">{senderMessage}</p>
            </div>
          )}
          <h3 className="font-semibold text-gray-800 mb-4">Available Files ({downloadedFiles.length}):</h3>
          <div className="space-y-3">
            {downloadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-indigo-600">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => downloadFile(file)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={resetForm}
            className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Enter Another Code
          </button>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Enter the 6-digit code shared with you</li>
          <li>• Enter password if protected</li>
          <li>• Click to download each file</li>
        </ul>
      </div>
    </div>
  );
};
