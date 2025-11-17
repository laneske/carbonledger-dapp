// Render may look for `src/index.js` by default. This shim loads the backend server.
try {
  require('../backend/server');
} catch (err) {
  // If for some reason the relative path differs on the platform, try fallback
  try {
    require('./backend/server');
  } catch (e) {
    console.error('Failed to load backend/server.js from src/index.js shim:', e);
    process.exit(1);
  }
}
