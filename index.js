// Top-level entrypoint for Render services that expect `index.js` at project root.
try {
  // Prefer the src shim if present
  require('./src/index.js');
} catch (err) {
  try {
    require('./backend/server.js');
  } catch (err2) {
    console.error('Failed to load backend via index.js shim:', err, err2);
    process.exit(1);
  }
}
