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

// 2. Ensure root also has compiled assets, manifest, sw, icons for root deployment (main / root)
if (fs.existsSync(path.join(distDir, 'assets'))) {
  copyRecursive(path.join(distDir, 'assets'), path.join(rootDir, 'assets'));
}

const rootFilesToSync = ['manifest.json', 'sw.js', 'icon-192.svg', 'icon-512.svg', '404.html', '.nojekyll'];
for (const file of rootFilesToSync) {
  const distFile = path.join(distDir, file);
  if (fs.existsSync(distFile)) {
    fs.copyFileSync(distFile, path.join(rootDir, file));
  }
}

// 3. Find built JS and CSS names from dist/assets
let builtJs = '';
let builtCss = '';
if (fs.existsSync(path.join(distDir, 'assets'))) {
  const files = fs.readdirSync(path.join(distDir, 'assets'));
  builtJs = files.find(f => f.endsWith('.js') && f.startsWith('index-')) || '';
  builtCss = files.find(f => f.endsWith('.css') && f.startsWith('index-')) || '';
}

// 4. Update root index.html to support BOTH local dev (/src/main.tsx) AND GitHub Pages root deployment (./assets/...)
if (builtJs) {
  const rootIndexHtml = `<!doctype html>
<html lang="te">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Telugu Panchangam 2027</title>
    <meta name="description" content="Authentic Telugu Hindu Panchangam and Calendar for 2027 with high-precision astronomical calculations, Amanta lunar system, Tithi, Nakshatra, Muhurtam, and Festivals." />
    <meta property="og:title" content="Telugu Panchangam 2027" />
    <meta property="og:description" content="Authentic Telugu Hindu Panchangam and Calendar for 2027 with high-precision astronomical calculations, Amanta lunar system, Tithi, Nakshatra, Muhurtam, and Festivals." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="./icon-192.svg" />
    <link rel="manifest" href="./manifest.json" />
    <meta name="theme-color" content="#991b1b" />
    
    <!-- Google Fonts for Telugu Typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Noto+Sans+Telugu:wght@300;400;500;600;700;800&family=Ramabhadra&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    ${builtCss ? `<link rel="stylesheet" crossorigin href="./assets/${builtCss}">` : ''}
  </head>
  <body class="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
    <div id="root"></div>
    <script type="module">
      const isDev = window.location.port === '3000' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.__vite_plugin_react_preamble_installed__;
      if (isDev) {
        import('/src/main.tsx');
      } else {
        import('./assets/${builtJs}');
      }
    </script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('SW registration note:', err);
          });
        });
      }
    </script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(rootDir, 'index.html'), rootIndexHtml, 'utf-8');
}

// 5. Ensure ads.txt is in root, dist, and docs
const adsTxtSource = path.join(rootDir, 'ads.txt');
if (fs.existsSync(adsTxtSource)) {
  if (fs.existsSync(distDir)) fs.copyFileSync(adsTxtSource, path.join(distDir, 'ads.txt'));
  if (fs.existsSync(docsDir)) fs.copyFileSync(adsTxtSource, path.join(docsDir, 'ads.txt'));
}

console.log('Postbuild finished successfully! Both root and docs/ are fully primed for GitHub Pages deployment.');
