# Supabase Integration Documentation

## Overview
This document outlines the Supabase integration for the Ocean Chat application.

## Database Schema

### Users Table
```sql
create table public.users (
  id uuid references auth.users(id) primary key,
  display_name text,
  avatar_url text,
  online_status boolean default false,
  last_seen timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Allow users to read all profiles
create policy "Allow users to read all profiles" 
on public.users for select 
to authenticated 
using (true);

-- Allow users to update own profile
create policy "Users can update own profile" 
on public.users for update 
to authenticated 
using (auth.uid() = id) 
with check (auth.uid() = id);

-- Allow inserting profile only for themselves
create policy "Users can insert own profile" 
on public.users for insert 
to authenticated 
with check (auth.uid() = id);
```

### Messages Table (Existing)
```sql
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  user_id uuid references auth.users(id) not null,
  user_email text
);

-- Enable RLS
alter table public.messages enable row level security;

-- Allow authenticated users to read messages
create policy "Allow authenticated users to read messages"
  on messages for select
  to authenticated
  using (true);

-- Allow users to insert their own messages
create policy "Allow users to insert their own messages"
  on messages for insert
  to authenticated
  with check (auth.uid() = user_id);
```

## Authentication
- Using Supabase Auth with email/password
- Session persistence enabled
- Auto token refresh enabled
- Email verification optional (configurable in Supabase dashboard)

## Real-time Features
The application uses the following Supabase real-time channels:

1. Messages Channel
   - Table: `messages`
   - Events: `INSERT`
   - Used for live message updates

2. Presence Channel
   - Channel: `presence:lobby`
   - Tracks online users
   - Payload includes user ID and email

## Environment Variables
Required environment variables:
- `REACT_APP_SUPABASE_URL`: Supabase project URL
- `REACT_APP_SUPABASE_KEY`: Supabase public anon key
- `REACT_APP_SITE_URL`: Application URL (for auth redirects)

## Setup Instructions

1. Create a new Supabase project at https://app.supabase.com

2. Get your project credentials:
   - Project URL from: Settings -> API -> Project URL
   - Anon/Public key from: Settings -> API -> anon/public key

3. Configure environment variables:
   Create a `.env` file in the root directory with:
   ```
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_KEY=your_anon_key
   REACT_APP_SITE_URL=http://localhost:3000
   ```

4. Configure Auth Settings in Supabase Dashboard:
   - Go to Authentication -> URL Configuration
   - Set Site URL to your production domain
   - Add redirect URLs:
     * http://localhost:3000/** (for development)
     * https://yourdomain.com/** (for production)

5. Database Setup:
   - Execute the SQL commands in the Database Schema section using the Supabase SQL editor
   - Enable Row Level Security (RLS) for all tables
   - Apply the provided RLS policies
   - Enable real-time for the messages and users tables

6. Real-time Configuration:
   - Enable real-time for both tables in Database -> Replication
   - Configure presence channels if not automatically enabled

## Utility Functions

### User Profile Management
```sql
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Troubleshooting

Common issues:
1. **Connection Errors**: Verify environment variables are correctly set
2. **Auth Errors**: Check URL configuration in Supabase dashboard
3. **Real-time Not Working**: Ensure tables are enabled for real-time
4. **RLS Errors**: Verify policies are correctly set and user is authenticated

## Security Notes

1. Never commit .env file or expose Supabase keys
2. Always use RLS policies to protect data
3. Use environment-specific keys for development and production
4. Regularly rotate keys if compromised
5. Ensure all tables have RLS enabled and appropriate policies

## Client Implementation Notes

The Supabase client is configured with:
- Session persistence
- Auto token refresh
- Dynamic URL detection for auth callbacks
- Real-time subscriptions for messages and presence
