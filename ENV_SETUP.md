# Environment Variables Setup

To run database migrations, you need to set up environment variables that contain your Supabase credentials.

## Required Environment Variables

Create a `.env` file in the root directory with these variables:

```
# Supabase Configuration
SUPABASE_URL=https://yxwwmjubpkyzwmvilmsw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## How to Get Your Service Role Key

1. Log in to your Supabase dashboard
2. Select your project
3. Go to Project Settings → API
4. Find the "service_role key" under Project API keys
5. **IMPORTANT**: Keep this key secure and never commit it to version control!

## Running Migrations with Environment Variables

### Option 1: Using the .env file
1. Create a `.env` file as described above
2. Run `npm run migrate`

### Option 2: Setting variables directly in the command

```bash
SUPABASE_SERVICE_ROLE_KEY=your_key_here npm run migrate
```

### Option 3: Persistent environment variables

On macOS/Linux:
```bash
export SUPABASE_SERVICE_ROLE_KEY=your_key_here
npm run migrate
```

On Windows (Command Prompt):
```cmd
set SUPABASE_SERVICE_ROLE_KEY=your_key_here
npm run migrate
```

On Windows (PowerShell):
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your_key_here"
npm run migrate
``` 