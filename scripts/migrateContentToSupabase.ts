import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const contentDir = path.join(process.cwd(), 'content');

async function processJsonFile(filePath: string, type: 'page' | 'component') {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const fileName = path.basename(filePath, '.json');
  const relativePath = path.relative(contentDir, filePath);
  const slug = relativePath.replace(/\.json$/, '').replace(/\\/g, '/');

  try {
    const { data, error } = await supabase
      .schema('api')
      .from('contents')
      .insert([
        {
          title: content.title || fileName,
          content: content.content || '',
          type,
          slug,
          properties: content.properties || {}
        }
      ]);

    if (error) {
      throw error;
    }

    console.log(`Successfully migrated ${type}: ${slug}`);
    return data;
  } catch (error) {
    console.error(`Error migrating ${type} ${slug}:`, error);
    throw error;
  }
}

async function main() {
  try {
    // Process pages
    const pagesDir = path.join(contentDir, 'pages');
    const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.json'));
    
    for (const file of pageFiles) {
      await processJsonFile(path.join(pagesDir, file), 'page');
    }

    // Process components
    const componentsDir = path.join(contentDir, 'components');
    const componentFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.json'));
    
    for (const file of componentFiles) {
      await processJsonFile(path.join(componentsDir, file), 'component');
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
