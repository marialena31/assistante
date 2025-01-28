# Setup and Installation Guide

## Prerequisites

1. Node.js (v18 or higher)
2. Supabase account
3. Email domain ending in `@marialena-pietri.fr`
4. Git

## Initial Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your_service_key

   # Site
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Maria-Lena Portfolio

   # Auth Routes (DO NOT CHANGE)
   NEXT_PUBLIC_AUTH_SIGNIN=/auth-mlp2024/signin
   NEXT_PUBLIC_AUTH_REGISTER=/auth-mlp2024/register
   NEXT_PUBLIC_AUTH_RESET=/auth-mlp2024/reset
   NEXT_PUBLIC_AUTH_CALLBACK=/auth-mlp2024/callback
   NEXT_PUBLIC_ADMIN_DASHBOARD=/secure-dashboard-mlp2024

   # Email (optional)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASSWORD=your_smtp_password
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL scripts from `docs/API.md`
   - Enable Row Level Security (RLS)
   - Set up authentication providers

5. **Linting Setup**
   
   The project uses ESLint for JavaScript/TypeScript and Stylelint for CSS:

   ```bash
   # Install Stylelint VSCode extension (recommended)
   code --install-extension stylelint.vscode-stylelint

   # Run CSS linting
   npm run lint:css
   ```

   Stylelint configuration is in `.stylelintrc.json`:
   ```json
   {
     "extends": ["stylelint-config-standard"],
     "rules": {
       "at-rule-no-unknown": [
         true,
         {
           "ignoreAtRules": [
             "tailwind",
             "apply",
             "variants",
             "responsive",
             "screen",
             "layer"
           ]
         }
       ],
       "no-descending-specificity": null,
       "value-keyword-case": [
         "lower",
         {
           "ignoreKeywords": ["currentColor", "optimizeLegibility", "fadeIn", "slideUp", "toastSlide"]
         }
       ],
       "keyframes-name-pattern": null,
       "property-no-vendor-prefix": null,
       "at-rule-no-vendor-prefix": null,
       "declaration-empty-line-before": null
     }
   }
   ```

   This configuration:
   - Supports Tailwind CSS directives
   - Allows vendor prefixes for browser compatibility
   - Uses camelCase for animation names
   - Maintains consistent CSS value casing

5. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Favicon Setup**

   The project requires several favicon files in the `/public` directory:
   ```
   public/
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   ├── android-chrome-192x192.png
   ├── android-chrome-512x512.png
   └── site.webmanifest
   ```

   To set up favicons:
   1. Generate favicon files using a tool like [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/)
   2. Place the generated files in the `/public` directory
   3. Ensure `site.webmanifest` contains the correct site name and theme colors

   Note: The `/public` directory is gitignored, so these files need to be:
   - Backed up separately
   - Included in your deployment process
   - Added to the server during deployment

## Configuration

### Supabase Setup

1. **Create Project**
   - Create a new Supabase project
   - Note down project URL and keys

2. **Schema Setup**
   ```sql
   -- Create api schema
   create schema if not exists api;
   ```

3. **Authentication**
   - Enable Email auth provider
   - Configure secure redirect URLs:
     ```
     /auth-mlp2024/callback
     /auth-mlp2024/signin
     ```
   - Set up email templates
   - Configure password policies

4. **Database**
   - Create tables in `api` schema
   - Set up RLS policies
   - Create necessary indexes
   - Test policies thoroughly

5. **Storage**
   - Create buckets in `api` schema
   - Set up storage policies
   - Configure CORS

### Next.js Configuration

1. **next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     images: {
       domains: ['your-supabase-project.supabase.co'],
     },
     i18n: {
       locales: ['fr'],
       defaultLocale: 'fr',
     },
   };

   module.exports = nextConfig;
   ```

2. **tailwind.config.js**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: '#007AFF',
             50: '#E6F0FF',
             // ... other shades
           },
         },
       },
     },
     plugins: [
       require('@tailwindcss/typography'),
       require('@tailwindcss/forms'),
     ],
   };
   ```

## Security Configuration

1. **Row Level Security**
   ```sql
   -- Enable RLS on all tables
   alter table api.contents enable row level security;
   alter table api.posts enable row level security;
   alter table api.contact_messages enable row level security;

   -- Set up policies
   create policy "Public content is viewable by everyone"
     on api.contents for select
     using ( type = 'public' );

   create policy "Content is editable by admins only"
     on api.contents for all
     using ( auth.role() = 'admin' );
   ```

2. **Auth Configuration**
   ```typescript
   // utils/supabase/client.ts
   import { createClient as createSupabaseClient } from '@supabase/supabase-js';
   import type { Database } from '../../types/database';

   let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

   export const createClient = () => {
     if (supabaseClient) return supabaseClient;

     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
       (typeof window !== 'undefined' ? window.location.origin : '');

     const supabaseClient = createSupabaseClient<Database>(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         auth: {
           autoRefreshToken: true,
           persistSession: true,
           detectSessionInUrl: true,
           flowType: 'pkce',
           storage: typeof window !== 'undefined' ? window.localStorage : undefined,
           storageKey: 'supabase-auth-token',
           redirectTo: `${siteUrl}/auth-mlp2024/callback`
         }
       }
     );

     return supabaseClient;
   };
   ```

3. **Middleware Configuration**
   ```typescript
   // middleware.ts
   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export async function middleware(req: NextRequest) {
     const res = NextResponse.next()
     const supabase = createMiddlewareClient({ req, res })
     const {
       data: { session },
     } = await supabase.auth.getSession()

     // Protect admin routes
     if (req.nextUrl.pathname.startsWith('/secure-dashboard-mlp2024')) {
       if (!session?.user.email?.endsWith('@admin.com')) {
         return NextResponse.redirect(new URL('/auth-mlp2024/signin', req.url))
       }
     }

     return res
   }

   export const config = {
     matcher: ['/secure-dashboard-mlp2024/:path*']
   }
   ```

## Authentication Setup

1. **Install Required Packages**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Environment Variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000 # or production URL
   ```

3. **Supabase Configuration**
   - Go to your Supabase project dashboard
   - Under Authentication > URL Configuration:
     - Site URL: Set to your domain or localhost
     - Redirect URLs: Add your auth callback URL (`/auth-mlp2024/callback`)
   - Under Authentication > Email Templates:
     - Update confirmation email template with new callback URL

4. **Email Domain Restriction**
   - Only `@marialena-pietri.fr` email addresses can access admin interface
   - This is enforced at:
     - Client-side validation
     - Server-side middleware
     - API route protection

5. **Authentication Files**
   Create the following files:

   a. **Client-Side Auth** (`utils/supabase/client.ts`):
   ```typescript
   import { createBrowserClient } from '@supabase/ssr'
   
   export const createClient = () => {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   }
   ```

   b. **Server-Side Auth** (`utils/supabase/server.ts`):
   ```typescript
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'
   
   export const createClient = () => {
     const cookieStore = cookies()
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name) {
             return cookieStore.get(name)?.value
           },
           set(name, value, options) {
             cookieStore.set({ name, value, ...options })
           },
           remove(name, options) {
             cookieStore.set({ name, value: '', ...options })
           }
         }
       }
     )
   }
   ```

   c. **Middleware** (`utils/supabase/middleware.ts`):
   ```typescript
   import { createServerClient } from '@supabase/ssr'
   import { NextResponse } from 'next/server'
   
   export async function middleware(request) {
     const supabase = createServerClient(...)
     const { data: { user } } = await supabase.auth.getUser()
     
     // Handle auth routes and protect admin routes
     if (request.nextUrl.pathname.startsWith('/secure-dashboard-mlp2024')) {
       if (!user?.email?.endsWith('@marialena-pietri.fr')) {
         return NextResponse.redirect('/auth-mlp2024/signin')
       }
     }
     
     return NextResponse.next()
   }
   ```

6. **Secure Routes**
   ```typescript
   export const SECURE_ROUTES = {
     LOGIN: '/auth-mlp2024/signin',
     REGISTER: '/auth-mlp2024/register',
     RESET_PASSWORD: '/auth-mlp2024/reset',
     AUTH_CALLBACK: '/auth-mlp2024/callback',
     ADMIN: '/secure-dashboard-mlp2024'
   }
   ```

## Development Workflow

1. **Branch Strategy**
   - `main`: Production branch
   - `develop`: Development branch
   - Feature branches: `feature/feature-name`
   - Hotfix branches: `hotfix/fix-name`

2. **Commit Convention**
   ```
   type(scope): description

   [optional body]

   [optional footer]
   ```
   Types:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation
   - style: Formatting
   - refactor: Code restructuring
   - test: Tests
   - chore: Maintenance

3. **Pull Request Process**
   - Create feature branch
   - Make changes
   - Run tests
   - Create PR
   - Get review
   - Merge to develop

## Testing

1. **Unit Tests**
   ```bash
   npm run test
   # or
   yarn test
   ```

2. **E2E Tests**
   ```bash
   npm run cypress
   # or
   yarn cypress
   ```

## Deployment

1. **Production Build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Environment Variables**
   - Set up production environment variables
   - Configure secrets in deployment platform

3. **Deployment Platforms**
   - Vercel (recommended)
   - Netlify
   - Custom server

## Maintenance

1. **Regular Updates**
   ```bash
   npm outdated
   npm update
   # or
   yarn outdated
   yarn upgrade
   ```

2. **Database Backups**
   - Enable automatic backups in Supabase
   - Download manual backups periodically

3. **Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Monitor performance
   - Check logs regularly
