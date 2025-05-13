#!/bin/bash
# Clone remote database to local

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting database clone operation...${NC}"

# Step 1: Create a dump of the remote database structure and data
echo -e "${YELLOW}Step 1: Creating dump of remote database...${NC}"
PGPASSWORD=postgres pg_dump --clean --if-exists --no-owner --no-privileges --schema=public \
  --host=db.yxwwmjubpkyzwmvilmsw.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --file=remote_dump.sql

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to create remote database dump.${NC}"
  echo -e "${YELLOW}Trying alternative approach with Supabase...${NC}"
  
  # Try using Supabase CLI to get database dump
  npx supabase db dump -f remote_dump.sql
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Both approaches failed to dump remote database.${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}Remote database dump created successfully.${NC}"

# Step 2: Reset local database
echo -e "${YELLOW}Step 2: Resetting local database...${NC}"
npx supabase db reset

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to reset local database.${NC}"
  exit 1
fi

echo -e "${GREEN}Local database reset successfully.${NC}"

# Step 3: Apply the dump to local database
echo -e "${YELLOW}Step 3: Applying remote dump to local database...${NC}"
PGPASSWORD=postgres psql \
  --host=localhost \
  --port=54322 \
  --username=postgres \
  --dbname=postgres \
  --file=remote_dump.sql

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to apply dump to local database.${NC}"
  exit 1
fi

echo -e "${GREEN}Remote dump applied to local database successfully.${NC}"

# Step 4: Apply additional backup/restore SQL
echo -e "${YELLOW}Step 4: Applying backup SQL scripts...${NC}"
PGPASSWORD=postgres psql \
  --host=localhost \
  --port=54322 \
  --username=postgres \
  --dbname=postgres \
  --command="SELECT current_database(), current_user;"

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to connect to local database.${NC}"
  exit 1
fi

echo -e "${GREEN}Database clone operation completed successfully!${NC}"
echo -e "${YELLOW}Starting the development server...${NC}"

# Restart development server
npm run dev 