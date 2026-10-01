import fs from 'fs';
import path from 'path';

console.log('Running postbuild for GitHub Pages & Android sync...');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy complete dist into docs for GitHub Pages
if (fs.existsSync(distDir)) {
  copyRecursive(distDir, docsDir);
}

// 2. Ensure .nojekyll in root, dist, and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf-8');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
if (fs.existsSync(docsDir)) fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8');

// 3. Ensure 404.html in dist and docs
const notFoundHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Telugu Panchangam 2027</title>
    <script>
      sessionStorage.redirect = location.href;
      location.replace('./');
    </script>
  </head>
  <body>
    Redirecting to Telugu Panchangam 2027...
  </body>
</html>`;

if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
if (fs.existsSync(docsDir)) fs.writeFileSync(path.join(docsDir, '404.html'), notFoundHtml, 'utf-8');

// 4. Ensure root also has static assets for root deployment
const rootAssetsDir = path.join(rootDir, 'assets');
if (fs.existsSync(path.join(distDir, 'assets'))) {
  copyRecursive(path.join(distDir, 'assets'), rootAssetsDir);
}

const rootFiles = ['manifest.json', 'sw.js', 'icon-192.svg', 'icon-512.svg'];
for (const f of rootFiles) {
  const p = path.join(distDir, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(rootDir, f));
}

// 5. Ensure ads.txt is in dist and docs
const adsTxtSource = path.join(rootDir, 'ads.txt');
if (fs.existsSync(adsTxtSource)) {
  if (fs.existsSync(distDir)) fs.copyFileSync(adsTxtSource, path.join(distDir, 'ads.txt'));
  if (fs.existsSync(docsDir)) fs.copyFileSync(adsTxtSource, path.join(docsDir, 'ads.txt'));
}

// 6. Provide /assets/main.js fallback alias in dist, docs, and root
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  const mainCandidate = files.find(f => (f.startsWith('main-') || f.startsWith('index-')) && f.endsWith('.js'));
  if (mainCandidate) {
    fs.copyFileSync(path.join(distAssetsDir, mainCandidate), path.join(distAssetsDir, 'main.js'));
    if (fs.existsSync(path.join(docsDir, 'assets'))) {
      fs.copyFileSync(path.join(distAssetsDir, mainCandidate), path.join(docsDir, 'assets', 'main.js'));
    }
    if (fs.existsSync(rootAssetsDir)) {
      fs.copyFileSync(path.join(distAssetsDir, mainCandidate), path.join(rootAssetsDir, 'main.js'));
    }
  }
}

console.log('Postbuild finished successfully!');
