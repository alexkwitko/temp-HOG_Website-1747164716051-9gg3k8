#!/bin/bash

# Create backup directory with timestamp
BACKUP_DIR="cleanup-unused-files/backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to backup a file
backup_file() {
  local file="$1"
  local dir=$(dirname "$file")
  
  # Create the same directory structure in backup
  mkdir -p "$BACKUP_DIR/$dir"
  
  # Copy the file to backup
  cp "$file" "$BACKUP_DIR/$dir/"
  
  echo "Backed up: $file"
}

# Files that seem to be unused based on imports
POTENTIALLY_UNUSED_FILES=(
  "src/components/admin/FeaturedProductsConfig.tsx"
  "src/components/admin/CTAConfig.tsx"
  "src/components/WhyChooseSection.tsx"
  "src/components/FeaturedPrograms.tsx"
  "src/components/common/ButtonComponents.tsx"
  "src/components/LocationSection.tsx"
  "src/components/AuthDebug.tsx"
  "src/components/ShopSection.tsx"
  "src/data/classes.ts"
  "src/data/schedule.ts"
  "src/data/instructors.ts"
  "src/data/products.ts"
  "src/pages/AuthTestPage.tsx"
  "src/pages/RegisterPage.tsx"
  "src/pages/LoginPage.tsx"
  "src/pages/admin/SpecialSchedulePage.tsx"
  "src/pages/admin/BlogManagementPage.tsx"
  "src/pages/admin/InsertHeroSlides.tsx"
  "src/pages/DebugPage.tsx"
)

echo "Starting backup of potentially unused files..."

for file in "${POTENTIALLY_UNUSED_FILES[@]}"; do
  if [ -f "$file" ]; then
    backup_file "$file"
    echo "Moving $file to $BACKUP_DIR"
    mv "$file" "$BACKUP_DIR/$(dirname "$file")/"
  else
    echo "File not found: $file"
  fi
done

echo "Backup complete. Files moved to $BACKUP_DIR"
echo "If your app still works correctly, you can delete the backup directory."
echo "If not, you can restore files from the backup." 