# Supabase Configuration Instructions

## 1. Update your .env file

Create or update your `.env` file in the project root with the following content:

```
VITE_SUPABASE_URL=https://yxwwmjubpkyzwmvilmsw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjQ4MjYsImV4cCI6MjA2MjE0MDgyNn0.k6A7n8EErBL7750slWm-ftTHjkR3Ofac-mdgHhGcy0E
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k
VITE_SUPABASE_PROJECT_ID=yxwwmjubpkyzwmvilmsw
```

## 2. Restart your development server

After updating the .env file, restart your development server:

```
npm run dev
```

## 3. Your Supabase project details:

- **Project URL**: https://yxwwmjubpkyzwmvilmsw.supabase.co
- **Project ID**: yxwwmjubpkyzwmvilmsw
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjQ4MjYsImV4cCI6MjA2MjE0MDgyNn0.k6A7n8EErBL7750slWm-ftTHjkR3Ofac-mdgHhGcy0E
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k

## 4. PostgreSQL Direct Connection:
- **Connection String**: postgresql://postgres:[YOUR-PASSWORD]@db.yxwwmjubpkyzwmvilmsw.supabase.co:5432/postgres
  (Replace [YOUR-PASSWORD] with your actual database password) 