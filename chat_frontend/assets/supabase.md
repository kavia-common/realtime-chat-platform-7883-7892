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

## Setup Instructions

1. Create a new Supabase project at https://app.supabase.com
2. Once created, get your project credentials:
   - Project URL from: Settings -> API -> Project URL
   - Anon/Public key from: Settings -> API -> anon/public key

3. Configure environment variables:
   Create a `.env` file in the root directory with:
   ```
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_KEY=your_anon_key
   ```

4. Configure Auth Settings in Supabase Dashboard:
   - Go to Authentication -> URL Configuration
   - Set Site URL to your production domain (e.g., https://yourdomain.com)
   - Add redirect URLs:
     * http://localhost:3000/** (for development)
     * https://yourdomain.com/** (for production)

5. Database Setup:
   - Execute the SQL commands in the Database Schema section
   - Enable Row Level Security (RLS)
   - Apply the provided RLS policies

6. Real-time Configuration:
   - Enable real-time for the messages table in Database -> Replication
   - Configure presence channels if not automatically enabled

## Client Setup
The Supabase client is initialized in `src/supabaseClient.js` with:
- Session persistence
- Auto token refresh
- URL detection for auth callbacks

## Troubleshooting

Common issues:
1. **Connection Errors**: Verify your environment variables are correctly set
2. **Auth Errors**: Check URL configuration in Supabase dashboard
3. **Real-time Not Working**: Ensure table is enabled for real-time in Supabase dashboard
4. **RLS Errors**: Verify policies are correctly set and user is authenticated

## Security Notes

1. Never commit your .env file or expose your Supabase keys
2. Always use RLS policies to protect your data
3. Use environment-specific keys for development and production
4. Regularly rotate keys if compromised
