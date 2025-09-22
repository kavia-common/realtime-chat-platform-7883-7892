# Supabase Integration Documentation

## Overview
This document outlines the Supabase integration for the Ocean Chat application.

## Database Schema

### Messages Table
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

-- Allow authenticated users to read all messages
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

## Client Setup
The Supabase client is initialized in `src/supabaseClient.js` with:
- Session persistence
- Auto token refresh
- URL detection for auth callbacks
