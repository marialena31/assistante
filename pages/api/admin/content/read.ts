import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client for authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { path: filePath } = req.query;
    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ message: 'File path is required' });
    }

    // Ensure the path is within the content directory
    const contentDir = path.join(process.cwd(), 'content');
    const fullPath = path.join(contentDir, filePath);
    
    if (!fullPath.startsWith(contentDir)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Read and parse JSON file
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    return res.status(200).json({ content });
  } catch (error: any) {
    console.error('Error reading content:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
