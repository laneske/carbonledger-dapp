// Top-level entrypoint for Render services that expect `index.js` at project root.
// Use absolute path resolution so the runtime finds the backend regardless of
// Render's working directory layout.
const path = require('path');
try {
  const backendPath = path.join(process.cwd(), 'backend', 'server.js');
  require(backendPath);
} catch (err) {
  try {
    require('./src/index.js');
  } catch (err2) {
    console.error('Failed to load backend via index.js shim:', err, err2);
    process.exit(1);
  }
}
