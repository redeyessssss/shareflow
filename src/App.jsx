import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Share2, Lock, Clock, Copy, Check, X, FileText, Image, Film, Music, Archive, File, Send, Loader, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function FileShareApp() {
  const [mode, setMode] = useState('send');
  const [files, setFiles] = useState([]);
  const [shareCode, setShareCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [expiryTime, setExpiryTime] = useState('1h');
  const [password, setPassword] = useState('');
  const [maxDownloads, setMaxDownloads] = useState('unlimited');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const getFileIcon = (type) => {
    if (!type) return <File className="w-5 h-5" />;
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Film className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return <Archive className="w-5 h-5" />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
      const fileList = e.dataTransfer.files;
      const newFiles = Array.from(fileList).map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    }
  }, []);

  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  }, []);

  const removeFile = useCallback((index) => {
    setFiles(prev => {
      const fileToRemove = prev[index];
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetSendForm = useCallback(() => {
    setFiles([]);
    setGeneratedCode('');
    setPassword('');
    setMessage('');
    setExpiryTime('1h');
    setMaxDownloads('unlimited');
    setUploadProgress(0);
  }, []);

  const generateShareCode = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to share.');
      return;
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const timestamp = Date.now();
        // Simplify filename - remove special chars and spaces
        const safeFileName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, '_')
          .replace(/_+/g, '_')
          .substring(0, 100); // Limit length
        const filePath = `${code}/${timestamp}_${safeFileName}`;

        console.log('Uploading to path:', filePath);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shareflow')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        console.log('Upload success:', uploadData);

        const { data: urlData } = supabase.storage
          .from('shareflow')
          .getPublicUrl(filePath);

        console.log('Public URL:', urlData.publicUrl);

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: urlData.publicUrl,
          path: filePath
        });

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Calculate expiry timestamp
      const expiryMs = {
        '10m': 10 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      };
      const expiresAt = new Date(Date.now() + expiryMs[expiryTime]).toISOString();

      const shareData = {
        code,
        files: uploadedFiles,
        expiry: expiryTime,
        expires_at: expiresAt,
        password: password || null,
        max_downloads: maxDownloads,
        message: message || null,
        downloads: 0
      };

      console.log('Saving to database:', shareData);

      const { data: dbData, error: dbError } = await supabase
        .from('shares')
        .insert(shareData)
        .select();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Database save success:', dbData);
      
      setGeneratedCode(code);
      setSuccess('Files uploaded successfully!');

    } catch (err) {
      console.error('Full error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = generatedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReceive = async () => {
    if (shareCode.length !== 6) {
      setError('Please enter a valid 6-character code.');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadedFiles([]);
    setSenderMessage('');

    try {
      console.log('Fetching share code:', shareCode.toUpperCase());

      const { data: shareData, error: fetchError } = await supabase
        .from('shares')
        .select('*')
        .eq('code', shareCode.toUpperCase())
        .single();

      console.log('Fetch result:', JSON.stringify({ shareData, fetchError }, null, 2));

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError('Invalid code or files have expired.');
        return;
      }

      if (!shareData) {
        setError('Invalid code or files have expired.');
        return;
      }

      // Check password
      if (shareData.password && shareData.password !== downloadPassword) {
        setError('Incorrect password. Please try again.');
        return;
      }

      // Check max downloads
      if (shareData.max_downloads !== 'unlimited' && 
          shareData.downloads >= parseInt(shareData.max_downloads)) {
        setError('Download limit reached for this share.');
        return;
      }

      // Check expiry
      if (new Date(shareData.expires_at) < new Date()) {
        setError('This share has expired.');
        return;
      }

      // Update download count
      const { error: updateError } = await supabase
        .from('shares')
        .update({ downloads: shareData.downloads + 1 })
        .eq('code', shareCode.toUpperCase());

      if (updateError) {
        console.error('Update error:', updateError);
      }

      setDownloadedFiles(shareData.files || []);
      if (shareData.message) {
        setSenderMessage(shareData.message);
      }
      setSuccess('Files retrieved successfully!');

    } catch (err) {
      console.error('Receive error:', err);
      setError('Error retrieving files. Please check your connection and try again.');
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

  const resetReceiveForm = useCallback(() => {
    setShareCode('');
    setDownloadPassword('');
    setDownloadedFiles([]);
    setSenderMessage('');
    setError('');
    setSuccess('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {(error || success) && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md ${
            error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
            <p className={`text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
              {error || success}
            </p>
            <button onClick={() => { setError(''); setSuccess(''); }} className="ml-auto">
              <X className={`w-4 h-4 ${error ? 'text-red-500' : 'text-green-500'}`} />
            </button>
          </div>
        )}

        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Share2 className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">ShareFlow</h1>
          </div>
          <p className="text-gray-600">Secure file sharing powered by Supabase</p>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => { setMode('send'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              mode === 'send' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Send Files
          </button>
          <button
            onClick={() => { setMode('receive'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              mode === 'receive' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Receive Files
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {mode === 'send' ? (
            <div>
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
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={uploading}
                >
                  Select Files
                </button>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-3">Selected Files ({files.length})</h3>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
                      <div className="text-indigo-600">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      {!uploading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm font-medium text-indigo-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

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
                    onClick={generateShareCode}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Generate Share Code
                  </button>
                </div>
              )}

              {generatedCode && (
                <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                  <h3 className="font-semibold text-gray-800 mb-4 text-center">✅ Files Uploaded! Share this code:</h3>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <code className="flex-1 text-3xl font-bold text-indigo-600 text-center tracking-wider">
                      {generatedCode}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      title={copied ? 'Copied!' : 'Copy to clipboard'}
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>✓ Expires in: {expiryTime}</p>
                    <p>✓ Max downloads: {maxDownloads}</p>
                    {password && <p>✓ Password protected</p>}
                    {message && <p>✓ Message included</p>}
                  </div>
                  <button
                    onClick={resetSendForm}
                    className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Share More Files
                  </button>
                </div>
              )}
            </div>
          ) : (
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
                    onClick={resetReceiveForm}
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
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Clock className="w-8 h-8 text-indigo-600 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Auto-Expiry</h4>
            <p className="text-xs text-gray-600">Files automatically delete after expiry time</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Lock className="w-8 h-8 text-indigo-600 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Password Protection</h4>
            <p className="text-xs text-gray-600">Optional password for sensitive files</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Send className="w-8 h-8 text-indigo-600 mb-2" />
            <h4 className="font-semibold text-gray-800 mb-1">Add Messages</h4>
            <p className="text-xs text-gray-600">Include context with your files</p>
          </div>
        </div>
      </div>
    </div>
  );
}
