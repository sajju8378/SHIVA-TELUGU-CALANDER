import fs from 'fs';
import path from 'path';

console.log('Running postbuild for GitHub Pages root deployment...');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const rootAssetsDir = path.join(rootDir, 'assets');

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

// 1. If dist/index.dev.html was produced as Vite output, ensure dist/index.html exists
const distDevHtml = path.join(distDir, 'index.dev.html');
const distIndexHtml = path.join(distDir, 'index.html');
if (fs.existsSync(distDevHtml)) {
  fs.copyFileSync(distDevHtml, distIndexHtml);
}

// 2. Normalize dist/assets filenames so both index.css/main.css and index.js/main.js exist
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);

  // JavaScript aliases
  const jsCandidate = files.find(f => f.endsWith('.js') && f !== 'sw.js');
  if (jsCandidate) {
    if (!fs.existsSync(path.join(distAssetsDir, 'index.js'))) {
      fs.copyFileSync(path.join(distAssetsDir, jsCandidate), path.join(distAssetsDir, 'index.js'));
    }
    if (!fs.existsSync(path.join(distAssetsDir, 'main.js'))) {
      fs.copyFileSync(path.join(distAssetsDir, jsCandidate), path.join(distAssetsDir, 'main.js'));
    }
  }

  // CSS aliases
  const cssCandidate = files.find(f => f.endsWith('.css'));
  if (cssCandidate) {
    if (!fs.existsSync(path.join(distAssetsDir, 'index.css'))) {
      fs.copyFileSync(path.join(distAssetsDir, cssCandidate), path.join(distAssetsDir, 'index.css'));
    }
    if (!fs.existsSync(path.join(distAssetsDir, 'main.css'))) {
      fs.copyFileSync(path.join(distAssetsDir, cssCandidate), path.join(distAssetsDir, 'main.css'));
    }
  }
}

// 3. Copy compiled dist/index.html to root index.html for direct GitHub Pages root deployment
if (fs.existsSync(distIndexHtml)) {
  fs.copyFileSync(distIndexHtml, path.join(rootDir, 'index.html'));
}

// 4. Copy dist/assets into root assets/ directory for direct root serving
if (fs.existsSync(distAssetsDir)) {
  copyRecursive(distAssetsDir, rootAssetsDir);
}

// 5. Copy complete dist into docs for backwards compatibility
if (fs.existsSync(distDir)) {
  copyRecursive(distDir, docsDir);
}

// 6. Ensure .nojekyll in root, dist, and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf-8');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
if (fs.existsSync(docsDir)) fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8');

// 7. Ensure 404.html in root, dist, and docs
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

fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml, 'utf-8');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
if (fs.existsSync(docsDir)) fs.writeFileSync(path.join(docsDir, '404.html'), notFoundHtml, 'utf-8');

// 8. Ensure root static files exist
const rootStaticFiles = ['manifest.json', 'sw.js', 'icon-192.svg', 'icon-512.svg'];
for (const f of rootStaticFiles) {
  const p = path.join(distDir, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(rootDir, f));
}

// 9. Ensure ads.txt
const adsTxtSource = path.join(rootDir, 'ads.txt');
if (fs.existsSync(adsTxtSource)) {
  if (fs.existsSync(distDir)) fs.copyFileSync(adsTxtSource, path.join(distDir, 'ads.txt'));
  if (fs.existsSync(docsDir)) fs.copyFileSync(adsTxtSource, path.join(docsDir, 'ads.txt'));
}

console.log('Postbuild finished successfully! Root deployment assets synced.');
