// How to use this in your browser console:
// 1. Open your browser dev tools (F12 or Ctrl+Shift+I or Cmd+Option+I)
// 2. Go to the Console tab
// 3. Paste this entire script and run it
// 4. Navigate to http://localhost:5174/admin/methodology-config
// 5. Watch the console for diagnostic information

// Override console.error to make it more visible
const originalConsoleError = console.error;
console.error = function() {
  originalConsoleError.apply(console, [
    '%c ERROR ',
    'background: #f44336; color: white; padding: 2px 4px; border-radius: 2px;',
    ...arguments
  ]);
};

// Create a global error handler
window.addEventListener('error', function(event) {
  console.error('GLOBAL ERROR CAUGHT:', event.error);
  console.error('Error details:', {
    message: event.error?.message,
    stack: event.error?.stack,
    source: event.filename,
    line: event.lineno,
    column: event.colno
  });
});

// Create a global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

// Debug React component rendering
if (window.React && window.ReactDOM) {
  console.log('React is available globally, enabling component debugging');
} else {
  console.warn('React is not available globally, some debugging features will not work');
}

// Log navigation events
const originalPushState = window.history.pushState;
window.history.pushState = function() {
  console.log('Navigation to:', arguments[2]);
  return originalPushState.apply(window.history, arguments);
};

// Function to test API connectivity
async function testMethodologyAPI() {
  try {
    const response = await fetch('https://yxwwmjubpkyzwmvilmsw.supabase.co/rest/v1/methodology?select=id', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjQ4MjYsImV4cCI6MjA2MjE0MDgyNn0.k6A7n8EErBL7750slWm-ftTHjkR3Ofac-mdgHhGcy0E'
      }
    });
    const data = await response.json();
    console.log('API test result:', data);
    return data;
  } catch (err) {
    console.error('API test failed:', err);
    return null;
  }
}

// Inject a button to test API connectivity
function injectDebugButton() {
  const button = document.createElement('button');
  button.textContent = 'Test Methodology API';
  button.style.position = 'fixed';
  button.style.bottom = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#333';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', async () => {
    const result = await testMethodologyAPI();
    if (result && result.length > 0) {
      button.textContent = `API OK (${result.length} items)`;
      button.style.backgroundColor = '#4caf50';
    } else {
      button.textContent = 'API Failed';
      button.style.backgroundColor = '#f44336';
    }
    
    setTimeout(() => {
      button.textContent = 'Test Methodology API';
      button.style.backgroundColor = '#333';
    }, 3000);
  });
  
  document.body.appendChild(button);
}

// Run diagnostic functions
setTimeout(() => {
  console.log('Running diagnostic checks...');
  testMethodologyAPI();
  injectDebugButton();
}, 1000);

console.log('Methodology debugging enabled! Navigate to /admin/methodology-config to test the page.'); 