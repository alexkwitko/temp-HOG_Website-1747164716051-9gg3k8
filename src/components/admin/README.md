# Admin System Organization

## Homepage Configuration System

The admin system for the homepage is split into two distinct areas of responsibility:

### 1. Homepage Container Configuration (`src/components/admin/home/HomePageConfig.tsx`)

This component controls the **global layout** of the homepage:

- **Component Order**: Drag and drop components to change their display order
- **Component Visibility**: Toggle components on/off 
- **Container Styling**: Configure container-level styles like:
  - Background color
  - Text color
  - Border properties
  - Padding
  - etc.

Any changes made here affect the container that wraps each section, but not the specific content inside.

### 2. Component-Specific Content Configuration

Each homepage section has its own dedicated configuration page that controls:

- **Content**: Text, images, and other content specific to that component
- **Feature Selection**: Which items to display in that section
- **Content-Specific Settings**: Settings that only apply to that component

Examples:
- `FeaturedProgramsConfig`: Controls which programs appear in the Featured Programs section
- `MethodologyConfig`: Controls the specific methodology items displayed

## Best Practices

1. **Container vs. Content**: Keep a clear separation between:
   - Container styling (in HomePageConfig)
   - Content configuration (in component-specific pages)

2. **Consistent Colors**: Use consistent colors for similar elements across components

3. **Responsive Design**: All components should look good on all screen sizes

## Troubleshooting

If you notice styling conflicts:
1. Check whether the style is coming from the container configuration or the content configuration
2. Determine which level should control that particular style property
3. Remove the conflicting style from the inappropriate location 