# Development Guidelines

## Important Rules

1. **Documentation First**
   - Always READ the project documentation before making any modifications
   - If information is missing, consult the official documentation
   - Update documentation after making changes

2. **Database Management**
   - All content MUST be managed through Supabase database
   - Use ONLY the `api` schema, NOT the `public` schema
   - All content updates MUST be done through the admin interface
   - When using Supabase client, ALWAYS use the schema method:
     ```typescript
     // CORRECT way to use Supabase client with API schema:
     const { data, error } = await supabase
       .schema('api')
       .from('table_name')
       .select()

     // INCORRECT - Don't use schema in table name:
     .from('api.table_name')  // This will fail!

     // INCORRECT - Don't skip schema:
     .from('table_name')  // This will use public schema!
     ```

3. **Authentication**
   - Use the latest `@supabase/ssr` package (NOT the deprecated auth-helpers)
   - Admin connection is managed by Supabase auth
   - Only `@marialena-pietri.fr` email domains are allowed
   - Secure paths:
     - Login: `/auth-mlp2024/signin`
     - Register: `/auth-mlp2024/register`
     - Reset Password: `/auth-mlp2024/reset`
     - Auth Callback: `/auth-mlp2024/callback`
     - Admin Dashboard: `/secure-dashboard-mlp2024`

4. **User Interface**
   - Use Toast component for displaying messages to users
   - DO NOT modify CSS configuration in next.config.js

## Code Style and Best Practices

### CSS and Styling Guidelines

1. **Stylelint Configuration**
   - Using Stylelint v15.x with `stylelint-config-standard`
   - Custom configuration in `.stylelintrc.json`
   - Vendor prefixes are allowed for browser compatibility
   - Animation keyframes use camelCase naming (e.g., fadeIn, slideUp)
   - Run linting with: `npm run lint:css`

2. **CSS Best Practices**
   - Use Tailwind CSS for component styling
   - Keep global styles in `styles/globals.css`
   - Use CSS animations for smooth transitions
   - Maintain browser compatibility with vendor prefixes
   - DO NOT modify CSS configuration in next.config.js

3. **Animation Names**
   - `fadeIn`: Fade in animation
   - `slideUp`: Slide up animation
   - `toastSlide`: Toast notification slide animation

### General Guidelines

1. **TypeScript First**
   - Use TypeScript for all new code
   - Define proper interfaces and types
   - Avoid using `any` type
   - Use proper type imports/exports

2. **Component Structure**
   ```typescript
   // components/MyComponent.tsx
   import { FC } from 'react';
   
   interface MyComponentProps {
     title: string;
     description?: string;
   }
   
   const MyComponent: FC<MyComponentProps> = ({ title, description }) => {
     return (
       <div>
         <h2>{title}</h2>
         {description && <p>{description}</p>}
       </div>
     );
   };
   
   export default MyComponent;
   ```

3. **File Naming**
   - Use PascalCase for components: `MyComponent.tsx`
   - Use camelCase for utilities: `formatDate.ts`
   - Use kebab-case for CSS files: `button-styles.css`

4. **Code Organization**
   - Group related files in directories
   - Keep components small and focused
   - Use index files for clean exports
   - Separate business logic from UI components

5. **Real-time Updates**
   - Use the `useRealtimeSubscription` hook for real-time data synchronization
   - Uses the latest `@supabase/ssr` package for browser client
   - Automatically shows toast notifications for data changes:
     - "Nouveau contenu ajouté" for inserts
     - "Contenu mis à jour" for updates
     - "Contenu supprimé" for deletes
   - Example usage:
     ```typescript
     import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

     function MyComponent() {
       const { data, loading, error } = useRealtimeSubscription({
         table: 'table_name',
         schema: 'api',  // Always use 'api' schema
         event: '*',  // or 'INSERT', 'UPDATE', 'DELETE'
         callback: (payload) => {
           // Optional callback for custom handling
           console.log('Data changed:', payload);
         }
       });

       if (loading) return <div>Loading...</div>;
       if (error) return <div>Error: {error.message}</div>;

       return (
         <div>
           {data.map(item => (
             <div key={item.id}>{/* Render your item */}</div>
           ))}
         </div>
       );
     }
     ```
   - Benefits:
     - Automatic data synchronization
     - Real-time toast notifications
     - No manual polling needed
     - Proper cleanup on component unmount
     - Uses the API schema by default
     - Type-safe with TypeScript generics

### Supabase Client Usage

#### Client Initialization

Use the `createClient` function from `utils/supabase/client.ts` to initialize the Supabase client. For React components, use `useMemo` to ensure a consistent client reference:

```typescript
const supabase = useMemo(() => createClient(), []);
```

#### Authentication

The client is configured with PKCE flow and handles auth state automatically:

```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user?.email?.endsWith('@marialena-pietri.fr')) {
  throw new Error('Not authenticated');
}
```

#### Database Operations

All database operations use the 'api' schema:

```typescript
const { data, error } = await supabase
  .from('pages')
  .select('*')
  .order('title', { ascending: true });
```

#### Content Management

Content is managed using TinyMCE editor in the admin interface. The editor requires a valid API key in the environment variables:

```env
NEXT_PUBLIC_TINYMCE_API_KEY=your_api_key
```

### Styling Guidelines

1. **Tailwind CSS**
   - Use Tailwind utility classes
   - Create custom components for repeated patterns
   - Follow mobile-first approach
   - Use theme variables for consistency

2. **CSS Modules (when needed)**
   - Use CSS Modules for complex animations
   - Keep global styles minimal
   - Use BEM naming convention for custom CSS

### State Management

1. **React Context**
   - Use for global state (theme, auth, etc.)
   - Keep contexts focused and small
   - Provide proper types for context values

2. **Local State**
   - Use hooks for local state
   - Prefer controlled components
   - Use reducers for complex state

### Performance

1. **Optimization**
   - Use proper React hooks dependencies
   - Implement proper memoization
   - Optimize images and assets
   - Use proper loading strategies

2. **Code Splitting**
   - Use dynamic imports when needed
   - Implement proper chunking
   - Optimize bundle size

### Testing

1. **Unit Tests**
   - Write tests for utilities and hooks
   - Use Jest and React Testing Library
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Integration Tests**
   - Test component integration
   - Test API integration
   - Use proper mocking

3. **E2E Tests**
   - Use Cypress for critical paths
   - Test user flows
   - Test responsive behavior

### Security

1. **Authentication**
   - Use Supabase auth
   - Implement proper role-based access
   - Secure API routes
   - Use proper session management

2. **Data Protection**
   - Validate all inputs
   - Sanitize outputs
   - Use proper CORS settings
   - Implement rate limiting

### Error Handling

1. **Client-Side**
   ```typescript
   try {
     await api.getData();
   } catch (error) {
     if (error instanceof ApiError) {
       // Handle API errors
     } else {
       // Handle other errors
     }
   }
   ```

2. **API Routes**
   ```typescript
   try {
     // API logic
   } catch (error) {
     return res.status(500).json({
       error: 'Internal Server Error',
       message: process.env.NODE_ENV === 'development' ? error.message : undefined
     });
   }
   ```

### Image Handling

### Blog Post Images

Blog post images are automatically processed and optimized using the following workflow:

1. **Upload**
   - Images are uploaded through the `/api/blog/upload-image` endpoint
   - Maximum file size: 10MB
   - Supported formats: JPG, PNG, WebP

2. **Processing**
   - Images are automatically processed into two formats:
     1. Thumbnail (400x300px) for list views
     2. Full size (1200x800px) for post detail
   - All images are converted to WebP format for optimal performance
   - Original aspect ratio is maintained using 'cover' fit

3. **Storage**
   - Images are stored in `/public/images/blog/`
   - Naming convention:
     - Thumbnails: `{timestamp}-{originalname}-thumbnail.webp`
     - Full size: `{timestamp}-{originalname}.webp`
   - Only the filename is stored in the database, not the full path

4. **Usage**
   - Use the `getImageUrl` utility from `utils/images.ts` to generate correct image URLs
   - Example:
     ```typescript
     import { getImageUrl } from '../../utils/images';
     
     // For thumbnails
     const thumbnailUrl = getImageUrl(post.featured_image, 'thumbnail');
     
     // For full size
     const fullUrl = getImageUrl(post.featured_image, 'full');
     ```

5. **Clean Up**
   - Temporary upload files are automatically cleaned up
   - When a blog post is deleted, associated images should be removed using the image processor's `deleteImages` function

### Best Practices

1. **Image Optimization**
   - Always use the appropriate image size for the context
   - Use thumbnails in list views
   - Use full size images in detail views
   - Include proper `alt` text for accessibility

2. **Performance**
   - Use the Next.js Image component with proper `sizes` attribute
   - Set `priority` prop for above-the-fold images
   - Use responsive image sizes:
     ```typescript
     sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
     ```

3. **Error Handling**
   - Always handle missing images gracefully
   - Provide fallback UI when images fail to load
   - Use proper error boundaries for image components

### Blog Post Editor

The blog post editor uses TinyMCE for rich text editing. You'll need to:

1. Get a TinyMCE API key from [TinyMCE Cloud](https://www.tiny.cloud/)
2. Add the API key to your environment variables:
   ```env
   NEXT_PUBLIC_TINYMCE_API_KEY=your-api-key
   ```

The editor supports:
- Rich text formatting
- Image uploads
- Tables
- Lists
- Links
- And other HTML formatting options

### Content Storage

Blog post content is stored as HTML in the Supabase database in the `api.blog_posts` table. The content is sanitized before storage to prevent XSS attacks.

### SEO

Each blog post supports:
- Custom SEO title
- Meta description
- Keywords
- Featured image

### Authentication

Authentication is handled using Supabase with the `@supabase/ssr` package for server-side rendering support. The following components are involved:

1. **Client-Side Authentication** (`utils/supabase/client.ts`):
   ```typescript
   import { createBrowserClient } from '@supabase/ssr'
   
   export const createClient = () => {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   }
   ```

2. **Server-Side Authentication** (`utils/supabase/server.ts`):
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

3. **Middleware** (`utils/supabase/middleware.ts`):
   - Handles session refresh
   - Manages auth redirects
   - Protects admin routes
   - Only allows `@marialena-pietri.fr` email addresses

### Authentication Flow

1. User attempts to access admin interface
2. If not logged in, redirected to `/auth-mlp2024/signin`
3. After successful login with `@marialena-pietri.fr` email:
   - Session is created
   - User is redirected to `/secure-dashboard-mlp2024`
4. Non-admin users are automatically signed out

### Protected Routes

The following routes require authentication:
- `/secure-dashboard-mlp2024/*` - Admin dashboard and related pages

### Email Domain Restriction

Only users with `@marialena-pietri.fr` email addresses can access the admin interface. This is enforced at multiple levels:
1. Client-side validation during login
2. Server-side middleware checks
3. API route protection

### Interface d'Administration

### DynamicForm Component

Le composant `DynamicForm` permet l'édition dynamique de contenu JSON avec les fonctionnalités suivantes :

- Édition de champs avec validation de type (string, number, boolean, array, object)
- Drag and drop pour réorganiser les champs
- Ajout et suppression de champs
- Historique des modifications
- Validation automatique du format JSON

#### Utilisation du Drag and Drop

Les champs peuvent être réorganisés en utilisant le drag and drop :
1. Chaque champ a une poignée de glissement (⋮⋮)
2. Les champs peuvent être réorganisés dans leur section
3. L'ordre est automatiquement sauvegardé après le déplacement

### Gestion des Articles de Blog

L'interface d'administration des articles propose plusieurs fonctionnalités :

#### Import d'Articles

1. Un bouton "Importer JSON" permet d'importer plusieurs articles à la fois
2. Un bouton "Télécharger Template" fournit un modèle de la structure JSON attendue
3. Validation automatique du format lors de l'import :
   - Vérification de la structure du tableau
   - Validation des champs requis (title, slug, content)
   - Attribution automatique des timestamps

#### Création et Édition

1. Interface de création avec champs pré-remplis
2. Édition avec formulaire dynamique
3. Prévisualisation du contenu
4. Gestion des métadonnées SEO

### Blog System

### Overview

The blog system consists of several components:
1. Database tables in the `api` schema
2. Admin interface for managing posts and categories
3. Public API endpoints for retrieving posts
4. Automatic category creation system

### Database Structure

The blog system uses the following tables in the `api` schema:
- `blog_posts`: Stores blog post content and metadata
- `blog_categories`: Stores categories
- `blog_posts_categories`: Junction table for post-category relationships
- `blog_tags`: Stores tags
- `blog_posts_tags`: Junction table for post-tag relationships

### Features

1. **Automatic Category Creation**
   - When creating/updating a post with new categories, they are automatically created
   - Uses the `api.ensure_category_exists()` function
   - Slugs are auto-generated from category names
   - Example:
     ```typescript
     // Creating a post with a new category
     const { data, error } = await supabase
       .schema('api')
       .rpc('ensure_category_exists', { category_name: 'New Category' });
     ```

2. **Row Level Security**
   - Public read access for published content
   - Write access restricted to @marialena-pietri.fr users
   - Policies automatically enforce these rules

3. **Admin Interface**
   - Located at `/secure-dashboard-mlp2024/blog`
   - Manage posts, categories, and tags
   - Drag-and-drop interface for reordering fields
   - JSON import/export functionality

### Routing

1. **Blog Pages**
   - Blog Index: `/blog`
   - Single Post: `/blog/[slug]`
   - Admin Post Editor: `/secure-dashboard-mlp2024/blog/edit/[id]`

2. **URL Structure**
   - Posts use SEO-friendly slugs
   - Categories are passed as query parameters: `/blog?category=category-slug`
   - All blog routes are handled by Next.js dynamic routing

3. **Middleware Protection**
   - Blog posts are protected by middleware
   - Only published posts are accessible
   - Unpublished/non-existent posts redirect to `/blog`

### UI Components

1. **Blog Index**
   - Category filter with post counts
   - Responsive grid layout
   - Featured images with proper optimization
   - Post excerpts and metadata

2. **Single Post**
   - Back to blog link
   - Category tags
   - Featured image
   - Author and date metadata
   - Rich text content
   - SEO optimization

3. **Category System**
   - Categories are managed through Supabase
   - Many-to-many relationship with posts
   - Categories are filterable on the blog index
   - Category counts are displayed in the filter UI

### Data Structure

1. **Blog Posts Table**
   ```sql
   CREATE TABLE api.blog_posts (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     title TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     content TEXT NOT NULL,
     excerpt TEXT,
     featured_image TEXT,
     author TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     status TEXT DEFAULT 'draft',
     seo JSONB
   );
   ```

2. **Categories Table**
   ```sql
   CREATE TABLE api.blog_categories (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     description TEXT
   );
   ```

3. **Post Categories Junction Table**
   ```sql
   CREATE TABLE api.blog_posts_categories (
     post_id UUID REFERENCES api.blog_posts(id) ON DELETE CASCADE,
     category_id UUID REFERENCES api.blog_categories(id) ON DELETE CASCADE,
     PRIMARY KEY (post_id, category_id)
   );
   ```

### Image Handling

1. **Storage**
   - Images are stored in Supabase Storage
   - Bucket: `blog-images`
   - Public access for published posts
   - Image optimization through Next.js Image component

2. **Upload Process**
   - Images are uploaded through TinyMCE editor
   - Automatic resizing and optimization
   - Proper error handling and validation

### SEO Optimization

1. **Meta Tags**
   - Dynamic title and description
   - Open Graph tags for social sharing
   - Proper canonical URLs

2. **Performance**
   - Static site generation with ISR
   - Image optimization
   - Proper caching headers

## Image Components

- Always use the legacy Image component from Next.js:
  ```typescript
  import Image from 'next/legacy/image'
  ```
  This avoids fetchPriority warnings and compatibility issues with the new Image component.

## TinyMCE Editor

The project uses TinyMCE for rich text editing. When configuring the image upload handler, make sure to use the correct signature:

```typescript
images_upload_handler: async (
  blobInfo: any, 
  success: (url: string, blob: Blob) => void,
  failure: (err: string, opts?: {remove?: boolean}) => void,
  progress?: (percent: number) => void
) => {
  // Implementation
}
```

Key points:
- The handler must accept all four parameters (blobInfo, success, failure, progress)
- The success callback expects both URL and blob parameters
- The failure callback can include an optional remove flag

## Newsletter

La gestion de la newsletter comprend plusieurs fonctionnalités :

### Composants

1. `NewsletterForm` : Formulaire d'inscription dans le footer
   - Champs : email
   - Validation du format email
   - Gestion des erreurs (email déjà inscrit, etc.)

2. `NewsletterModal` : Modal de sortie avec offre promotionnelle
   - Affichage conditionnel (une fois par semaine par utilisateur)
   - Code promo de 10%
   - Stockage de la dernière date d'affichage dans localStorage

### Administration

L'interface d'administration permet de :
- Visualiser la liste des inscrits
- Supprimer des inscriptions (soft delete)
- Exporter les données au format CSV pour import dans Mailchimp
- Gérer les catégories d'abonnement

### Base de données

Table `newsletter_subscriptions` dans le schéma `api` :
```sql
CREATE TABLE newsletter_subscriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_deleted boolean DEFAULT false NOT NULL,
  categories jsonb DEFAULT '[]'::jsonb NOT NULL,
  promo_code_used boolean DEFAULT false,
  last_modal_shown timestamp with time zone
);
```

### API Endpoints

- `POST /api/newsletter/subscribe` : Inscription à la newsletter
- `POST /api/newsletter/unsubscribe` : Désinscription
- `GET /api/newsletter/subscriptions` : Liste des inscrits (protégé)

### Sécurité

- Validation des emails
- Protection CSRF sur les endpoints
- Accès admin sécurisé via Supabase Auth
- Soft delete pour conserver l'historique

### Évolutions futures

1. Segmentation par catégories
   - Permettre aux utilisateurs de choisir leurs centres d'intérêt
   - Filtrer les exports par catégorie

2. Statistiques
   - Taux de conversion du modal
   - Taux d'utilisation des codes promo
   - Analyse des périodes d'inscription

## Authentication

### Security Notes

- Always use `supabase.auth.getUser()` for secure user authentication checks instead of `getSession()` or `onAuthStateChange` events
- The user object from `getSession()` comes directly from storage (cookies) and may not be authentic
- `getUser()` authenticates the data by contacting the Supabase Auth server
- Email domain validation should be done server-side using `getUser()`

### Auth Flow

1. User signs in at `/auth-mlp2024/signin`
2. After successful login, verify user with `getUser()`
3. If user has `@marialena-pietri.fr` email, redirect to `/secure-dashboard-mlp2024`
4. Otherwise, sign out and redirect to login

### Secure Routes

All secure routes are protected by middleware that:
1. Verifies user authentication using `getUser()`
2. Validates email domain
3. Redirects unauthorized users to login

### API Security

- All database operations use the 'api' schema
- Auth middleware protects all secure routes
- Session validation is done server-side
- Email domain restrictions are enforced at all levels
