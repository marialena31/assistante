import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import type { Database } from '../types/database';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface ContentItem {
  title: string;
  content: string;
  type: 'page' | 'component';
  slug: string;
  created_at?: string;
  updated_at?: string;
}

function validateJsonContent(content: any): boolean {
  return content !== null && typeof content === 'object';
}

function scanDirectory(contentDir: string, items: ContentItem[]) {
  console.log(`Scanning directory: ${contentDir}`);
  const entries = fs.readdirSync(contentDir);
  
  entries.forEach(entry => {
    const fullPath = path.join(contentDir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Determine content type based on directory name
      const dirName = path.basename(fullPath);
      if (dirName === 'pages' || dirName === 'components') {
        const type = dirName === 'pages' ? 'page' : 'component';
        const subEntries = fs.readdirSync(fullPath);
        
        subEntries.forEach(subEntry => {
          if (subEntry.endsWith('.json')) {
            try {
              console.log(`Processing ${type} file: ${subEntry}`);
              const subPath = path.join(fullPath, subEntry);
              const fileContent = fs.readFileSync(subPath, 'utf-8');
              const content = JSON.parse(fileContent);

              if (!validateJsonContent(content)) {
                throw new Error('Invalid content structure');
              }

              const name = path.basename(subEntry, '.json');
              
              items.push({
                title: content.title || name,
                content: JSON.stringify(content, null, 2), // Pretty print JSON
                type,
                slug: name
              });

              console.log(`Successfully processed: ${subEntry}`);
            } catch (err) {
              console.error(`Error processing file ${subEntry}:`, err);
              console.error('Skipping this file and continuing...');
            }
          }
        });
      }
    }
  });
}

async function backupContent(items: ContentItem[]) {
  const backupDir = path.join(process.cwd(), 'content-backup');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);

  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    fs.mkdirSync(backupPath);

    // Create subdirectories for pages and components
    fs.mkdirSync(path.join(backupPath, 'pages'));
    fs.mkdirSync(path.join(backupPath, 'components'));

    items.forEach(item => {
      const dir = item.type === 'page' ? 'pages' : 'components';
      const filePath = path.join(backupPath, dir, `${item.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
    });

    console.log(`Backup created at: ${backupPath}`);
  } catch (err) {
    console.error('Error creating backup:', err);
    throw err;
  }
}

async function migrateContent() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in .env.local. Make sure SUPABASE_SERVICE_ROLE_KEY is set.');
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'api'
      }
    });

    const contentDir = path.join(process.cwd(), 'content');
    if (!fs.existsSync(contentDir)) {
      throw new Error('Content directory not found! Please ensure the content directory exists.');
    }

    const items: ContentItem[] = [];

    console.log('Starting content migration...');
    console.log('Reading from content directory:', contentDir);
    
    scanDirectory(contentDir, items);
    console.log(`Found ${items.length} items to migrate`);

    if (items.length === 0) {
      console.log('No content found to migrate');
      return;
    }

    console.log('Creating backup of current content...');
    await backupContent(items);

    console.log('Inserting content into Supabase...');
    const batchSize = 5;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`Inserting batch ${i / batchSize + 1} of ${Math.ceil(items.length / batchSize)}...`);
      
      const { data, error } = await supabase
        .from('contents')
        .upsert(batch, { 
          onConflict: 'slug,type',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }

      console.log(`Successfully inserted ${data?.length || 0} items in this batch`);
    }

    console.log('Migration complete! All content has been successfully migrated.');
    console.log('Remember: The original JSON files in the content directory remain unchanged.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateContent();
