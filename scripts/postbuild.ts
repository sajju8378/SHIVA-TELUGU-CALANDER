import * as fs from 'fs';
import * as path from 'path';

console.log('Running postbuild for GitHub Pages & standalone deployment...');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');

function copyRecursive(src: string, dest: string) {
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

// 1. Copy complete dist build into docs directory for GitHub Pages (/docs deployment)
if (fs.existsSync(distDir)) {
  copyRecursive(distDir, docsDir);
}

// 2. Ensure .nojekyll is in dist and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf-8');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
if (fs.existsSync(docsDir)) fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8');

// 3. Ensure 404.html is in dist and docs for GitHub Pages SPA routing
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

// 4. Ensure ads.txt is in dist and docs
const adsTxtSource = path.join(rootDir, 'ads.txt');
if (fs.existsSync(adsTxtSource)) {
  if (fs.existsSync(distDir)) fs.copyFileSync(adsTxtSource, path.join(distDir, 'ads.txt'));
  if (fs.existsSync(docsDir)) fs.copyFileSync(adsTxtSource, path.join(docsDir, 'ads.txt'));
}

console.log('Postbuild finished successfully! docs/ accurately mirrors dist.');
