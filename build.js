const fs = require('fs');

// Run webpack build
const { execSync } = require('child_process');
execSync('npx webpack --config ./webpack.config.js');
