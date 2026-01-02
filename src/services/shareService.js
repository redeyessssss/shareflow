import { supabase } from '../config/supabase';
import { EXPIRY_OPTIONS } from '../utils/fileHelpers.jsx';

export const uploadFiles = async (files, code, onProgress) => {
  const uploadedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i].file;
    const timestamp = Date.now();
    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 100);
    const filePath = `${code}/${timestamp}_${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('shareflow')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('shareflow')
      .getPublicUrl(filePath);

    uploadedFiles.push({
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: urlData.publicUrl,
      path: filePath
    });

    onProgress?.(Math.round(((i + 1) / files.length) * 100));
  }

  return uploadedFiles;
};

export const createShare = async ({ code, files, expiryTime, password, maxDownloads, message }) => {
  const expiresAt = new Date(Date.now() + EXPIRY_OPTIONS[expiryTime]).toISOString();

  const shareData = {
    code,
    files,
    expiry: expiryTime,
    expires_at: expiresAt,
    password: password || null,
    max_downloads: maxDownloads,
    message: message || null,
    downloads: 0
  };

  const { error: dbError } = await supabase
    .from('shares')
    .insert(shareData)
    .select();

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }
};

export const fetchShare = async (code) => {
  const { data, error } = await supabase
    .from('shares')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error) {
    throw new Error('Invalid code or files have expired.');
  }

  return data;
};

export const incrementDownloadCount = async (code, currentCount) => {
  await supabase
    .from('shares')
    .update({ downloads: currentCount + 1 })
    .eq('code', code.toUpperCase());
};

export const generateShareCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
