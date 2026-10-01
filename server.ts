import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatePanchangamForDay, TELUGU_CITIES } from './src/engine/panchangam.ts';
import { FESTIVAL_DEFINITIONS } from './src/engine/festivals.ts';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory cache for fast responses
const dayCache = new Map<string, any>();

// Helper to get or compute panchangam
function getPanchangam(dateStr: string, lat = 17.385044, lon = 78.486671, cityName = 'Hyderabad (Telangana)', tz = 5.5) {
  const cacheKey = `${dateStr}-${lat.toFixed(4)}-${lon.toFixed(4)}-${tz}`;
  if (dayCache.has(cacheKey)) {
    return dayCache.get(cacheKey);
  }
  const result = calculatePanchangamForDay(dateStr, lat, lon, cityName, tz);
  dayCache.set(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. GET /v1/panchangam/day?date=YYYY-MM-DD&lat=&lon=&tz=&city=
app.get('/v1/panchangam/day', (req, res) => {
  try {
    const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 17.385044;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 78.486671;
    const tz = req.query.tz ? parseFloat(req.query.tz as string) : 5.5;
    const city = (req.query.city as string) || 'Hyderabad (Telangana)';

    const data = getPanchangam(dateStr, lat, lon, city, tz);
    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET /v1/panchangam/month?year=2027&month=1&lat=&lon=
app.get('/v1/panchangam/month', (req, res) => {
  try {
    const year = parseInt((req.query.year as string) || '2027', 10);
    const month = parseInt((req.query.month as string) || '1', 10); // 1-12
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 17.385044;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 78.486671;
    const tz = req.query.tz ? parseFloat(req.query.tz as string) : 5.5;
    const city = (req.query.city as string) || 'Hyderabad (Telangana)';

    // Days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      days.push(getPanchangam(dateStr, lat, lon, city, tz));
    }

    res.json({
      success: true,
      year,
      month,
      totalDays: daysInMonth,
      settings: {
        ayanamsa: 'Lahiri (Chitrapaksha)',
        system: 'Amanta',
        dayStartConvention: 'Sunrise',
        location: { lat, lon, cityName: city, tz },
      },
      days,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET /v1/panchangam/year?year=2027&page=1&limit=31&lat=&lon=
app.get('/v1/panchangam/year', (req, res) => {
  try {
    const year = parseInt((req.query.year as string) || '2027', 10);
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '31', 10)));
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 17.385044;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 78.486671;
    const city = (req.query.city as string) || 'Hyderabad (Telangana)';

    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeap ? 366 : 365;

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalDays);

    const days = [];
    const startDate = new Date(year, 0, 1);

    for (let i = startIndex; i < endIndex; i++) {
      const cur = new Date(startDate.getTime() + i * 86400000);
      const y = cur.getFullYear();
      const m = (cur.getMonth() + 1).toString().padStart(2, '0');
      const d = cur.getDate().toString().padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      days.push(getPanchangam(dateStr, lat, lon, city, 5.5));
    }

    res.json({
      success: true,
      year,
      page,
      limit,
      totalDays,
      totalPages: Math.ceil(totalDays / limit),
      settings: {
        ayanamsa: 'Lahiri (Chitrapaksha)',
        system: 'Amanta',
        dayStartConvention: 'Sunrise',
      },
      data: days,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. GET /v1/festivals?year=2027
app.get('/v1/festivals', (req, res) => {
  try {
    const year = parseInt((req.query.year as string) || '2027', 10);
    const category = req.query.category as string | undefined;

    // Scan all days of the year for festivals
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeap ? 366 : 365;
    const startDate = new Date(year, 0, 1);

    const festivalMap = new Map<string, any>();

    for (let i = 0; i < totalDays; i++) {
      const cur = new Date(startDate.getTime() + i * 86400000);
      const y = cur.getFullYear();
      const m = (cur.getMonth() + 1).toString().padStart(2, '0');
      const d = cur.getDate().toString().padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      const p = getPanchangam(dateStr);
      if (p.festivals && p.festivals.length > 0) {
        for (const f of p.festivals) {
          if (!category || f.category === category) {
            festivalMap.set(`${f.id}-${dateStr}`, {
              ...f,
              teluguMonth: p.monthTelugu,
              paksha: p.pakshaTelugu,
              tithi: p.tithi.nameTelugu,
              vara: p.varaTelugu,
            });
          }
        }
      }
    }

    const festivals = Array.from(festivalMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      year,
      totalCount: festivals.length,
      festivals,
      rulesCatalog: FESTIVAL_DEFINITIONS.map((r) => ({
        id: r.id,
        nameTelugu: r.nameTelugu,
        nameEnglish: r.nameEnglish,
        category: r.category,
        ruleTelugu: r.ruleDescriptionTelugu,
        ruleEnglish: r.ruleDescriptionEnglish,
        significanceTelugu: r.significanceTelugu,
        significanceEnglish: r.significanceEnglish,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. GET /v1/muhurtam/day?date=YYYY-MM-DD&lat=&lon=
app.get('/v1/muhurtam/day', (req, res) => {
  try {
    const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 17.385044;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 78.486671;
    const tz = req.query.tz ? parseFloat(req.query.tz as string) : 5.5;
    const city = (req.query.city as string) || 'Hyderabad (Telangana)';

    const p = getPanchangam(dateStr, lat, lon, city, tz);

    res.json({
      success: true,
      date: dateStr,
      dayOfWeek: p.varaEnglish,
      sunrise: p.sunrise,
      sunset: p.sunset,
      inauspiciousTimings: {
        rahuKalam: p.timings.rahuKalam,
        yamagandam: p.timings.yamagandam,
        gulikaKalam: p.timings.gulikaKalam,
        durmuhurtam: p.timings.durmuhurtam,
        varjyam: p.timings.varjyam,
      },
      auspiciousTimings: {
        abhijitMuhurtam: p.timings.abhijitMuhurtam,
        amritaKalam: p.timings.amritaKalam,
        brahmaMuhurtam: p.timings.brahmaMuhurtam,
      },
      summary: {
        goodTimeToStart: p.timings.abhijitMuhurtam
          ? `అభిజిత్ ముహూర్తం: ${p.timings.abhijitMuhurtam.formatted}`
          : (p.timings.amritaKalam ? `అమృత ఘడియలు: ${p.timings.amritaKalam.formatted}` : 'శుభ సమయం'),
        avoidStartingDuring: `రాహుకాలం (${p.timings.rahuKalam.formatted}) మరియు యమగండం (${p.timings.yamagandam.formatted}) వర్జ్యం.`,
      },
      settings: p.settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. GET /v1/cities
app.get('/v1/cities', (_req, res) => {
  res.json({
    success: true,
    cities: TELUGU_CITIES,
  });
});

// 7. APK Download route
app.get('/download/telugu-panchangam-2027.apk', (_req, res) => {
  const apkPath = path.resolve(__dirname, 'public/downloads/telugu-panchangam-2027.apk');
  if (fs.existsSync(apkPath)) {
    res.download(apkPath, 'TeluguPanchangam2027.apk');
  } else {
    res.status(404).send('APK file is generating or not found.');
  }
});

// -------------------------------------------------------------
// Vite middleware in dev or static files in prod
// -------------------------------------------------------------
async function setupServer() {
  // Explicit route for /assets/main.js to support AI Studio preview test harness
  app.get('/assets/main.js', (req, res, next) => {
    if (!isProd) {
      req.url = '/src/main.tsx';
      return next();
    } else {
      const distAssets = path.resolve(__dirname, 'dist/assets');
      if (fs.existsSync(distAssets)) {
        const files = fs.readdirSync(distAssets);
        const match = files.find(f => (f.startsWith('main-') || f.startsWith('index-')) && f.endsWith('.js'));
        if (match) {
          res.setHeader('Content-Type', 'application/javascript');
          return res.sendFile(path.join(distAssets, match));
        }
      }
      return next();
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

setupServer();
