# API Documentation

## Database Schema

All tables are in the `api` schema for security.

### Blog Posts

Table: `blog_posts`

```sql
CREATE TABLE api.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  status text NOT NULL DEFAULT 'draft',
  author uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  seo jsonb
);

-- RLS Policies
ALTER TABLE api.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow read access to published posts for all users
CREATE POLICY "Published posts are viewable by everyone" 
ON api.blog_posts FOR SELECT 
USING (status = 'published');

-- Allow full access to authenticated users with @marialena-pietri.fr email
CREATE POLICY "Full access for admin users" 
ON api.blog_posts 
FOR ALL 
USING (auth.jwt()->>'email' LIKE '%@marialena-pietri.fr')
WITH CHECK (auth.jwt()->>'email' LIKE '%@marialena-pietri.fr');
```

## API Routes

### Blog Management

All blog management routes are protected and require authentication with a valid @marialena-pietri.fr email.

#### List Posts
- Path: `${SECURE_ROUTES.ADMIN_BLOG}`
- Method: GET
- Response: Array of blog posts

#### Create Post
- Path: `${SECURE_ROUTES.ADMIN_BLOG}/new`
- Method: POST
- Body:
  ```typescript
  {
    title: string;
    content: string;
    slug: string;
    status: 'draft' | 'published';
  }
  ```

#### Edit Post
- Path: `${SECURE_ROUTES.ADMIN_BLOG}/[id]/edit`
- Method: PUT
- Parameters: `id` (post ID)
- Body:
  ```typescript
  {
    title?: string;
    content?: string;
    slug?: string;
    status?: 'draft' | 'published';
  }
  ```

#### Delete Post
- Path: `${SECURE_ROUTES.ADMIN_BLOG}/[id]`
- Method: DELETE
- Parameters: `id` (post ID)

## Newsletter Subscriptions

### Table Structure

```sql
CREATE TABLE api.newsletter_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  source VARCHAR(10) NOT NULL CHECK (source IN ('modal', 'footer')),
  has_promo BOOLEAN NOT NULL DEFAULT false,
  promo_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_newsletter_email ON api.newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_source ON api.newsletter_subscriptions(source);
```

### Fields Description

- `id`: Unique identifier for the subscription
- `email`: Subscriber's email address (unique)
- `is_active`: Whether the subscription is active
- `source`: Where the subscription came from ('modal' or 'footer')
- `has_promo`: Whether the subscription is eligible for a promo code
- `promo_code`: Unique promo code for modal subscriptions
- `created_at`: Timestamp of subscription

### API Endpoints

#### Subscribe to Newsletter

```http
POST /api/newsletter/subscribe
```

Request body:
```json
{
  "email": "string",
  "source": "modal" | "footer",
  "has_promo": boolean
}
```

Response (success):
```json
{
  "success": true,
  "message": "Successfully subscribed",
  "promo_code": "string" // Only present for modal subscriptions
}
```

Response (error):
```json
{
  "success": false,
  "message": "Error message"
}
```

### Promo Code Generation

Promo codes are automatically generated for subscriptions from the modal popup. The format is:
```
PROMO10-XXXXYYYY
```
Where:
- XXXX: Timestamp-based unique identifier
- YYYY: Email-based unique identifier

Each promo code is unique and can only be used once.

## Data Mutation

The application uses a centralized `mutateData` function for all database operations. This function is located in `hooks/useSupabaseQuery.ts` and handles all INSERT, UPDATE, and DELETE operations.

#### Function Signature
```typescript
mutateData(
  options: MutateOptions,
  showToast: (message: string, type: 'success' | 'error') => void,
  mutate: () => void
): Promise<boolean>
```

#### Parameters
- `options`: Configuration object for the mutation
  - `table` (required): Name of the table to operate on
  - `schema` (optional): The schema name (defaults to 'api')
  - `action` (required): 'INSERT' | 'UPDATE' | 'DELETE'
  - `data` (optional): The data to insert or update
  - `filter` (optional): Conditions for update/delete operations
- `showToast`: Function to display success/error messages
- `mutate`: Function to refresh data after successful operation

#### Toast Adapter Pattern
Since the application's Toast component uses a different signature (`showToast(title, message, type)`), you need to use an adapter when calling `mutateData`:

```typescript
// Create adapter in your component
const toastAdapter = (message: string, type: 'success' | 'error') => {
  showToast(type === 'success' ? 'Succès' : 'Erreur', message, type);
};

// Use adapter with mutateData
const success = await mutateData(options, toastAdapter, mutate);
```

#### Example Usage
```typescript
const { data, mutate } = useSupabaseQuery<YourType>({
  table: 'your_table',
  orderBy: { column: 'created_at', ascending: true }
});

const handleUpdate = async (id: string, newData: any) => {
  const success = await mutateData({
    table: 'your_table',
    action: 'UPDATE',
    data: newData,
    filter: { id }
  }, toastAdapter, mutate);
};
```

### Best Practices
1. Always use the `api` schema
2. Handle loading and error states appropriately
3. Use TypeScript interfaces for data types
4. Show feedback to users using the Toast component
5. Revalidate data after mutations using the `mutate` function

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

- `table` (required): Name of the table to operate on
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
CREATE TABLE api.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  status text NOT NULL DEFAULT 'draft',
  author uuid REFERENCES auth.users(id),
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  seo jsonb
);

-- RLS Policies
ALTER TABLE api.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON api.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage posts" ON api.blog_posts
  USING (auth.role() = 'authenticated');

-- Blog Categories Table
CREATE TABLE api.blog_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE api.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON api.blog_categories FOR SELECT TO PUBLIC;
CREATE POLICY "Authenticated users can manage categories" ON api.blog_categories
  USING (auth.role() = 'authenticated');

-- Blog Posts Categories Junction Table
CREATE TABLE api.blog_posts_categories (
  post_id uuid REFERENCES api.blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES api.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- RLS Policies
ALTER TABLE api.blog_posts_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage post categories" ON api.blog_posts_categories
  USING (auth.role() = 'authenticated');

## API Documentation

### Database Schema

All tables are in the `api` schema for security reasons.

### Blog Posts

Table: `blog_posts`

```sql
CREATE TABLE api.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  status text NOT NULL DEFAULT 'draft',
  author uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  seo jsonb
);

-- RLS Policies
ALTER TABLE api.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON api.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage posts" ON api.blog_posts
  USING (auth.role() = 'authenticated');
```

## API Routes

### Blog Management

All blog management routes are protected and require authentication with a valid @marialena-pietri.fr email.

#### List Posts
- Path: `${SECURE_ROUTES.ADMIN_BLOG}`
- Method: GET
- Response: Array of blog posts

#### Create Post
- Path: `${SECURE_ROUTES.ADMIN_BLOG}/new`
- Method: POST
- Body:
  ```typescript
  {
    title: string;
    content: string;
    slug: string;
    status: 'draft' | 'published';
  }
  ```

#### Edit Post
- Path: `${SECURE_ROUTES.ADMIN_BLOG}/[id]/edit`
- Method: PUT
- Parameters: `id` (post ID)
- Body:
  ```typescript
  {
    title?: string;
    content?: string;
    slug?: string;
    status?: 'draft' | 'published';
  }
  ```

#### Delete Post
- Path: `${SECURE_ROUTES.ADMIN_BLOG}/[id]`
- Method: DELETE
- Parameters: `id` (post ID)

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

## Appointments API

### Database Schema

1. **appointment_settings**
   ```sql
   CREATE TABLE api.appointment_settings (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       title TEXT NOT NULL,
       description TEXT,
       photo_url TEXT,
       google_calendar_sync_url TEXT,
       email_reminder_enabled BOOLEAN DEFAULT false,
       sms_reminder_enabled BOOLEAN DEFAULT false,
       email_reminder_template TEXT,
       sms_reminder_template TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **appointment_durations**
   ```sql
   CREATE TABLE api.appointment_durations (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       duration_minutes INTEGER NOT NULL,
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **appointment_purposes**
   ```sql
   CREATE TABLE api.appointment_purposes (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       title TEXT NOT NULL,
       description TEXT,
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

4. **availability_slots**
   ```sql
   CREATE TABLE api.availability_slots (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
       start_time TIME NOT NULL,
       end_time TIME NOT NULL,
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

5. **appointments**
   ```sql
   CREATE TABLE api.appointments (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       first_name TEXT NOT NULL,
       last_name TEXT NOT NULL,
       company_name TEXT NOT NULL,
       email TEXT NOT NULL,
       phone TEXT,
       address TEXT,
       purpose_id TEXT NOT NULL,
       message TEXT,
       appointment_type TEXT NOT NULL CHECK (appointment_type IN ('phone', 'video', 'in_person')),
       appointment_date TIMESTAMPTZ NOT NULL,
       duration_minutes INTEGER NOT NULL,
       reminders_enabled BOOLEAN DEFAULT true,
       status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'modified')),
       google_calendar_event_id TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

### Endpoints

#### Get Appointments
```yaml
GET /api/appointments
Security:
  - bearerAuth: []
Response:
  200:
    description: List of appointments
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/Appointment'
```

#### Create Appointment
```yaml
POST /api/appointments
Security:
  - bearerAuth: []
RequestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/AppointmentFormData'
Response:
  201:
    description: Appointment created
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Appointment'
```

#### Update Appointment Status
```yaml
PATCH /api/appointments/{id}/status
Security:
  - bearerAuth: []
RequestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          status:
            type: string
            enum: [confirmed, cancelled, modified]
Response:
  200:
    description: Appointment status updated
```

#### Get Available Time Slots
```yaml
GET /api/appointments/available-slots
Parameters:
  - name: date
    in: query
    required: true
    schema:
      type: string
      format: date
Response:
  200:
    description: List of available time slots
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/TimeSlot'
```

### Components

#### Schemas

```yaml
components:
  schemas:
    AppointmentSettings:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        photo_url:
          type: string
        google_calendar_sync_url:
          type: string
        email_reminder_enabled:
          type: boolean
        sms_reminder_enabled:
          type: boolean
        email_reminder_template:
          type: string
        sms_reminder_template:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    AppointmentDuration:
      type: object
      properties:
        id:
          type: string
          format: uuid
        duration_minutes:
          type: integer
        is_active:
          type: boolean
        created_at:
          type: string
          format: date-time

    AppointmentPurpose:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        is_active:
          type: boolean
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    AvailabilitySlot:
      type: object
      properties:
        id:
          type: string
          format: uuid
        day_of_week:
          type: integer
          minimum: 0
          maximum: 6
        start_time:
          type: string
          format: time
        end_time:
          type: string
          format: time
        is_active:
          type: boolean
        created_at:
          type: string
          format: date-time

    Appointment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        first_name:
          type: string
        last_name:
          type: string
        company_name:
          type: string
        email:
          type: string
        phone:
          type: string
        address:
          type: string
        purpose_id:
          type: string
        message:
          type: string
        appointment_type:
          type: string
          enum: [phone, video, in_person]
        appointment_date:
          type: string
          format: date-time
        duration_minutes:
          type: integer
        reminders_enabled:
          type: boolean
        status:
          type: string
          enum: [confirmed, cancelled, modified]
        google_calendar_event_id:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    TimeSlot:
      type: object
      properties:
        start:
          type: string
          format: time
        end:
          type: string
          format: time
        available:
          type: boolean
