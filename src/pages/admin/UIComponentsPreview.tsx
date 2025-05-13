// import React from 'react'; // Removed as unused
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { useGlobalSettings } from '../../contexts/GlobalSettingsContext';
// import { useSiteSettings } from '../../contexts/SiteSettingsContext'; // Removed as unused

const UIComponentsPreview = () => {
  const { font_settings, isLoading } = useGlobalSettings();

  // Sample page-level settings
  const pageSettings = {
    textColor: 'var(--color-background)',
    bgColor: 'var(--color-primary)', // Blue
    hoverColor: '#1D4ED8',
    borderRadius: '0.5rem'
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">UI Components Preview</h1>
          <p>Loading global settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">UI Components Preview</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Global Settings Hierarchy Demo</h2>
          <p className="text-sm text-text mb-6">
            This page demonstrates how the settings hierarchy works: Component-specific settings override page settings, which override global settings.
          </p>

          <div className="space-y-8">
            {/* Global Settings Section */}
            <section>
              <h3 className="text-lg font-medium mb-4">1. Global Settings (from Settings Page)</h3>
              <p className="text-sm text-text mb-4">These buttons use only the global settings defined in the Settings page.</p>
              
              <div className="flex flex-wrap gap-4 mb-2">
                <Button variant="primary">
                  Primary Button
                </Button>
                <Button variant="secondary">
                  Secondary Button
                </Button>
              </div>
              
              <div className="bg-background p-4 rounded-md mt-2">
                <p className="text-xs font-mono">
                  {`<Button variant="primary">Primary Button</Button>`}<br />
                  {`<Button variant="secondary">Secondary Button</Button>`}
                </p>
              </div>
            </section>

            {/* Page Settings Section */}
            <section>
              <h3 className="text-lg font-medium mb-4">2. Page Settings Override Global</h3>
              <p className="text-sm text-text mb-4">
                These buttons use page-level settings that override the global settings.
                Current page settings: Blue background, white text, rounded corners.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-2">
                <Button variant="primary" pageSettings={pageSettings}>
                  Primary with Page Settings
                </Button>
                <Button variant="secondary" pageSettings={pageSettings}>
                  Secondary with Page Settings
                </Button>
              </div>
              
              <div className="bg-background p-4 rounded-md mt-2">
                <p className="text-xs font-mono">
                  {`// Page settings object`}<br />
                  {`const pageSettings = {`}<br />
                  {`  textColor: 'var(--color-background)',`}<br />
                  {`  bgColor: 'var(--color-primary)',`}<br />
                  {`  hoverColor: '#1D4ED8',`}<br />
                  {`  borderRadius: '0.5rem'`}<br />
                  {`};`}<br /><br />
                  {`<Button variant="primary" pageSettings={pageSettings}>Primary with Page Settings</Button>`}<br />
                  {`<Button variant="secondary" pageSettings={pageSettings}>Secondary with Page Settings</Button>`}
                </p>
              </div>
            </section>
            
            {/* Component Settings Section */}
            <section>
              <h3 className="text-lg font-medium mb-4">3. Component Settings Override All</h3>
              <p className="text-sm text-text mb-4">
                These buttons have component-specific settings that override both page and global settings.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-2">
                <Button 
                  variant="primary" 
                  pageSettings={pageSettings}
                  textColor="var(--color-background)"
                  bgColor="#16A34A" // Green
                  hoverColor="#15803D"
                  borderRadius="9999px" // Pill
                >
                  Component Override
                </Button>
                
                <Button 
                  variant="secondary" 
                  pageSettings={pageSettings}
                  buttonStyle="gradient"
                  gradientFromColor="#7E22CE" // Purple
                  gradientToColor="var(--color-secondary)" // Pink
                  borderRadius="9999px" // Pill
                >
                  Gradient Override
                </Button>
              </div>
              
              <div className="bg-background p-4 rounded-md mt-2">
                <p className="text-xs font-mono">
                  {`<Button `}<br />
                  {`  variant="primary"`}<br />
                  {`  pageSettings={pageSettings}`}<br />
                  {`  textColor="var(--color-background)"`}<br />
                  {`  bgColor="#16A34A"`}<br />
                  {`  hoverColor="#15803D"`}<br />
                  {`  borderRadius="9999px"`}<br />
                  {`>Component Override</Button>`}<br /><br />
                  {`<Button `}<br />
                  {`  variant="secondary"`}<br />
                  {`  pageSettings={pageSettings}`}<br />
                  {`  buttonStyle="gradient"`}<br />
                  {`  gradientFromColor="#7E22CE"`}<br />
                  {`  gradientToColor="var(--color-secondary)"`}<br />
                  {`  borderRadius="9999px"`}<br />
                  {`>Gradient Override</Button>`}
                </p>
              </div>
            </section>

            {/* Button Styles Section */}
            <section>
              <h3 className="text-lg font-medium mb-4">4. Different Button Styles</h3>
              <p className="text-sm text-text mb-4">
                Examples of the different button styles available: solid, outline, ghost, and gradient.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-2">
                <Button 
                  variant="primary" 
                  buttonStyle="solid"
                >
                  Solid Style
                </Button>
                
                <Button 
                  variant="primary"
                  buttonStyle="outline"
                >
                  Outline Style
                </Button>
                
                <Button 
                  variant="primary"
                  buttonStyle="ghost"
                >
                  Ghost Style
                </Button>
                
                <Button 
                  variant="primary"
                  buttonStyle="gradient"
                >
                  Gradient Style
                </Button>
              </div>
              
              <div className="bg-background p-4 rounded-md mt-2">
                <p className="text-xs font-mono">
                  {`<Button variant="primary" buttonStyle="solid">Solid Style</Button>`}<br />
                  {`<Button variant="primary" buttonStyle="outline">Outline Style</Button>`}<br />
                  {`<Button variant="primary" buttonStyle="ghost">Ghost Style</Button>`}<br />
                  {`<Button variant="primary" buttonStyle="gradient">Gradient Style</Button>`}
                </p>
              </div>
            </section>
            
            {/* Font Settings Demo */}
            <section>
              <h3 className="text-lg font-medium mb-4">5. Font Settings</h3>
              <p className="text-sm text-text mb-4">
                Demonstration of the different font settings applied globally.
              </p>
              
              <div className="space-y-4 mb-2">
                <div>
                  <h4 className="text-sm font-medium mb-1">Primary Font ({font_settings?.primary_font})</h4>
                  <div className="p-3 bg-background border rounded" style={{ fontFamily: font_settings?.primary_font }}>
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Secondary Font ({font_settings?.secondary_font})</h4>
                  <div className="p-3 bg-background border rounded" style={{ fontFamily: font_settings?.secondary_font }}>
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Body Font ({font_settings?.body_font})</h4>
                  <div className="p-3 bg-background border rounded" style={{ fontFamily: font_settings?.body_font }}>
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Heading Font ({font_settings?.heading_font})</h4>
                  <div className="p-3 bg-background border rounded" style={{ fontFamily: font_settings?.heading_font }}>
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UIComponentsPreview; 