import { File, Image, Film, Music, Archive, FileText } from 'lucide-react';

export const getFileIcon = (type, className = "w-5 h-5") => {
  if (!type) return <File className={className} />;
  if (type.startsWith('image/')) return <Image className={className} />;
  if (type.startsWith('video/')) return <Film className={className} />;
  if (type.startsWith('audio/')) return <Music className={className} />;
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return <Archive className={className} />;
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return <FileText className={className} />;
  return <File className={className} />;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const EXPIRY_OPTIONS = {
  '10m': 10 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000
};
