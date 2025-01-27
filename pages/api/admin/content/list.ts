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

    // Get list of JSON files from content directory
    const contentDir = path.join(process.cwd(), 'content');
    const pages: any[] = [];

    function scanDirectory(dir: string) {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (path.extname(item) === '.json') {
          const relativePath = path.relative(contentDir, fullPath);
          const name = path.basename(item, '.json');
          
          pages.push({
            id: relativePath,
            name: name,
            filePath: relativePath,
          });
        }
      });
    }

    scanDirectory(contentDir);

    return res.status(200).json({ pages });
  } catch (error: any) {
    console.error('Error listing content:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
