# API Documentation

## Overview

The API is built using Supabase and follows RESTful principles. All endpoints are prefixed with `/api/v1`.

## Important Notes

1. **Schema**
   - All tables MUST be in the `api` schema
   - The `public` schema is NOT used for security reasons
   - All database operations must respect this configuration
   - When using Supabase client, ALWAYS use the schema method:
     ```typescript
     // CORRECT way:
     supabase
       .schema('api')
       .from('table_name')
       .select()

     // INCORRECT ways:
     // DON'T use schema in table name
     supabase.from('api.table_name')
     // DON'T skip schema
     supabase.from('table_name')
     ```

2. **Authentication**
   - Uses the latest `@supabase/ssr` package
   - Cookie-based authentication (NOT token-based)
   - Only `@marialena-pietri.fr` email domains allowed
   - All admin routes are protected

3. **Documentation**
   - Always check `swagger.yaml` before API modifications
   - Update `swagger.yaml` after any API changes
   - Keep API documentation in sync with implementation

## API Security

All secure API routes are protected using Supabase authentication. We use a custom secure handler that:

1. Verifies the user's session using `@supabase/ssr`
2. Validates the session token
3. Ensures the user exists and has proper permissions

### Using the Secure Handler

To protect an API route, wrap your handler with `createSecureHandler`:

```typescript
import { createSecureHandler } from '../../../utils/auth';

export default createSecureHandler(async function handler(
  req: NextApiRequest, 
  res: NextApiResponse,
  { user, supabaseAdmin } // Injected auth context
) {
  // Your secure API logic here
});
```

The secure handler provides:
- `user`: The authenticated user object
- `supabaseAdmin`: A Supabase client with admin privileges for database operations

### Protected Routes

The following routes require authentication:

- `/api/admin/*` - All admin routes
- `/api/blog/upload-image` - Image upload endpoint
- Any other routes that modify data

### Authentication Flow

1. Client sends request with Supabase session cookie
2. Server validates session using `@supabase/ssr`
3. If valid, handler receives authenticated user context
4. If invalid, returns 401 Unauthorized

## Authentication API

Authentication is handled by Supabase using the `@supabase/ssr` package. The following endpoints are available:

### Sign In
- **Path**: `/auth-mlp2024/signin`
- **Method**: POST
- **Description**: Authenticate user with email and password
- **Access**: Public
- **Email Restriction**: Only `@marialena-pietri.fr` domains allowed
- **Request Body**:
  ```json
  {
    "email": "user@marialena-pietri.fr",
    "password": "password"
  }
  ```
- **Response**:
  - 200: Successfully authenticated
  - 401: Invalid credentials
  - 403: Not an authorized email domain

### Password Reset
- **Path**: `/auth-mlp2024/reset`
- **Method**: POST
- **Description**: Request password reset email
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "user@marialena-pietri.fr"
  }
  ```
- **Response**:
  - 200: Reset email sent
  - 404: User not found

### Auth Callback
- **Path**: `/auth-mlp2024/callback`
- **Method**: GET
- **Description**: Handle authentication callbacks (email confirmation, password reset)
- **Access**: Public
- **Query Parameters**:
  - `token_hash`: Authentication token
  - `type`: Callback type (signup, recovery, etc.)
- **Response**:
  - 302: Redirect to appropriate page
  - 400: Invalid token

### Admin Dashboard
- **Path**: `/secure-dashboard-mlp2024`
- **Method**: GET
- **Description**: Access admin dashboard
- **Access**: Authenticated users with `@marialena-pietri.fr` email
- **Response**:
  - 200: Dashboard rendered
  - 401: Not authenticated
  - 403: Not authorized (non-admin user)

## API Endpoints

### Content Management

#### Get Content

```yaml
GET /api/v1/contents/{slug}
Security:
  - Public content: No auth required
  - Protected content: Bearer token required
  - Admin content: Admin token required

Parameters:
  - slug: string (required)
  - schema: string (fixed to 'api')

Response:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            title: string
            content: object
            type: string
            schema: string (always 'api')
  404:
    description: Content not found
```

#### Update Content

```yaml
PUT /api/v1/contents/{slug}
Security:
  - bearerAuth: []

Parameters:
  - slug: string (required)
  - schema: string (fixed to 'api')

Request Body:
  content:
    application/json:
      schema:
        type: object
        properties:
          title: string
          content: object
          type: string

Response:
  200:
    description: Content updated successfully
  403:
    description: Unauthorized
  404:
    description: Content not found
```

### Blog Posts API

#### Image Upload
```yaml
POST /api/blog/upload-image
Security:
  - bearerAuth: []

Request:
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          image:
            type: string
            format: binary
            description: Image file (max 10MB, supported formats: jpg, png, webp)

Response:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            filename:
              type: string
              description: The filename to use for referencing the image
  400:
    description: No image provided or invalid image
  413:
    description: Image too large (max 10MB)
  500:
    description: Server error during upload or processing
```

#### Image Processing
- All uploaded images are automatically processed into two formats:
  1. Thumbnail (400x300px) for list views
  2. Full size (1200x800px) for post detail
- Images are converted to WebP format for optimal performance
- Images are stored in `/images/blog/` with the following naming convention:
  - Thumbnails: `{filename}-thumbnail.webp`
  - Full size: `{filename}.webp`

#### Structure d'un Article

Les articles de blog suivent la structure JSON suivante :

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;  // Filename only, not full path
  status: 'draft' | 'published' | 'scheduled';
  created_at: string;  // ISO date
  updated_at: string;  // ISO date
  author: string | null;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string[] | null;
  } | null;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;  // ISO date
    updated_at: string;  // ISO date
  }>;
}
```

#### Status des Articles

- `draft`: Article en cours de rédaction
- `published`: Article publié et visible sur le site
- `scheduled`: Article planifié pour publication future

#### Notes Importantes

1. Les articles sont stockés dans la table `blog_posts` du schéma `api`
2. Les catégories sont gérées via une table de jonction `blog_posts_categories`
3. Tous les champs marqués comme `| null` sont optionnels
4. Les dates sont toujours au format ISO 8601
5. Le statut d'un article détermine sa visibilité sur le site

#### Import d'Articles

L'interface d'administration permet d'importer plusieurs articles à la fois via un fichier JSON. Le fichier doit contenir un tableau d'articles suivant la structure ci-dessus. Exemple :

```json
[
  {
    "title": "Article 1",
    "slug": "article-1",
    "content": "Contenu...",
    ...
  },
  {
    "title": "Article 2",
    "slug": "article-2",
    "content": "Contenu...",
    ...
  }
]
```

Les champs `created_at` et `updated_at` sont automatiquement ajoutés lors de l'import.

#### List Posts

```yaml
GET /api/v1/posts

Parameters:
  - page: integer (optional) - Page number
  - limit: integer (optional) - Items per page
  - category: string (optional) - Filter by category

Response:
  200:
    description: Posts retrieved successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                type: object
                properties:
                  id: string
                  title: string
                  excerpt: string
                  content: string
            pagination:
              type: object
              properties:
                total: integer
                pages: integer
                current: integer
```

#### Get Post

```yaml
GET /api/v1/posts/{id}

Parameters:
  - id: string (required) - Post ID

Response:
  200:
    description: Post retrieved successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            id: string
            title: string
            content: string
  404:
    description: Post not found
```

### Blog System

### Database Schema

#### Tables

1. **blog_posts**
   ```sql
   CREATE TABLE api.blog_posts (
       id BIGSERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       slug VARCHAR(255) NOT NULL UNIQUE,
       content TEXT NOT NULL,
       excerpt TEXT,
       featured_image TEXT,
       status VARCHAR(50) DEFAULT 'draft',
       author VARCHAR(255),
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW(),
       seo JSONB DEFAULT '{}'::jsonb
   );
   ```

2. **blog_categories**
   ```sql
   CREATE TABLE api.blog_categories (
       id BIGSERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       slug VARCHAR(255) NOT NULL UNIQUE,
       description TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **blog_posts_categories** (Junction Table)
   ```sql
   CREATE TABLE api.blog_posts_categories (
       post_id BIGINT REFERENCES api.blog_posts(id),
       category_id BIGINT REFERENCES api.blog_categories(id),
       PRIMARY KEY (post_id, category_id)
   );
   ```

### Automatic Category Creation

When creating or updating a blog post, categories that don't exist will be automatically created. The system will:
1. Check if the category exists by name
2. If not found, create a new category with:
   - Name: As provided
   - Slug: Auto-generated from name (lowercase, spaces replaced with hyphens)
   - Description: Empty
   - Created/Updated timestamps: Current time

Example:
```sql
SELECT api.ensure_category_exists('New Category');
-- Creates category if it doesn't exist:
-- name: "New Category"
-- slug: "new-category"
```

### Security

All tables use Row Level Security (RLS) policies:
- Read access: Public for published content
- Write access: Restricted to authenticated users with @marialena-pietri.fr email addresses

### Permissions

1. Schema Level:
   ```sql
   GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;
   GRANT ALL ON SCHEMA api TO postgres, service_role;
   ```

2. Table Level:
   - Authenticated users: Full access to all blog tables
   - Anonymous users: Read-only access to all blog tables
   - Service role: Full access to all blog tables

### Contact Form

#### Submit Contact Form

```yaml
POST /api/v1/contact

Request Body:
  content:
    application/json:
      schema:
        type: object
        properties:
          name: string
          email: string
          message: string
        required:
          - name
          - email
          - message

Response:
  200:
    description: Message sent successfully
  400:
    description: Invalid input
  429:
    description: Too many requests
```

## Appointment System

### Database Schema

The appointment system uses the following tables in the `api` schema:

1. **appointment_settings**
   - Configuration for the appointment system
   - Contains title, description, photo URL
   - Google Calendar sync settings
   - Reminder templates and settings

2. **appointment_durations**
   - Available duration options (e.g., 15min, 30min, 1h)
   - Can be activated/deactivated

3. **appointment_purposes**
   - Configurable appointment purposes
   - Contains title and description
   - Can be activated/deactivated

4. **appointments**
   - Main table for storing appointment data
   - Contains client information
   - Appointment details (date, duration, type)
   - Status tracking
   - Google Calendar integration

5. **availability_slots**
   - Defines available time slots
   - Configurable per day of week
   - Can be activated/deactivated

### Security

All tables use Row Level Security (RLS) with the following policies:

1. **Public Access**
   - Can view active settings, durations, and purposes
   - Can create new appointments
   - Can view own appointments (by email)
   - Can view available time slots

2. **Service Role Access**
   - Full access to all tables
   - Used for admin operations

### API Endpoints

#### Public Endpoints

1. **GET /api/appointments/settings**
   - Returns appointment system configuration
   - Public access

2. **GET /api/appointments/durations**
   - Returns active duration options
   - Public access

3. **GET /api/appointments/purposes**
   - Returns active appointment purposes
   - Public access

4. **GET /api/appointments/availability**
   - Returns available time slots
   - Considers existing appointments
   - Public access

5. **POST /api/appointments**
   - Creates a new appointment
   - Validates all required fields
   - Sends confirmation email
   - Public access

#### Admin Endpoints (Protected)

1. **GET /api/admin/appointments**
   - Lists all appointments
   - Filterable by status and date range
   - Protected route

2. **PUT /api/admin/appointments/:id**
   - Updates appointment status
   - Protected route

3. **PUT /api/admin/settings**
   - Updates appointment system settings
   - Protected route

4. **PUT /api/admin/availability**
   - Updates availability slots
   - Protected route

### Data Types

```typescript
interface AppointmentSettings {
  id: string;
  title: string;
  description?: string;
  photo_url?: string;
  google_calendar_sync_url?: string;
  email_reminder_enabled: boolean;
  sms_reminder_enabled: boolean;
  email_reminder_template?: string;
  sms_reminder_template?: string;
  created_at: string;
  updated_at: string;
}

interface AppointmentDuration {
  id: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

interface AppointmentPurpose {
  id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone?: string;
  address?: string;
  purpose_id: string;
  message?: string;
  appointment_type: 'phone' | 'video' | 'in_person';
  appointment_date: string;
  duration_minutes: number;
  reminders_enabled: boolean;
  status: 'confirmed' | 'cancelled' | 'modified';
  google_calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}
```

### Error Handling

All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include:
```typescript
interface ErrorResponse {
  error: string;
  details?: string;
}
```

## Realtime Subscriptions

### Using the Realtime Hook

The application provides a custom hook `useRealtimeSubscription` for handling Supabase realtime subscriptions. This hook must be used for all realtime data synchronization to ensure consistency and proper error handling.

```typescript
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

// Example usage
function MyComponent() {
  const { data, loading, error } = useRealtimeSubscription<BlogPost>({
    table: 'blog_posts',
    schema: 'api', // Always use 'api' schema
    event: '*', // or 'INSERT', 'UPDATE', 'DELETE'
    callback: (payload) => {
      console.log('Realtime update:', payload);
    }
  });
}
```

### Important Notes for Realtime Subscriptions

1. **Schema Requirement**
   - Always use the `api` schema for subscriptions
   - The hook defaults to `api` schema if not specified

2. **Type Safety**
   - The hook is generic and type-safe
   - Your type must extend `{ [key: string]: any }`
   ```typescript
   interface BlogPost {
     id: number;
     title: string;
     content: string;
   }
   useRealtimeSubscription<BlogPost>({ ... })
   ```

3. **Channel Naming**
   - Channel names follow the format: `realtime:${schema}:${table}`
   - Channels are automatically cleaned up on component unmount

4. **Event Types**
   - Support for all Supabase events: `INSERT`, `UPDATE`, `DELETE`, `*`
   - The `*` event type listens for all changes (default)

5. **Toast Notifications**
   - Built-in toast notifications for data changes
   - Messages are in French to match the application's locale

6. **Error Handling**
   - Errors are caught and available via the `error` return value
   - Loading state is tracked via the `loading` return value

### Example Implementation

```typescript
interface AppointmentData {
  id: number;
  first_name: string;
  last_name: string;
  date: string;
}

function AppointmentList() {
  const { data: appointments, loading, error } = useRealtimeSubscription<AppointmentData>({
    table: 'appointments',
    event: '*',
    callback: (payload) => {
      // Optional callback for custom handling
      if (payload.eventType === 'INSERT') {
        // Handle new appointment
      }
    }
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <ul>
      {appointments.map(appointment => (
        <li key={appointment.id}>
          {appointment.first_name} {appointment.last_name}
        </li>
      ))}
    </ul>
  );
}
```

### Technical Requirements

- Requires `@supabase/ssr` version `0.5.2` or higher
- Requires `@supabase/supabase-js` version `2.48.1` or higher
- Uses the latest Supabase realtime subscription patterns

## Client-Side Data Fetching

### useSupabaseQuery Hook

A custom hook that uses SWR for efficient data fetching and caching. This hook is the recommended way to fetch data from Supabase in client components.

```typescript
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

// Example usage
const { data, loading, error, mutate } = useSupabaseQuery<YourType>({
  table: 'your_table',
  schema: 'api', // default
  select: '*',
  filter: { status: 'active' },
  orderBy: { column: 'created_at', ascending: false }
});
```

#### Options

- `table` (required): The table name to query
- `schema` (optional): The schema name (defaults to 'api')
- `select` (optional): The columns to select (defaults to '*')
- `filter` (optional): An object of column-value pairs to filter by
- `orderBy` (optional): Sorting configuration { column: string, ascending?: boolean }

#### Returns

- `data`: The query results (typed array)
- `loading`: Boolean indicating if the request is in progress
- `error`: Any error that occurred
- `mutate`: Function to manually revalidate the data

### Data Mutations

For creating, updating, or deleting data, use the `mutateData` function:

```typescript
import { mutateData } from '../hooks/useSupabaseQuery';

// Example: Create
const success = await mutateData({
  table: 'your_table',
  action: 'INSERT',
  data: newData
});

// Example: Update
const success = await mutateData({
  table: 'your_table',
  action: 'UPDATE',
  data: updatedData,
  filter: { id: itemId }
});

// Example: Delete
const success = await mutateData({
  table: 'your_table',
  action: 'DELETE',
  filter: { id: itemId }
});
```

#### Options

- `table` (required): The table name
- `schema` (optional): The schema name (defaults to 'api')
- `action` (required): 'INSERT' | 'UPDATE' | 'DELETE'
- `data` (optional): The data to insert or update
- `filter` (optional): Conditions for update/delete operations

### Best Practices

1. Always use the `api` schema
2. Handle loading and error states appropriately
3. Use TypeScript interfaces for data types
4. Show feedback to users using the Toast component
5. Revalidate data after mutations using the `mutate` function

### Example Components

See the following components for implementation examples:
- `components/admin/appointments/AppointmentList.tsx`
- `components/admin/blog/PostEditor.tsx`

## Database Schema

### API Schema

All tables must be created in the `api` schema for security:

```sql
-- Create api schema
create schema if not exists api;

-- Contents Table
create table api.contents (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  content jsonb not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table api.contents enable row level security;

create policy "Public content is viewable by everyone"
  on api.contents for select
  using ( type = 'public' );

create policy "Protected content is viewable by authenticated users only"
  on api.contents for select
  using ( type = 'protected' and auth.role() = 'authenticated' );

create policy "Content is editable by admins only"
  on api.contents for all
  using ( auth.role() = 'admin' );

-- Posts Table
create table api.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  published boolean default false,
  category text,
  author_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table api.posts enable row level security;

create policy "Published posts are viewable by everyone"
  on api.posts for select
  using ( published = true );

create policy "Posts are editable by admins only"
  on api.posts for all
  using ( auth.role() = 'admin' );

-- Contact Messages Table
create table api.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table api.contact_messages enable row level security;

create policy "Messages are insertable by everyone"
  on api.contact_messages for insert
  with check ( true );

create policy "Messages are viewable by admins only"
  on api.contact_messages for select
  using ( auth.role() = 'admin' );

-- Blog Posts Table
CREATE TABLE blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  author uuid REFERENCES auth.users(id),
  seo jsonb
);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage posts" ON blog_posts
  USING (auth.role() = 'authenticated');

-- Blog Categories Table
CREATE TABLE blog_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON blog_categories FOR SELECT TO PUBLIC;
CREATE POLICY "Authenticated users can manage categories" ON blog_categories
  USING (auth.role() = 'authenticated');

-- Blog Posts Categories Junction Table
CREATE TABLE blog_posts_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- RLS Policies
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage post categories" ON blog_posts_categories
  USING (auth.role() = 'authenticated');
