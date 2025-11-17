// Render may look for `src/index.js` by default. This shim loads the backend server
// using an absolute path based on the runtime working directory so it works
// regardless of how Render checks out the repository.
const path = require('path');
try {
  const backendPath = path.join(process.cwd(), 'backend', 'server.js');
  require(backendPath);
} catch (err) {
  try {
    // Fallback to relative paths if the above doesn't work
    require('../backend/server');
  } catch (e) {
    console.error('Failed to load backend/server.js from src/index.js shim:', err, e);
    process.exit(1);
  }
}
