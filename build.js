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

// Read the generated HTML file
const htmlFilePath = './dist/curate_modules.html'; // Adjust the path as necessary
let html = fs.readFileSync(htmlFilePath, 'utf8');

// Replace local file path with GitHub Pages URL
html = html.replace(/"curate_bundle.js"/, `"${bundleUrl}"`);

// Remove the <head> element
html = html.replace(/<head\b[^>]*>/, '');
html = html.replace(/<\/head\s*>/, '');

// Write the modified HTML back to the file
fs.writeFileSync(htmlFilePath, html, 'utf8');

console.log('Bundle file path updated to GitHub Pages URL.');
