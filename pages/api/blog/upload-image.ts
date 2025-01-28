import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import { createSecureHandler } from '../../../utils/auth';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/database';

type SecureHandlerContext = {
  user: any;
  supabaseAdmin: ReturnType<typeof createClient<Database>>;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const STORAGE_BUCKET = 'blog-images'; // Supabase storage bucket name

export default createSecureHandler(async function handler(
  req: NextApiRequest, 
  res: NextApiResponse,
  { supabaseAdmin }: SecureHandlerContext
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
    });

    const [fields, files] = await form.parse(req);
    const file = files.image?.[0];
    const articleTitle = fields.title?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
    }

    const fileExt = file.originalFilename?.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
      return res.status(400).json({ error: 'Invalid file type. Allowed extensions: jpg, jpeg, png, gif, webp' });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    let fileBuffer;
    try {
      fileBuffer = await fs.readFile(file.filepath);
    } catch (error) {
      console.error('Error reading file:', error);
      return res.status(500).json({ error: 'Error reading uploaded file' });
    }

    // Generate alt text from article title or use a default
    const altText = articleTitle ? 
      `Image illustrant l'article : ${articleTitle}` : 
      'Image d\'illustration pour l\'article';

    // Upload the file with metadata
    const { error: uploadError, data: uploadData } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
        duplex: 'half',
        metadata: {
          alt: altText,
        }
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ 
        error: uploadError.message,
        details: uploadError.message.includes('Bucket not found') 
          ? `Please create a bucket named '${STORAGE_BUCKET}' in your Supabase dashboard and ensure it has public access.`
          : uploadError.message
      });
    }

    if (!uploadData?.path) {
      return res.status(500).json({ error: 'No upload path returned' });
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(uploadData.path);

    // Clean up the temporary file
    try {
      await fs.unlink(file.filepath);
    } catch (error) {
      console.error('Error cleaning up temp file:', error);
    }

    return res.status(200).json({ 
      url: publicUrl,
      alt: altText
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.stack
    });
  }
});
