const fs = require('fs');

// Run webpack build
const { execSync } = require('child_process');
execSync('npx webpack --config ./webpack.config.js');

// Read the generated HTML file
const htmlFilePath = './dist/curate_modules.html'; // Adjust the path as necessary
let html = fs.readFileSync(htmlFilePath, 'utf8');

// Remove the <head> element
html = html.replace(/<head\b[^>]*>/, '');
html = html.replace(/<\/head\s*>/, '');

// Write the modified HTML back to the file
fs.writeFileSync(htmlFilePath, html, 'utf8');

console.log('Head element removed from the HTML file.');