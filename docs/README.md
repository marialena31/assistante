# Assistant Portfolio Project

## Important: Read First!

Before making any modifications to this project:
1. **READ the documentation** in this directory
2. If information is missing, consult the official documentation
3. Update documentation after making changes

## Project Structure

- `docs/` - Project documentation
  - `README.md` - Main project documentation (this file)
  - `DEVELOPMENT.md` - Development guidelines
  - `API.md` - API and database documentation
  - `SETUP.md` - Setup and configuration guide
  - `swagger.yaml` - Swagger/OpenAPI specification

## Key Requirements

1. **Database**
   - All content managed through Supabase database
   - Use ONLY the `api` schema (NOT public)
   - Content updates through admin interface only

2. **Authentication**
   - Latest `@supabase/ssr` package required
   - Cookie-based auth (NOT token-based)
   - Only `@marialena-pietri.fr` emails allowed
   - Secure paths:
     ```
     Login: /auth-mlp2024/signin
     Register: /auth-mlp2024/register
     Reset Password: /auth-mlp2024/reset
     Auth Callback: /auth-mlp2024/callback
     Admin Dashboard: /secure-dashboard-mlp2024
     ```

3. **User Interface**
   - Toast component for messages
   - DO NOT modify next.config.js CSS config

4. **Documentation**
   - Keep docs up to date
   - Update swagger.yaml for API changes
   - Follow development guidelines

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Setup and Installation](#setup-and-installation)
6. [Development Guidelines](#development-guidelines)
7. [Authentication](#authentication)
8. [Database Schema](#database-schema)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)
11. [Best Practices](#best-practices)
12. [Security and Authentication](#security-and-authentication)
13. [Content Management](#content-management)
14. [Admin Interface](#admin-interface)
15. [Development Workflow](#development-workflow)

## Project Overview

The Assistant Portfolio is a professional portfolio website showcasing services, experiences, and skills. It features a modern, responsive design with server-side rendering and dynamic content management through Supabase.

### Key Features

- Dynamic content management via Supabase
- Secure admin dashboard
- Responsive design
- SEO optimization
- Server-side rendering
- Modern animations and transitions
- Contact form integration
- Blog/News section
- Multi-language support (planned)

## Architecture

The project follows a modern web architecture:

```
Client (Next.js) <-> Server (Next.js API Routes) <-> Supabase (Database/Auth)
```

### Key Components

- **Frontend**: Next.js with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Context + Supabase Realtime
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## Technology Stack

- **Frontend**:
  - Next.js 14+
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Icons

- **Backend**:
  - Supabase
  - PostgreSQL
  - Node.js

- **Development Tools**:
  - ESLint
  - Prettier
  - Husky
  - Jest
  - Cypress

## Project Structure

```
/
├── components/          # Reusable React components
│   ├── animations/     # Animation components
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── auth-mlp2024/  # Auth pages
│   └── secure-dashboard-mlp2024/ # Admin dashboard
├── public/             # Static assets
├── styles/            # Global styles
├── types/             # TypeScript types
├── utils/             # Utility functions
│   └── supabase/     # Supabase utilities
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── lib/               # Library code
└── docs/              # Documentation

```

## Security and Authentication

### Secure Routes
All authentication and admin routes use secure paths:
- Login: `/auth-mlp2024/signin`
- Register: `/auth-mlp2024/register`
- Reset Password: `/auth-mlp2024/reset`
- Auth Callback: `/auth-mlp2024/callback`
- Admin Dashboard: `/secure-dashboard-mlp2024`

### Database Access
- Only the `api` schema is exposed for security reasons
- All content must be managed through the admin interface
- Supabase Auth handles all authentication
- Row Level Security (RLS) policies control access

### Best Practices
1. Never expose schemas other than `api`
2. Always use the admin interface for content updates
3. Implement proper RLS policies for each table
4. Use the latest Supabase Auth system
5. Keep secure paths confidential
6. Never modify Next.js CSS configuration

## Content Management

### Database Structure
All content is managed through Supabase:
```sql
-- api schema
create schema if not exists api;

-- Contents table in api schema
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

-- Public read access
create policy "Public content is viewable by everyone"
  on api.contents for select
  using ( type = 'public' );

-- Admin write access
create policy "Content is editable by admins only"
  on api.contents for all
  using ( auth.role() = 'admin' );
```

### Content Types
1. **Pages**
   - About
   - Services
   - Blog
   - Contact

2. **Components**
   - Header
   - Footer
   - Navigation

3. **Dynamic Sections**
   - Skills
   - Experiences
   - Testimonials

## Admin Interface

The admin interface is accessible only through `/secure-dashboard-mlp2024` and requires authentication. Features include:

1. **Content Management**
   - Create/Edit pages
   - Manage dynamic sections
   - Update components

2. **User Management**
   - Admin user creation
   - Role assignment
   - Access control

3. **Media Management**
   - Upload images
   - Organize media library
   - Optimize assets

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Database Updates**
   - All schema changes must be made through migrations
   - Only modify the `api` schema
   - Test RLS policies thoroughly

3. **Authentication Flow**
   - Use Supabase Auth hooks
   - Implement proper redirects
   - Handle auth state changes

4. **Content Updates**
   - Use admin interface exclusively
   - Validate content before saving
   - Implement proper error handling

## Authentication

- Uses Supabase Auth with @supabase/ssr for server-side rendering
- Admin access restricted to @marialena-pietri.fr email addresses
- Secure routes with middleware protection
- Session management with proper cookie handling

### Secure Routes

```typescript
LOGIN: '/auth-mlp2024/signin'
REGISTER: '/auth-mlp2024/register'
RESET_PASSWORD: '/auth-mlp2024/reset'
AUTH_CALLBACK: '/auth-mlp2024/callback'
ADMIN: '/secure-dashboard-mlp2024'
```

## Documentation

- [Development Guide](./DEVELOPMENT.md)
- [API Documentation](./API.md)
- [Setup Guide](./SETUP.md)
- [API Schema](./swagger.yaml)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Content Management

All content is managed through the admin interface:
1. Login at `/auth-mlp2024/signin` with an authorized email
2. Access admin dashboard at `/secure-dashboard-mlp2024`
3. Update content through the provided interface

## Security Notes

- All admin routes are protected by middleware
- Only @marialena-pietri.fr emails can access admin interface
- API schema is the only exposed interface for security
- Session management uses secure cookies
- Authentication uses the latest Supabase SSR implementation

## Important Notes

- Do not modify `next.config.js` CSS configuration
- Always update documentation when making changes
- Check and update swagger.yaml for API changes
- Use the new @supabase/ssr package for authentication
