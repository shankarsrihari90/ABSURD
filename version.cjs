/*
 * Local release counter for ABSURD.
 * Usage: node version.cjs patch | minor | major
 * patch: 0.0.9 -> 0.1.0; minor: 0.9.9 -> 1.0.0; major increments the first part.
 */
const fs = require('node:fs');
const path = require('node:path');

const kind = process.argv[2] || 'patch';
if (!['patch', 'minor', 'major'].includes(kind)) {
  throw new Error('Usage: node version.cjs patch | minor | major');
}

const root = __dirname;
const manifestPath = path.join(root, 'release-manifest.json');
const clientPath = path.join(root, 'absurd-version.js');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = String(manifest.version).split('.').map(Number);
if (![major, minor, patch].every(Number.isInteger)) throw new Error('Invalid release-manifest version.');

if (kind === 'major') {
  major += 1; minor = 0; patch = 0;
} else if (kind === 'minor') {
  minor += 1; patch = 0;
  if (minor === 10) { major += 1; minor = 0; }
} else {
  patch += 1;
  if (patch === 10) {
    patch = 0; minor += 1;
    if (minor === 10) { major += 1; minor = 0; }
  }
}

manifest.version = [major, minor, patch].join('.');
manifest.channel = 'local';
manifest.updatedAt = new Date().toISOString();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(clientPath, "window.ABSURD_RELEASE = Object.freeze({ version: '" + manifest.version + "', channel: 'local' });\n" +
  "document.addEventListener('DOMContentLoaded', function () {\n" +
  "  var label = document.getElementById('release-version');\n" +
  "  if (label) label.textContent = 'V' + window.ABSURD_RELEASE.version + '-' + window.ABSURD_RELEASE.channel.toUpperCase();\n" +
  "});\n");
console.log('ABSURD release ' + manifest.version + ' is ready to commit.');
