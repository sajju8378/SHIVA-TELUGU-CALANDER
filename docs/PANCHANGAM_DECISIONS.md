# Telugu Hindu Panchangam Calculation Conventions & Technical Decisions
*(పంచాంగ గణన నిర్ణయాలు మరియు సాంకేతిక వివరణ)*

This document provides a thorough explanation of all astronomical models, traditional conventions, and mathematical formulations implemented in this Telugu Hindu Panchangam application (covering 2027 and extensible to any year). It is written for domain reviewers, Vedic astrologers (సిద్ధాంతులు), and software engineers.

---

## 1. Zodiac & Ayanamsa (అయనాంశ నిర్ణయం)
- **Sidereal Zodiac (నిరయన రాశిచక్రం):** Standard in Vedic astrology and Telugu Panchangams.
- **Ayanamsa Scheme:** **Lahiri (లహరి) / Chitrapaksha (చిత్రాపక్ష)** Ayanamsa, recommended by the Calendar Reform Committee (Govt. of India / NCAC).
- **Mathematical Formula:**
  - J2000.0 Reference Epoch ($JD = 2451545.0$): Base $\text{Ayanamsa}_0 = 23^\circ 51' 25.53" \approx 23.85709167^\circ$.
  - Precession Rate: $50.290966"$ per Julian century ($1.396971277^\circ$).
  - Nutation Correction: Includes true IAU 1980 nutation in longitude ($\Delta\psi$).
  - For 2027: Calculated Lahiri Ayanamsa is $\approx 24.237^\circ$ ($24^\circ 14' 14"$).

---

## 2. Lunar System: Amanta vs. Purnimanta (అమాంత మానం)
- **Strictly Amanta (అమాంత పద్ధతి):**
  - In Telugu tradition (Andhra Pradesh, Telangana, Karnataka, and Maharashtra), the lunar month begins at the conclusion of Amavasya (Shukla Pratipada) and ends with the next Amavasya.
  - The bright half (శుక్ల పక్షం, Tithis 1–15: Padyami to Pournami) comes first, followed by the dark half (కృష్ణ / బహుళ పక్షం, Tithis 16–30: Bahula Padyami to Amavasya).
- **Naming Rule for Lunar Months:**
  - An Amanta lunar month receives its name from the Solar Ingress (*Sankranti / రాశి సంక్రమణం*) that takes place within that lunar cycle.
  - *Example for 2027:* The new moon on April 6, 2027 initiates the lunar month within which the Sun enters Aries (*Mesha Sankranti*, approx April 14). Hence, this entire lunar month is **Chaitramu (చైత్ర మాసము)**, and April 7, 2027 is **Ugadi (ఉగాది)**.

---

## 3. 60-Year Samvatsara Cycle (షష్టి సంవత్సరం)
- The Hindu calendar cycles through 60 named years beginning with *Prabhava* (1) through *Kshaya/Akshaya* (60).
- **Calculation Formulation:**
  - The Telugu calendar year transitions precisely on **Ugadi (Chaitra Shukla Pratipada)**.
  - Shaka Era year: $\text{Shaka} = \text{Gregorian Year} - 78$ (or $-79$ before Ugadi).
  - Cycle index (0-based): $(\text{Shaka} + 11) \pmod{60}$.
- **Verification for 2026–2028:**
  - **2024–2025:** Krodhi (క్రోధి - No. 38)
  - **2025–2026:** Vishvavasu (విశ్వావసు - No. 39)
  - **2026–2027 (until April 6, 2027):** Parabhava (పరాభవ - No. 40)
  - **2027–2028 (from April 7, 2027 Ugadi onwards):** **Plavanga (ప్లవంగ నామ సంవత్సరం - No. 41)**!

---

## 4. The Five Limbs of Panchangam (పంచాంగ అంగాలు)

### A. Tithi (తిథి)
- **Definition:** The angular separation between the Moon and Sun:
  $$\Delta\theta = (\lambda_{\text{Moon, sidereal}} - \lambda_{\text{Sun, sidereal}}) \pmod{360^\circ}$$
- Each Tithi corresponds to an elongation increment of $12^\circ$:
  $$\text{Tithi Number} = \lfloor \Delta\theta / 12^\circ \rfloor + 1 \quad (1 \text{ to } 30)$$
- **Transition Times & Bisection Root-Finding:**
  - Tithi end times are computed by finding the exact instant where $\Delta\theta(t) = k \cdot 12^\circ$ down to minute accuracy using bisection search on the ephemeris.
- **Tithi Kshaya & Vriddhi:**
  - **Tithi Kshaya (తిథి క్షయము):** When a Tithi starts after sunrise and ends before the next sunrise (spanning no sunrise), it is marked as skipped.
  - **Tithi Vriddhi (తిథి వృద్ధి):** When a Tithi spans across two consecutive sunrises.

### B. Nakshatra (నక్షత్రం) & Pada (పాదము)
- Sidereal Moon longitude divided into 27 equal segments of $13^\circ 20'$ ($800'$):
  $$\text{Nakshatra Index} = \lfloor \lambda_{\text{Moon}} / 13.3333^\circ \rfloor + 1 \quad (1 \text{ to } 27)$$
- **Pada (పాదం):** Each Nakshatra has 4 quarters (Padas) of $3^\circ 20'$ ($200'$):
  $$\text{Pada} = \lfloor (\lambda_{\text{Moon}} \pmod{13.3333^\circ}) / 3.3333^\circ \rfloor + 1 \quad (1 \text{ to } 4)$$

### C. Yoga (యోగము)
- Sum of Sidereal Sun and Moon longitudes modulo $360^\circ$ divided into 27 divisions of $13^\circ 20'$:
  $$\text{Yoga Index} = \lfloor (\lambda_{\text{Sun}} + \lambda_{\text{Moon}}) \pmod{360^\circ} / 13.3333^\circ \rfloor + 1$$

### D. Karana (కరణము)
- Half-Tithi divisions ($6^\circ$ each, 60 per lunar month):
  - 1st half of Shukla Pratipada: *Kimstughna* (fixed)
  - Next 56 half-tithis: 8 cycles of the 7 movable Karanas (*Bava, Balava, Kaulava, Taitila, Garija, Vanija, Vishti/Bhadra*)
  - Last 3 half-tithis of Krishna Amavasya: *Shakuni, Chatushpada, Naga* (fixed)

### E. Vara (వారము)
- **Sunrise-to-Sunrise Convention (సూర్యోదయ వార గణన):**
  - Unlike the midnight-to-midnight Gregorian day, the Hindu Vara begins strictly at local astronomical sunrise.
  - An event occurring at 4:30 AM before sunrise on Tuesday morning belongs to *Somavara* (Monday).

---

## 5. Sunrise, Sunset, and Muhurtam Timings

### A. Astronomical Zenith & Solar Calculations
- Uses standard apparent sunrise zenith of $90^\circ 50'$ ($90.8333^\circ$), accounting for:
  - Atmospheric refraction at the horizon: $34'$
  - Solar semi-diameter: $16'$
- Solved with Equation of Time ($EoT$) and solar declination ($\delta$) for each location.

### B. Rahu Kalam, Yamagandam, Gulika Kalam (రాహుకాలం, యమగండం, గుళికా కాలం)
- Daytime interval $(\text{Sunset} - \text{Sunrise})$ is divided into 8 equal parts ($\approx 1.5$ hours each):
  | Weekday | Rahu Kalam Part | Yamagandam Part | Gulika Kalam Part |
  | :--- | :--- | :--- | :--- |
  | **Sunday (ఆది)** | 8th (16:30 – 18:00) | 5th (12:00 – 13:30) | 7th (15:00 – 16:30) |
  | **Monday (సోమ)** | 2nd (07:30 – 09:00) | 4th (10:30 – 12:00) | 6th (13:30 – 15:00) |
  | **Tuesday (మంగళ)** | 7th (15:00 – 16:30) | 3rd (09:00 – 10:30) | 5th (12:00 – 13:30) |
  | **Wednesday (బుధ)** | 5th (12:00 – 13:30) | 2nd (07:30 – 09:00) | 4th (10:30 – 12:00) |
  | **Thursday (గురు)** | 6th (13:30 – 15:00) | 1st (06:00 – 07:30) | 3rd (09:00 – 10:30) |
  | **Friday (శుక్ర)** | 4th (10:30 – 12:00) | 7th (15:00 – 16:30) | 2nd (07:30 – 09:00) |
  | **Saturday (శని)** | 3rd (09:00 – 10:30) | 6th (13:30 – 15:00) | 1st (06:00 – 07:30) |

### C. Durmuhurtam (దుర్ముహూర్తం)
- Daytime divided into 15 Muhurtams ($\approx 48$ minutes each):
  - Sunday: 14th Muhurtam
  - Monday: 9th & 12th Muhurtams
  - Tuesday: 6th Muhurtam
  - Wednesday: 8th Muhurtam
  - Thursday: 6th & 12th Muhurtams
  - Friday: 4th & 9th Muhurtams
  - Saturday: 1st & 2nd Muhurtams

### D. Varjyam (వర్జ్యం / త్యాజ్యం)
- Specific inauspicious duration of 4 Ghatis ($96$ minutes) derived from traditional *Tyajya Ghatis* for each of the 27 Nakshatras (e.g. Ashwini: 50, Bharani: 24, Krittika: 30, Rohini: 40, etc.).

### E. Abhijit Muhurtam (అభిజిత్ ముహూర్తం)
- 8th Muhurtam centered around local midday / solar noon.
- **Rule:** Omitted on **Wednesdays (బుధవారము)** in Telugu tradition due to conflict with Rahu Kalam and Wednesday dosha.

---

## 6. Festival Derivations (పండుగల నిర్ణయ సూత్రాలు)
All festivals are algorithmically computed:
1. **Ugadi:** Chaitra Shukla Pratipada (April 7, 2027)
2. **Sri Rama Navami:** Chaitra Shukla Navami (April 15, 2027)
3. **Akshaya Tritiya:** Vaishakha Shukla Tritiya
4. **Sri Narasimha Jayanti:** Vaishakha Shukla Chaturdashi
5. **Telugu Hanuman Jayanti:** Vaishakha Krishna Dashami (marking 41 days of Hanuman Deeksha)
6. **Guru Pournami:** Ashadha Shukla Pournami
7. **Bonalu:** Ashadha month Sundays (Telangana Jatara)
8. **Varalakshmi Vratam:** Friday preceding Shravana Pournami
9. **Rakhi Pournami:** Shravana Shukla Pournami
10. **Sri Krishna Janmashtami:** Shravana Krishna Ashtami
11. **Vinayaka Chavithi:** Bhadrapada Shukla Chavithi (September 4, 2027)
12. **Mahalaya Amavasya:** Bhadrapada Krishna Amavasya (Engili Pula Bathukamma)
13. **Bathukamma / Saddula Bathukamma:** Ashwayuja Shukla Ashtami (Durgashtami)
14. **Vijayadashami / Dasara:** Ashwayuja Shukla Dashami (October 10, 2027)
15. **Atla Tadde:** Ashwayuja Krishna Tadiya
16. **Naraka Chaturdashi:** Ashwayuja Krishna Chaturdashi
17. **Deepavali:** Ashwayuja Krishna Amavasya (October 29, 2027)
18. **Karthika Masam Start:** Karthika Shukla Pratipada
19. **Karthika Pournami:** Karthika Shukla Pournami (Jwala Thoranam)
20. **Subramanya Shashti:** Margashira Shukla Shashti
21. **Vaikuntha Ekadashi:** Margashira Shukla Ekadashi
22. **Makara Sankranti Cycle:** Bhogi (Jan 14), Sankranti (Jan 15), Kanuma (Jan 16), Mukkanuma (Jan 17)
23. **Maha Shivaratri:** Magha Krishna Chaturdashi
24. **Holi / Kamadahanam:** Phalguna Shukla Pournami
25. **24 Ekadashis:** All named Ekadashis computed with their traditional rules and significance.

---

## 7. Android APK & Offline Strategy
- An Android APK package is built and accessible directly from the app via 1-click download (`public/downloads/telugu-panchangam-2027.apk`).
- Service Worker (`public/sw.js`) and Web App Manifest (`public/manifest.json`) enable immediate PWA installation on Android and Chrome.
- The entire 365-day 2027 dataset is precomputed and cached in-bundle (`src/engine/precomputed2027.json`) for instant 0ms offline access.
