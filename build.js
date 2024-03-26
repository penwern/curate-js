const fs = require('fs');

// Read config parameters
const config = JSON.parse(fs.readFileSync('./build_config.json', 'utf8'));
const githubPagesUrl = config.githubPagesUrl;
const repoName = config.repoName;
const bundlePath = config.bundlePath
// Run webpack build
const { execSync } = require('child_process');
execSync('npx webpack --config ./webpack.config.js');

// Construct the full URL for curate_bundle.js
const bundleUrl = `${githubPagesUrl}${repoName}${bundlePath}`;
console.log(bundleUrl)

console.log('Built');
