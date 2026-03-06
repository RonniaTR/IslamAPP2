#!/usr/bin/env node
const { execSync } = require('child_process');
try {
  execSync('npx react-scripts start', {
    stdio: 'inherit',
    cwd: require('path').resolve(__dirname, '..'),
    env: { ...process.env, PORT: '3000', HOST: '0.0.0.0', BROWSER: 'none', DANGEROUSLY_DISABLE_HOST_CHECK: 'true' }
  });
} catch (e) {
  process.exit(1);
}
