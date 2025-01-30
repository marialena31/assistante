import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { createSecureHandler } from '../../../utils/supabase/auth';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/supabase';

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

    // Read file content
    const fileContent = await fs.promises.readFile(file.filepath);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.originalFilename?.split('.').pop() || 'jpg';
    const filename = `${timestamp}.${extension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .upload(filename, fileContent, {
        contentType: file.mimetype || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    // Clean up temp file
    await fs.promises.unlink(file.filepath);

    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Error handling upload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
