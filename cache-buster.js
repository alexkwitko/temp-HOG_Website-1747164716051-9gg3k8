// Generate a unique timestamp-based cache buster
const timestamp = new Date().getTime();
console.log(`Add this query parameter to any URL to bust cache: ?cache_bust=${timestamp}`);
console.log(`Example: https://yourapp.com/admin/methodology-config?cache_bust=${timestamp}`);
console.log(`\nOr you can try the following in your browser console to force a complete page reload:`);
console.log(`location.reload(true);`);
console.log(`\nIf you're still having issues, try clearing your browser cache and localStorage:`);
console.log(`localStorage.clear();`);
console.log(`// Then reload the page`);
console.log(`location.reload(true);`); 