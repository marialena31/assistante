import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client for authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { path: filePath, content } = req.body;
    if (!filePath || !content) {
      return res.status(400).json({ message: 'File path and content are required' });
    }

    // Ensure the path is within the content directory
    const contentDir = path.join(process.cwd(), 'content');
    const fullPath = path.join(contentDir, filePath);
    
    if (!fullPath.startsWith(contentDir)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate JSON content
    try {
      JSON.stringify(content, null, 2);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON content' });
    }

    // Create backup of the current file
    const backupDir = path.join(process.cwd(), 'content-backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(
      backupDir,
      \`\${path.basename(filePath, '.json')}_\${timestamp}.json\`
    );

    if (fs.existsSync(fullPath)) {
      fs.copyFileSync(fullPath, backupPath);
    }

    // Write new content to file
    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));

    // Trigger page revalidation if needed
    const pagePath = \`/\${path.basename(filePath, '.json')}\`;
    await fetch(\`\${process.env.SITE_URL}/api/revalidate?path=\${pagePath}\`);

    return res.status(200).json({ message: 'Content saved successfully' });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
