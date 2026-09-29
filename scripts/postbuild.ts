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

// 1. Copy dist to docs
copyRecursive(distDir, docsDir);

// 2. Copy dist/assets to root assets
copyRecursive(path.join(distDir, 'assets'), path.join(rootDir, 'assets'));

// 3. Copy dist/downloads to root downloads
copyRecursive(path.join(distDir, 'downloads'), path.join(rootDir, 'downloads'));

// 4. Create .nojekyll in root, dist, and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf-8');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8');

// 5. Create 404.html in root, dist, and docs for GitHub Pages SPA routing
const notFoundHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Telugu Panchangam 2027</title>
    <script>
      // Single Page App redirect for GitHub Pages
      sessionStorage.redirect = location.href;
      location.replace('./');
    </script>
  </head>
  <body>
    Redirecting to Telugu Panchangam 2027...
  </body>
</html>`;

fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml, 'utf-8');
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
fs.writeFileSync(path.join(docsDir, '404.html'), notFoundHtml, 'utf-8');

console.log('Postbuild finished successfully! Ready for GitHub Pages (both root and docs folder).');
