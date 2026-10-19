# 📣 Awaz-e-Mohalla (آواز محلہ)

> **"The voice of the neighbourhood"** — a civic issue reporting platform for Pakistani communities.

Citizens report local problems (broken roads, water shortage, garbage, streetlights and more), neighbours verify them, and admins track every report through to resolution.

---

## 🚩 Problem

In many Pakistani cities, everyday civic problems go unresolved because:

- There is **no simple, single channel** to report issues to local authorities.
- Reports are **unstructured and untracked**, so citizens never know what happened to their complaint.
- The **same problem gets reported many times** while urgent issues get lost in the noise.
- Authorities have **no clear way to prioritise** what needs attention first.
- Most platforms are **English-only**, leaving out many citizens.

## ✅ Solution

Awaz-e-Mohalla gives citizens and authorities one shared, transparent place to handle civic issues:

| For Citizens | For Admins |
|---|---|
| Report an issue in a few steps (category, severity, location, photo, description) | Dashboard with overview stats, reports table, map, users and analytics |
| **Smart Priority** shown live while typing the description | Update report status and manage all reports |
| **Duplicate detection**: see similar open reports in your area and verify them with "Me Too" instead of re-filing | View any report in one click, with no login prompt |
| Track progress of your reports in **My Reports** | Spot high-priority and critical issues quickly |
| Community feed with filters (category, status, priority, search) | Reset demo data from Settings |
| **English / Urdu** language toggle, dark mode, monsoon flood mode | |
| Emergency hints (Rescue 1122 / Police 15) on critical issues | |
| Points system rewarding active citizens | |

**Cities covered:** Karachi, Lahore, Islamabad, Hyderabad, Jamshoro, Multan, Peshawar.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (no framework, no build step)
- **Maps:** [Leaflet.js](https://leafletjs.com/) 1.9.4
- **Fonts:** Google Fonts (Poppins, Noto Sans Arabic for Urdu)
- **Storage:** Browser `localStorage` / `sessionStorage` (demo data seeded automatically)
- **PWA:** `manifest.json` + Service Worker (`sw.js`) for installability and offline caching

### Project structure

```
awaz-e-mohalla/
├── index.html      # Citizen-facing app
├── admin.html      # Admin dashboard
├── script.js       # Core app logic, routing, data helpers, smart priority
├── features.js     # Urdu translation, duplicates, Me Too, profile gate, dark/flood mode
├── admin.js        # Admin dashboard logic
├── style.css       # Styles
├── sw.js           # Service worker
├── manifest.json   # PWA manifest
└── assets/icon.svg
```

---

## ⚙️ Setup

No installation or build is required.

**Option 1: open directly**
1. Download or clone the repo.
2. Open `index.html` in your browser.

**Option 2: local server (recommended, needed for PWA/service worker)**
```bash
git clone https://github.com/<your-username>/awaz-e-mohalla.git
cd awaz-e-mohalla

# any one of these:
python3 -m http.server 8000
# or
npx serve .
```
Then visit `http://localhost:8000`.

### Admin dashboard
Open `admin.html` and log in with the demo credentials:

```
Email:    admin@awazemohalla.pk
Password: admin123
```

> ⚠️ These are demo credentials for a prototype. Real authentication and a backend are needed before production use.

### Handy URL options
- `index.html?fresh` clears the saved profile and starts a new visitor session.

---

## 🤖 AI Methodology & Model/API Usage

**This project does not call any external AI model or paid API.** The "AI" features are lightweight, rule-based logic that runs fully in the browser, so the app is free, fast, private and works offline.

### 1. Smart Priority Engine (`computeSmartPriority` in `script.js`)
A rule-based scoring system that assigns **Low / Medium / High / Critical** priority.
- **Inputs:** issue category, user-selected severity, and keywords found in the description.
- **Method:** keyword matching against critical and high-urgency term lists, combined with category and severity into a score.
- **Output:** a live priority badge shown while the citizen types, saved with the report.

### 2. Duplicate & Similar Report Detection (`features.js`)
- Finds **open reports of the same category in the same area** and suggests verifying them instead of filing a duplicate.

### 3. Community Verification ("Me Too")
- Each neighbour confirmation increases a report's vote count; enough verifications **automatically raise its priority**, so community signals drive urgency.

### 4. Urdu Localisation
- A dictionary and rule-based translation layer (`UR` map + regex `RULES`) translates the UI and dynamic text into Urdu, with RTL support.

### External services used
| Service | Purpose | API key needed? |
|---|---|---|
| Leaflet + map tiles | Interactive map | No |
| Google Fonts | Typography | No |

### Future AI roadmap
- Image classification of uploaded photos (e.g. pothole vs. garbage)
- ML-based text classification and multilingual (Urdu/Roman Urdu) priority detection
- Semantic duplicate detection using embeddings

---

## 📸 Screenshots

> Add your screenshots to a `screenshots/` folder and update the paths below.

| Home | Report an Issue |
|---|---|
| ![Home](screenshots/home.png) | ![Report](screenshots/report-issue.png) |

| Community Feed | Profile Prompt |
|---|---|
| ![Community](screenshots/community.png) | ![Profile](screenshots/profile-prompt.png) |

| Admin Dashboard | Admin Reports |
|---|---|
| ![Admin](screenshots/admin-dashboard.png) | ![Admin Reports](screenshots/admin-reports.png) |

---

## 👥 Team Contributions

| Member | Role | Contributions |
|---|---|---|
| **Your Name** | e.g. Full-stack Developer | e.g. Core app, smart priority engine, admin dashboard |
| **Member 2** | e.g. UI/UX Designer | e.g. Design system, Urdu/RTL layout, dark mode |
| **Member 3** | e.g. Research & Testing | e.g. Problem research, test cases, documentation |

> Replace the placeholders above with your actual team details.

---

## 🗺️ Roadmap

- Real backend and database (replace `localStorage`)
- Secure admin authentication
- Real-time notifications to citizens on status change
- Authority/department assignment and SLA tracking
- AI photo and text classification

## 📄 License

Released under the MIT License. Add a `LICENSE` file if you plan to publish it.

---

*Built with ❤️ for better neighbourhoods in Pakistan.*
