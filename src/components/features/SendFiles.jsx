import { useState, useCallback, useEffect } from 'react';
import { Share2, Lock, Clock, Download, Send, Copy, Check, RefreshCw, Link } from 'lucide-react';
import { DropZone, FileItem, ProgressBar } from '../ui';
import { uploadFiles, createShare, generateShareCode } from '../../services/shareService';

export const SendFiles = ({ onError, onSuccess }) => {
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

  const getShareLink = () => `${window.location.origin}?code=${generatedCode}`;

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const handleFilesSelected = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
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
    setFiles([]);
    setGeneratedCode('');
    setPassword('');
    setMessage('');
    setExpiryTime('1h');
    setMaxDownloads('unlimited');
    setUploadProgress(0);
  }, []);

  const handleGenerateCode = async () => {
    if (files.length === 0) {
      onError('Please select at least one file to share.');
      return;
    }

    const code = generateShareCode();
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = await uploadFiles(files, code, setUploadProgress);
      await createShare({ code, files: uploadedFiles, expiryTime, password, maxDownloads, message });
      setGeneratedCode(code);
      onSuccess('Files uploaded successfully!');
    } catch (err) {
      onError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  return (
    <div>
      <DropZone onFilesSelected={handleFilesSelected} disabled={uploading} />

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-gray-800 mb-3">Selected Files ({files.length})</h3>
          {files.map((file, index) => (
            <FileItem key={index} file={file} onRemove={() => removeFile(index)} showRemove={!uploading} />
          ))}
        </div>
      )}

      {uploading && <ProgressBar progress={uploadProgress} />}

      {files.length > 0 && !generatedCode && !uploading && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Advanced Options
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Expiry Time
              </label>
              <select
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="10m">10 minutes</option>
                <option value="1h">1 hour</option>
                <option value="6h">6 hours</option>
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Download className="w-4 h-4 inline mr-1" />
                Max Downloads
              </label>
              <select
                value={maxDownloads}
                onChange={(e) => setMaxDownloads(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="1">1 time</option>
                <option value="5">5 times</option>
                <option value="10">10 times</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Password Protection (Optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for no password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Send className="w-4 h-4 inline mr-1" />
              Message to Recipient (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleGenerateCode}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Generate Share Code
          </button>
        </div>
      )}

      {generatedCode && (
        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
          <h3 className="font-semibold text-gray-800 mb-4 text-center">✅ Files Uploaded!</h3>
          
          {/* Share Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share Code</label>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
              <code className="flex-1 text-3xl font-bold text-indigo-600 text-center tracking-wider">
                {generatedCode}
              </code>
              <button
                onClick={() => copyToClipboard(generatedCode, 'code')}
                className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                title={copiedCode ? 'Copied!' : 'Copy code'}
              >
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Share Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 inline mr-1" />
              Share Link
            </label>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <input
                type="text"
                readOnly
                value={getShareLink()}
                className="flex-1 text-sm text-gray-600 bg-transparent outline-none truncate"
              />
              <button
                onClick={() => copyToClipboard(getShareLink(), 'link')}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                title={copiedLink ? 'Copied!' : 'Copy link'}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>✓ Expires in: {expiryTime}</p>
            <p>✓ Max downloads: {maxDownloads}</p>
            {password && <p>✓ Password protected</p>}
            {message && <p>✓ Message included</p>}
          </div>
          <button
            onClick={resetForm}
            className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Share More Files
          </button>
        </div>
      )}
    </div>
  );
};
