/* ===================== AWAZ-E-MOHALLA ===================== */

const CATEGORIES = [
  {id:'pothole', label:'Pothole', icon:'🕳️'},
  {id:'garbage', label:'Garbage', icon:'🗑️'},
  {id:'streetlight', label:'Streetlight', icon:'💡'},
  {id:'water', label:'Water Leakage', icon:'🚰'},
  {id:'road', label:'Road Damage', icon:'🛣️'},
  {id:'drainage', label:'Drainage / Flooding', icon:'🌊'},
  {id:'manhole', label:'Open Manhole', icon:'🚧'},
  {id:'other', label:'Other', icon:'🏠'}
];
const CITIES = ['Karachi','Lahore','Islamabad','Hyderabad','Jamshoro','Multan','Peshawar'];
const AREAS = {
  Karachi:['Saddar','Gulshan-e-Iqbal','Clifton','North Nazimabad','Korangi','Malir','Orangi Town','DHA'],
  Lahore:['Gulberg','Model Town','Johar Town','Anarkali','Iqbal Town','DHA','Shahdara'],
  Islamabad:['F-7','F-10','G-9','I-8','Blue Area','Bahria Town'],
  Hyderabad:['Qasimabad','Latifabad','Hirabad','Saddar','Autobhan Road','Gulistan-e-Sajjad'],
  Jamshoro:['University Road','Sindh University Area','Bilawal Colony','Jamshoro Bazaar','Kotri Road','LUMHS Area'],
  Multan:['Gulgasht Colony','Cantt','Shah Rukn-e-Alam Colony','Bosan Road','Hussain Agahi','Nawan Shehr'],
  Peshawar:['University Town','Hayatabad','Saddar','Gulbahar','Ring Road','Qissa Khwani']
};
function locText(r){ return escapeHtml(r.locality ? r.locality + ', ' + r.area : r.area); }
const CITY_COORDS = {
  Karachi:[24.8607,67.0011], Lahore:[31.5497,74.3436], Islamabad:[33.6844,73.0479],
  Hyderabad:[25.3960,68.3578], Jamshoro:[25.4296,68.2738], Multan:[30.1575,71.5249], Peshawar:[34.0151,71.5805]
};
const STATUS_FLOW = ['submitted','review','assigned','resolved'];
const STATUS_LABEL = {submitted:'🔵 Submitted', review:'🟡 Under Review', assigned:'🟠 Assigned', resolved:'🟢 Resolved'};
const PRIORITY_LABEL = {low:'Low', medium:'Medium', high:'High', critical:'Critical'};

/* ---------- LocalStorage helpers ---------- */
const DB = {
  reports:'awaz_reports', user:'awaz_user', admin:'awaz_admin', init:'awaz_initialized'
};
function loadReports(){ try{ return JSON.parse(localStorage.getItem(DB.reports)) || []; }catch(e){ return []; } }
function saveReports(list){
  try{ localStorage.setItem(DB.reports, JSON.stringify(list)); }
  catch(e){
    console.warn('Storage write failed', e);
    if(typeof toast === 'function') toast('Storage is full — try removing a photo or clearing old demo data.', '⚠️');
  }
}
function addReport(r){ const list = loadReports(); list.unshift(r); saveReports(list); return r; }
function updateReport(id, patch){ const list = loadReports(); const i=list.findIndex(r=>r.id===id); if(i<0) return null; list[i]={...list[i], ...patch}; saveReports(list); return list[i]; }
function getReport(id){ return loadReports().find(r=>r.id===id); }
function deleteReport(id){ saveReports(loadReports().filter(r=>r.id!==id)); }

function loadUser(){
  let u = JSON.parse(localStorage.getItem(DB.user) || 'null');
  if(!u){ u = {name:'Areej', community:'Jamshoro', points:240}; localStorage.setItem(DB.user, JSON.stringify(u)); }
  return u;
}
function nextTicketId(){
  const list = loadReports();
  let max = 1000;
  list.forEach(r=>{ const n = parseInt((r.id||'AM-1000').split('-')[1],10); if(n>max) max=n; });
  return 'AM-' + (max+1);
}

/* ---------- Demo data seeding ---------- */
function seedDemoData(){
  if(localStorage.getItem(DB.init)) return;
  const now = Date.now();
  const demo = [
    mk('AM-1001','pothole','Large Pothole Near University Road','Deep pothole causing traffic slowdowns and risk to motorbikes.','Jamshoro','high','review', now-2*3600*1000),
    mk('AM-1002','streetlight','Broken Streetlight on Main Avenue','Streetlight has been off for over a week, unsafe at night.','Hyderabad','medium','assigned', now-28*3600*1000),
    mk('AM-1003','garbage','Garbage Accumulation Near Market','Uncollected garbage piling up for days, bad smell and pests.','Karachi','medium','resolved', now-5*24*3600*1000),
    mk('AM-1004','manhole','Open Manhole Near School','Dangerous open manhole right outside a primary school gate.','Lahore','critical','review', now-5*3600*1000),
    mk('AM-1005','water','Water Pipeline Leakage','Continuous water leakage wasting water and flooding the street.','Islamabad','medium','submitted', now-1*3600*1000),
    mk('AM-1006','drainage','Drainage Blockage Causing Flooding','Blocked drain causes flooding after every rainfall.','Multan','high','assigned', now-3*24*3600*1000),
    mk('AM-1007','road','Damaged Road Surface','Cracked and uneven road surface near the bus stop.','Peshawar','low','submitted', now-10*3600*1000),
    mk('AM-1008','pothole','Multiple Potholes on Link Road','Series of potholes making the road nearly unusable.','Jamshoro','high','resolved', now-7*24*3600*1000)
  ];
  const LOC={'AM-1001':'University Road','AM-1002':'Qasimabad','AM-1003':'Saddar','AM-1004':'Gulberg','AM-1005':'F-7','AM-1006':'Gulgasht Colony','AM-1007':'University Town','AM-1008':'Kotri Road'};
  demo.forEach(r=>{ r.locality = LOC[r.id]; });
  saveReports(demo);
  localStorage.setItem(DB.init, '1');
}
function mk(id,cat,title,desc,city,priority,status,ts){
  const coords = CITY_COORDS[city];
  const jitter = ()=> (Math.random()-0.5)*0.04;
  const timeline = buildTimelineFor(status, ts);
  return {
    id, category:cat, title, description:desc, area:city, city,
    lat: coords[0]+jitter(), lng: coords[1]+jitter(),
    priority, status, photo:null, createdAt: ts, updatedAt: ts,
    timeline, contact:''
  };
}
function buildTimelineFor(status, ts){
  const idx = STATUS_FLOW.indexOf(status);
  const steps = [
    {key:'submitted', label:'Report Submitted', time: ts},
    {key:'review', label:'Under Review', time: ts + 15*60*1000},
    {key:'assigned', label:'Assigned to Local Team', time: ts + 20*3600*1000},
    {key:'resolved', label:'Resolved', time: ts + 48*3600*1000}
  ];
  return steps.map((s,i)=>({...s, done: i<=idx}));
}

/* ---------- Smart Priority Engine ---------- */
const PRIORITY_KEYWORDS = {
  critical: ['open manhole','accident','electric wire','exposed wire','gas leak','live wire','collapsed'],
  high: ['school','hospital','dangerous','fire','flooding','children','main road']
};
function computeSmartPriority(category, description, severity){
  let score = {low:1,medium:2,high:3,critical:4}[severity] || 2;
  const text = (description||'').toLowerCase();
  PRIORITY_KEYWORDS.critical.forEach(k=>{ if(text.includes(k)) score = Math.max(score,4); });
  PRIORITY_KEYWORDS.high.forEach(k=>{ if(text.includes(k)) score = Math.max(score,3); });
  if(category==='manhole') score = Math.max(score,3);
  if(category==='drainage' && text.includes('flood')) score = Math.max(score,3);
  const map = {1:'low',2:'medium',3:'high',4:'critical'};
  return map[score];
}

/* ---------- Toasts ---------- */
function toast(msg, icon){
  let c = document.getElementById('toast-container');
  if(!c){ c = document.createElement('div'); c.id='toast-container'; c.className='toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icon||'✅'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 3400);
}

/* ---------- Utils ---------- */
function timeAgo(ts){
  const diff = Date.now()-ts;
  const m = Math.floor(diff/60000), h=Math.floor(diff/3600000), d=Math.floor(diff/86400000);
  if(m<1) return 'just now';
  if(m<60) return `${m} min ago`;
  if(h<24) return `${h} hour${h>1?'s':''} ago`;
  return `${d} day${d>1?'s':''} ago`;
}
function fmtDate(ts){
  return new Date(ts).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
}
function catMeta(id){ return CATEGORIES.find(c=>c.id===id) || CATEGORIES[CATEGORIES.length-1]; }
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* ===================== INIT ===================== */
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  loadUser();
  if(document.getElementById('app')){
    initNav();
    window.addEventListener('hashchange', router);
    router();
  }
});

function initNav(){
  const burger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if(burger) burger.addEventListener('click', ()=> mobileMenu.classList.toggle('open'));
  document.querySelectorAll('.mobile-menu a').forEach(a=> a.addEventListener('click', ()=> mobileMenu.classList.remove('open')));
}

/* ===================== ROUTER ===================== */
function router(){
  const hash = location.hash || '#/';
  const app = document.getElementById('app');
  window.scrollTo(0,0);
  updateActiveNav(hash);

  if(hash === '#/' || hash === ''){ app.innerHTML = renderHome(); afterHome(); }
  else if(hash.startsWith('#/report/')){ const id = hash.split('/')[2]; app.innerHTML = renderReportDetail(id); afterDetail(id); }
  else if(hash.startsWith('#/report-issue')){ const params = new URLSearchParams(hash.split('?')[1]||''); app.innerHTML = renderReportForm(params.get('cat')); afterForm(params.get('cat')); }
  else if(hash.startsWith('#/community')){ app.innerHTML = renderCommunity(); afterCommunity(); }
  else if(hash.startsWith('#/my-reports')){ app.innerHTML = renderMyReports(); afterMyReports(); }
  else { app.innerHTML = renderHome(); afterHome(); }
}
function updateActiveNav(hash){
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === hash.split('?')[0] || (hash.startsWith('#/report/') && a.getAttribute('href')==='#/community'));
  });
}

/* ===================== HOME PAGE ===================== */
function renderHome(){
  const reports = loadReports();
  const resolved = reports.filter(r=>r.status==='resolved');
  const recent = [...reports].sort((a,b)=>b.createdAt-a.createdAt).slice(0,3);
  const resolvedForBA = resolved.slice(0,2);

  return `
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <div class="badge">🇵🇰 Built for Pakistan · Pakistan@79</div>
        <h1>Your Neighborhood.<br>Your <span>Voice.</span><br>Your Report.</h1>
        <p>Turn everyday problems into community action. Report potholes, garbage, broken streetlights, water leaks and other local issues — then track what happens next.</p>
        <div class="hero-actions">
          <a href="#/report-issue" class="btn btn-primary">📣 Report an Issue</a>
          <a href="#/community" class="btn btn-outline">🗺️ Explore Community Issues</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hv-map" id="hero-map-visual">
          ${heroPins()}
          <div class="float-card" style="top:14px;left:14px;animation-delay:0s"><span class="dot" style="background:var(--red)"></span>AM-1004 · Critical</div>
          <div class="float-card" style="bottom:50px;right:10px;animation-delay:1s"><span class="dot" style="background:var(--primary)"></span>Resolved: Garbage Cleared</div>
          <div class="float-card" style="bottom:12px;left:30%;animation-delay:2s">👥 ${reports.length} Reports Tracked</div>
        </div>
      </div>
    </div>
  </section>

  <section class="stats-section">
    <div class="container stats-grid">
      <div class="stat-card"><div class="stat-num" data-count="1284">0</div><div class="stat-label">Reports Submitted</div></div>
      <div class="stat-card"><div class="stat-num" data-count="814">0</div><div class="stat-label">Issues Resolved</div></div>
      <div class="stat-card"><div class="stat-num" data-count="72" data-suffix="%">0</div><div class="stat-label">Resolution Rate</div></div>
      <div class="stat-card"><div class="stat-num" data-count="24">0</div><div class="stat-label">Communities</div></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Simple Process</div><h2>How It Works</h2><p>From spotting a problem to seeing it fixed — in four simple steps.</p></div>
      <div class="steps-grid">
        <div class="step-card"><div class="step-num">01</div><div class="step-icon">👀</div><h3>Spot It</h3><p>See a problem in your neighborhood.</p></div>
        <div class="step-card"><div class="step-num">02</div><div class="step-icon">📷</div><h3>Report It</h3><p>Upload a photo and location.</p></div>
        <div class="step-card"><div class="step-num">03</div><div class="step-icon">📍</div><h3>Track It</h3><p>Follow the complaint status.</p></div>
        <div class="step-card"><div class="step-num">04</div><div class="step-icon">✅</div><h3>Fix It</h3><p>See the issue resolved.</p></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:#fff">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Categories</div><h2>What Can You Report?</h2><p>Select a category to start your report.</p></div>
      <div class="cat-grid">
        ${CATEGORIES.map(c=>`<a href="#/report-issue?cat=${c.id}" class="cat-card"><div class="cat-icon">${c.icon}</div><h4>${c.label}</h4></a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Live Map</div><h2>Community Issue Map</h2><p>See what's being reported near you right now.</p></div>
      <div id="map"></div>
      <div class="map-legend">
        <span><span class="legend-dot" style="background:var(--red)"></span>Critical / High</span>
        <span><span class="legend-dot" style="background:var(--yellow)"></span>Medium</span>
        <span><span class="legend-dot" style="background:var(--green)"></span>Resolved</span>
      </div>
    </div>
  </section>

  <section class="section" style="background:#fff">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Fresh Off the Feed</div><h2>Recent Issues</h2><p>The latest problems reported by your community.</p></div>
      <div class="issue-grid">
        ${recent.length ? recent.map(r=>issueCardHtml(r)).join('') : emptyStateHtml()}
      </div>
    </div>
  </section>

  ${resolvedForBA.length ? `
  <section class="section">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Real Results</div><h2>Before & After</h2><p>Reports that turned into real community impact.</p></div>
      <div class="ba-grid">
        ${resolvedForBA.map(r=>`
          <div class="ba-card">
            <div class="ba-images">
              <div class="ba-img ba-before">${catMeta(r.category).icon}<br>BEFORE</div>
              <div class="ba-img ba-after">✅<br>AFTER</div>
            </div>
            <div class="ba-body">
              <strong>${escapeHtml(r.title)}</strong>
              <p style="color:var(--gray);font-size:13px;margin-top:4px">📍 ${locText(r)}</p>
              <div style="margin-top:10px" class="pill pill-resolved">✅ Issue Resolved</div>
              <p style="margin-top:6px;font-size:12.5px;color:var(--gray)">Resolution time: 2 days</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <section class="section" style="background:#fff">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Impact</div><h2>Together, We Make a Difference</h2></div>
      <div class="stats-grid" style="margin-bottom:30px">
        <div class="stat-card"><div class="stat-num">1,284</div><div class="stat-label">Reports</div></div>
        <div class="stat-card"><div class="stat-num">814</div><div class="stat-label">Resolved</div></div>
        <div class="stat-card"><div class="stat-num">342</div><div class="stat-label">Active</div></div>
        <div class="stat-card"><div class="stat-num">128</div><div class="stat-label">Community Contributors</div></div>
      </div>
      <div class="card">
        <strong>Community Resolution Rate</strong>
        <div class="bar-track" style="margin-top:12px;height:14px"><div class="bar-fill" style="width:72%"></div></div>
        <div style="text-align:right;font-weight:700;color:var(--primary);margin-top:6px">72%</div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div class="eyebrow">Gamification</div><h2>Community Heroes 🏆</h2><p>Earn points by submitting useful reports and helping verify community issues.</p></div>
      <div class="heroes-list" style="max-width:560px;margin:0 auto">
        <div class="hero-row"><span class="hero-rank">🥇</span><span class="hero-avatar">A</span><span class="hero-name">Ali</span><span class="hero-pts">340 pts</span></div>
        <div class="hero-row"><span class="hero-rank">🥈</span><span class="hero-avatar">S</span><span class="hero-name">Sara</span><span class="hero-pts">280 pts</span></div>
        <div class="hero-row"><span class="hero-rank">🥉</span><span class="hero-avatar">A</span><span class="hero-name">Areej</span><span class="hero-pts">240 pts</span></div>
        <div class="hero-row"><span class="hero-rank">4</span><span class="hero-avatar">H</span><span class="hero-name">Hamza</span><span class="hero-pts">210 pts</span></div>
        <div class="hero-row"><span class="hero-rank">5</span><span class="hero-avatar">F</span><span class="hero-name">Fatima</span><span class="hero-pts">190 pts</span></div>
      </div>
    </div>
  </section>

  <div class="container">
    <section class="cta-section">
      <h2>Your street deserves a voice.</h2>
      <p>One report can start a change.</p>
      <div class="cta-actions">
        <a href="#/report-issue" class="btn btn-accent">📣 Report an Issue</a>
        <a href="#/community" class="btn btn-outline">Explore Community</a>
      </div>
    </section>
  </div>
  `;
}
function heroPins(){
  let pins = '';
  const colors = [getComputedCssVar('--red'), getComputedCssVar('--yellow'), getComputedCssVar('--green')];
  for(let i=0;i<7;i++){
    const top = 10+Math.random()*75, left = 8+Math.random()*80;
    pins += `<div class="hv-pin" style="top:${top}%;left:${left}%;background:${colors[i%3]}"></div>`;
  }
  return pins;
}
function getComputedCssVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#999'; }

function afterHome(){
  animateCounters();
  initLeafletMap('map', loadReports());
}
function animateCounters(){
  document.querySelectorAll('.stat-num[data-count]').forEach(el=>{
    const target = parseInt(el.getAttribute('data-count'),10);
    const suffix = el.getAttribute('data-suffix') || '';
    let cur = 0;
    const step = Math.max(1, Math.ceil(target/60));
    const timer = setInterval(()=>{
      cur += step;
      if(cur >= target){ cur = target; clearInterval(timer); }
      el.textContent = cur.toLocaleString() + suffix;
    }, 20);
  });
}

/* ===================== ISSUE CARD ===================== */
function issueCardHtml(r){
  const c = catMeta(r.category);
  return `
  <div class="issue-card">
    <div class="issue-img">${c.icon}</div>
    <div class="issue-body">
      <div class="issue-title">${c.icon} ${escapeHtml(r.title)}</div>
      <div class="issue-meta">📍 ${locText(r)}</div>
      <div class="issue-meta">🕒 ${timeAgo(r.createdAt)}</div>
      <div class="badge-row">
        <span class="pill pill-${r.priority}">${r.priority==='critical'?'🔴':r.priority==='high'?'🔴':r.priority==='medium'?'🟡':'🟢'} ${PRIORITY_LABEL[r.priority]} Priority</span>
        <span class="pill pill-${r.status}">${STATUS_LABEL[r.status]}</span>
      </div>
      <div class="issue-footer"><a href="#/report/${r.id}" class="btn btn-outline btn-sm btn-block">View Details</a></div>
    </div>
  </div>`;
}
function emptyStateHtml(){
  return `<div class="empty-state" style="grid-column:1/-1">
    <i>📭</i><h3>No reports yet.</h3>
    <p>Your community is quiet — but you can help by reporting an issue.</p>
    <br><a href="#/report-issue" class="btn btn-primary">Report an Issue</a>
  </div>`;
}

/* ===================== LEAFLET MAP ===================== */
/* ---------- Base map tiles (no API key required) ---------- */
function addBaseTiles(map){
  const primary = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution:'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, OpenStreetMap contributors',
    maxZoom:19, noWrap:true
  }).addTo(map);
  // Fallback if primary tiles repeatedly fail
  let errors = 0, switched = false;
  primary.on('tileerror', ()=>{
    errors++;
    if(errors > 6 && !switched){
      switched = true;
      map.removeLayer(primary);
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:'&copy; OpenStreetMap contributors, Tiles: HOT', maxZoom:19, noWrap:true
      }).addTo(map);
    }
  });
}


function initLeafletMap(elId, reports){
  const el = document.getElementById(elId);
  if(!el || typeof L === 'undefined') return;
  // Pakistan-only map: lock view to country bounds
  const PK_BOUNDS = L.latLngBounds([23.0, 60.0], [37.5, 77.9]);
  const map = L.map(elId, {
    scrollWheelZoom:false, minZoom:5, maxZoom:17,
    maxBounds: PK_BOUNDS, maxBoundsViscosity:1.0, worldCopyJump:false
  });
  map.fitBounds(L.latLngBounds([24.0, 61.0], [36.8, 75.8]));
  map.setMinZoom(map.getZoom());
  addBaseTiles(map);
  window.lastMap = map;
  setTimeout(()=> map.invalidateSize(), 100);

  reports.forEach(r=>{
    if(!r.lat || !r.lng) return;
    const color = r.status==='resolved' ? '#0E8F68' : (r.priority==='high'||r.priority==='critical' ? '#e5534b' : '#F4B942');
    const icon = L.divIcon({
      className:'', html:`<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
      iconSize:[16,16], iconAnchor:[8,16]
    });
    const marker = L.marker([r.lat, r.lng], {icon}).addTo(map);
    const c = catMeta(r.category);
    marker.bindPopup(`
      <div style="font-family:inherit;min-width:180px">
        <strong>${c.icon} ${escapeHtml(r.title)}</strong><br>
        <span style="font-size:12px;color:#666">${c.label} · ${locText(r)}</span><br>
        <span style="font-size:12px">${STATUS_LABEL[r.status]} · ${PRIORITY_LABEL[r.priority]}</span><br>
        <a href="#/report/${r.id}" style="color:#0B6B4F;font-weight:600;font-size:12.5px">View Report →</a>
      </div>
    `);
  });
}

/* ===================== REPORT FORM ===================== */
function renderReportForm(preCat){
  return `
  <section class="form-page">
    <div class="container form-wrap">
      <div class="page-header" style="padding:0 0 24px;text-align:center">
        <h1>Report a Community Issue</h1>
        <p>Your voice helps make your neighborhood better.</p>
      </div>
      <div class="form-card">
        <form id="report-form" novalidate>
          <div class="form-group">
            <label>Issue Category</label>
            <div class="cat-select-grid" id="cat-select" role="radiogroup" aria-label="Issue category">
              ${CATEGORIES.map(c=>`<div class="cat-opt" data-cat="${c.id}" role="radio" aria-checked="false" tabindex="0"><div class="cat-icon" aria-hidden="true">${c.icon}</div>${c.label}</div>`).join('')}
            </div>
            <div class="field-error" id="err-category">Please select a category.</div>
          </div>

          <div class="form-group">
            <label for="f-title">Issue Title</label>
            <input type="text" id="f-title" placeholder="e.g. Large pothole near main road" maxlength="80">
            <div class="field-error" id="err-title">Please enter a short title.</div>
          </div>

          <div class="form-group">
            <label for="f-desc">Description <span class="hint">— be specific, it helps us prioritize</span></label>
            <textarea id="f-desc" placeholder="Describe the issue in detail..."></textarea>
            <div class="field-error" id="err-desc">Please add a description.</div>
            <div class="smart-priority" id="smart-priority-box">
              <div class="sp-top">🤖 Smart Priority: <span id="sp-value" style="color:var(--primary)">—</span></div>
              <p id="sp-explain">This report may require faster attention because it could pose a safety risk.</p>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="f-area">City</label>
              <select id="f-area">
                <option value="">Select city</option>
                ${CITIES.map(c=>`<option value="${c}">${c}</option>`).join('')}
              </select>
              <div class="field-error" id="err-area">Please select a city.</div>
            </div>
            <div class="form-group">
              <label for="f-contact">Contact (optional)</label>
              <input type="text" id="f-contact" placeholder="Phone or email (optional)">
            </div>
          </div>

          <div class="form-group">
            <label for="f-locality">Area / Neighbourhood</label>
            <select id="f-locality" disabled><option value="">Select city first</option></select>
            <input type="text" id="f-locality-other" class="hidden" placeholder="Type your area / street" maxlength="60" style="margin-top:8px" aria-label="Your area or street">
            <div class="field-error" id="err-locality">Please select your area.</div>
          </div>

          <div class="form-group">
            <label>Location</label>
            <div class="loc-row">
              <button type="button" class="btn btn-outline btn-sm" id="btn-geo">📍 Use My Location</button>
              <span class="loc-coords" id="loc-coords"></span>
            </div>
            <div id="loc-map" style="height:200px;border-radius:12px;overflow:hidden;display:none"></div>
          </div>

          <div class="form-group">
            <label>Photo Upload <span class="hint">(optional)</span></label>
            <div class="upload-zone" id="upload-zone" role="button" tabindex="0" aria-label="Upload photo">
              <i aria-hidden="true">📷</i>
              <div><strong>Click to upload</strong> or drag and drop</div>
              <div class="hint">PNG, JPG up to ~2MB</div>
              <input type="file" id="f-photo" accept="image/*" class="hidden" aria-hidden="true">
            </div>
            <div class="preview-img hidden" id="preview-wrap"><img id="preview-img"></div>
          </div>

          <div class="form-group">
            <label>Severity</label>
            <div class="sev-grid" id="sev-select" role="radiogroup" aria-label="Issue severity">
              <div class="sev-opt" data-sev="low" role="radio" aria-checked="false" tabindex="0">🟢 Low</div>
              <div class="sev-opt" data-sev="medium" role="radio" aria-checked="false" tabindex="0">🟡 Medium</div>
              <div class="sev-opt" data-sev="high" role="radio" aria-checked="false" tabindex="0">🟠 High</div>
              <div class="sev-opt" data-sev="critical" role="radio" aria-checked="false" tabindex="0">🔴 Critical</div>
            </div>
            <div class="field-error" id="err-sev">Please select severity.</div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="margin-top:10px">Submit Report</button>
        </form>
      </div>
    </div>
  </section>

  <div class="modal-overlay hidden" id="success-modal">
    <div class="modal">
      <div class="big-icon">🎉</div>
      <h2>Report Submitted Successfully!</h2>
      <p style="color:var(--gray)">Your voice has been heard.</p>
      <div class="ticket" id="modal-ticket">AM-0000</div>
      <div class="pill pill-submitted" style="margin:0 auto">🟡 Submitted</div>
      <div class="modal-actions">
        <a href="#" class="btn btn-primary" id="btn-track">Track My Report</a>
        <a href="#/report-issue" class="btn btn-outline" id="btn-again">Report Another Issue</a>
      </div>
    </div>
  </div>
  `;
}

let formState = { category:null, severity:null, photo:null, lat:null, lng:null };

function afterForm(preCat){
  formState = { category:null, severity:null, photo:null, lat:null, lng:null };

  // Category select
  document.querySelectorAll('#cat-select .cat-opt').forEach(opt=>{
    const selectCat = ()=>{
      document.querySelectorAll('#cat-select .cat-opt').forEach(o=>{ o.classList.remove('selected'); o.setAttribute('aria-checked','false'); });
      opt.classList.add('selected'); opt.setAttribute('aria-checked','true');
      formState.category = opt.dataset.cat;
      clearFieldError('category');
      evaluateSmartPriority();
    };
    opt.addEventListener('click', selectCat);
    opt.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectCat(); } });
    if(preCat && opt.dataset.cat === preCat){ selectCat(); }
  });

  // Severity select
  document.querySelectorAll('#sev-select .sev-opt').forEach(opt=>{
    const selectSev = ()=>{
      document.querySelectorAll('#sev-select .sev-opt').forEach(o=>{ o.classList.remove('selected'); o.setAttribute('aria-checked','false'); });
      opt.classList.add('selected'); opt.setAttribute('aria-checked','true');
      formState.severity = opt.dataset.sev;
      clearFieldError('sev');
      evaluateSmartPriority();
    };
    opt.addEventListener('click', selectSev);
    opt.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectSev(); } });
  });

  // City -> neighbourhood options
  const citySel = document.getElementById('f-area'), locSel = document.getElementById('f-locality'), locOther = document.getElementById('f-locality-other');
  function fillLocalities(){
    const c = citySel.value;
    locSel.innerHTML = c
      ? '<option value="">Select area</option>' + (AREAS[c]||[]).map(a=>`<option value="${a}">${a}</option>`).join('') + '<option value="__other">Other…</option>'
      : '<option value="">Select city first</option>';
    locSel.disabled = !c; locOther.classList.add('hidden'); locOther.value = '';
  }
  citySel.addEventListener('change', fillLocalities);
  locSel.addEventListener('change', ()=>{ locOther.classList.toggle('hidden', locSel.value !== '__other'); clearFieldError('locality'); });
  fillLocalities();

  // Description -> smart priority live
  const descEl = document.getElementById('f-desc');
  descEl.addEventListener('input', evaluateSmartPriority);

  // Geolocation
  document.getElementById('btn-geo').addEventListener('click', ()=>{
    if(!navigator.geolocation){ toast('Geolocation not supported. Please select area manually.', '⚠️'); return; }
    navigator.geolocation.getCurrentPosition(pos=>{
      formState.lat = pos.coords.latitude; formState.lng = pos.coords.longitude;
      document.getElementById('loc-coords').textContent = `📍 ${formState.lat.toFixed(4)}, ${formState.lng.toFixed(4)}`;
      toast('Location detected.', '📍');
      const mapDiv = document.getElementById('loc-map');
      mapDiv.style.display='block'; mapDiv.innerHTML='';
      setTimeout(()=>{
        const m = L.map('loc-map', {maxBounds:L.latLngBounds([23.0,60.0],[37.5,77.9]), maxBoundsViscosity:1.0, minZoom:5}).setView([formState.lat, formState.lng], 15);
        addBaseTiles(m);
        L.marker([formState.lat, formState.lng]).addTo(m);
      }, 50);
    }, err=>{
      toast('Location permission denied. Please select your area manually.', '⚠️');
    });
  });

  // Photo upload
  const zone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('f-photo');
  zone.addEventListener('click', ()=> fileInput.click());
  zone.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fileInput.click(); } });
  ['dragover','dragenter'].forEach(ev=> zone.addEventListener(ev, e=>{ e.preventDefault(); zone.classList.add('drag'); }));
  ['dragleave','drop'].forEach(ev=> zone.addEventListener(ev, e=>{ e.preventDefault(); zone.classList.remove('drag'); }));
  zone.addEventListener('drop', e=>{ const f = e.dataTransfer.files[0]; if(f) handlePhoto(f); });
  fileInput.addEventListener('change', e=>{ if(e.target.files[0]) handlePhoto(e.target.files[0]); });

  function handlePhoto(file){
    if(!file.type.startsWith('image/')){ toast('Please upload a valid image.', '⚠️'); return; }
    if(file.size > 8 * 1024 * 1024){ toast('Image is too large. Please choose a file under 8MB.', '⚠️'); return; }
    const reader = new FileReader();
    reader.onload = (e)=>{
      compressImage(e.target.result, 900, 0.7, (dataUrl)=>{
        formState.photo = dataUrl;
        document.getElementById('preview-wrap').classList.remove('hidden');
        document.getElementById('preview-img').src = dataUrl;
      });
    };
    reader.onerror = ()=> toast('Could not read image file.', '⚠️');
    reader.readAsDataURL(file);
  }

  // Form submit
  document.getElementById('report-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;
    const title = document.getElementById('f-title').value.trim();
    const desc = document.getElementById('f-desc').value.trim();
    const area = document.getElementById('f-area').value;

    if(!formState.category){ showFieldError('category'); valid=false; } else clearFieldError('category');
    if(!title){ showFieldError('title'); valid=false; } else clearFieldError('title');
    if(!desc){ showFieldError('desc'); valid=false; } else clearFieldError('desc');
    if(!area){ showFieldError('area'); valid=false; } else clearFieldError('area');
    let locality = locSel.value === '__other' ? locOther.value.replace(/[<>"'&`]/g,'').replace(/\s+/g,' ').trim().slice(0,60) : locSel.value;
    if(!locality){ showFieldError('locality'); valid=false; } else clearFieldError('locality');
    if(!formState.severity){ showFieldError('sev'); valid=false; } else clearFieldError('sev');

    if(!valid){ toast('Please complete all required fields.', '⚠️'); return; }

    const priority = computeSmartPriority(formState.category, desc, formState.severity);
    const id = nextTicketId();
    const now = Date.now();
    const coords = (formState.lat && formState.lng) ? [formState.lat, formState.lng] : jitterCity(area);

    const report = {
      id, category: formState.category, title, description: desc,
      area, city: area, locality, lat: coords[0], lng: coords[1],
      priority, status:'submitted', photo: formState.photo,
      createdAt: now, updatedAt: now,
      timeline: buildTimelineFor('submitted', now),
      contact: document.getElementById('f-contact').value.trim()
    };
    addReport(report);

    // bump demo user points
    const user = loadUser(); user.points += 10; localStorage.setItem(DB.user, JSON.stringify(user));

    document.getElementById('modal-ticket').textContent = id;
    document.getElementById('btn-track').href = `#/report/${id}`;
    document.getElementById('success-modal').classList.remove('hidden');
    toast('Report submitted successfully.', '✅');
  });

  document.getElementById('success-modal').addEventListener('click', (e)=>{
    if(e.target.id === 'success-modal'){ document.getElementById('success-modal').classList.add('hidden'); }
  });
}
function jitterCity(city){
  const base = CITY_COORDS[city] || CITY_COORDS.Karachi;
  return [base[0] + (Math.random()-0.5)*0.03, base[1] + (Math.random()-0.5)*0.03];
}
function showFieldError(key){ const el = document.getElementById('err-'+key); if(el) el.classList.add('show');
  const input = {category:'cat-select', title:'f-title', desc:'f-desc', area:'f-area', locality:'f-locality', sev:'sev-select'}[key];
  const target = document.getElementById(input);
  if(target && target.tagName!=='DIV') target.classList.add('error');
}
function clearFieldError(key){ const el = document.getElementById('err-'+key); if(el) el.classList.remove('show');
  const input = {category:'cat-select', title:'f-title', desc:'f-desc', area:'f-area', locality:'f-locality', sev:'sev-select'}[key];
  const target = document.getElementById(input);
  if(target && target.tagName!=='DIV') target.classList.remove('error');
}
function evaluateSmartPriority(){
  const desc = document.getElementById('f-desc')?.value || '';
  const box = document.getElementById('smart-priority-box');
  if(!formState.category || !formState.severity){ box.classList.remove('show'); return; }
  const p = computeSmartPriority(formState.category, desc, formState.severity);
  box.classList.add('show');
  document.getElementById('sp-value').textContent = PRIORITY_LABEL[p].toUpperCase();
  document.getElementById('sp-explain').textContent = (p==='high'||p==='critical')
    ? 'This report may require faster attention because it could pose a safety risk.'
    : 'This report will be reviewed in the normal queue based on severity.';
}
function compressImage(dataUrl, maxWidth, quality, cb){
  const img = new Image();
  img.onload = ()=>{
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, maxWidth / img.width);
    canvas.width = img.width * scale; canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    cb(canvas.toDataURL('image/jpeg', quality));
  };
  img.onerror = ()=> cb(dataUrl);
  img.src = dataUrl;
}

/* ===================== MY REPORTS ===================== */
function renderMyReports(){
  const reports = loadReports().filter(r=>r.by==='me');
  const user = loadUser();
  return `
  <section class="page-header">
    <div class="container">
      <h1>My Reports</h1>
      <p>Welcome back, ${escapeHtml(user.name)} · ${escapeHtml(user.community)} · ⭐ ${user.points} points</p>
    </div>
  </section>
  <section class="section" style="padding-top:20px">
    <div class="container">
      <div class="issue-grid">
        ${reports.length ? reports.map(r=>issueCardHtml(r)).join('') : emptyStateHtml()}
      </div>
    </div>
  </section>`;
}
function afterMyReports(){}

/* ===================== REPORT DETAIL ===================== */
function renderReportDetail(id){
  const r = getReport(id);
  if(!r){
    return `<section class="section"><div class="container empty-state"><i>🔍</i><h3>Report not found</h3><p>This report may have been removed.</p><br><a href="#/community" class="btn btn-primary">Back to Community</a></div></section>`;
  }
  const c = catMeta(r.category);
  const etaMap = {submitted:'3-5 days', review:'2-4 days', assigned:'1-2 days', resolved:'Completed'};
  return `
  <section class="page-header">
    <div class="container">
      <a href="#/community" style="color:var(--primary);font-weight:600;font-size:14px">← Back to Community</a>
      <h1 style="margin-top:10px">${r.id}</h1>
      <div class="badge-row" style="margin-top:8px">
        <span class="pill pill-${r.status}">${STATUS_LABEL[r.status]}</span>
        <span class="pill pill-${r.priority}">${PRIORITY_LABEL[r.priority]} Priority</span>
      </div>
    </div>
  </section>
  <section class="section" style="padding-top:20px">
    <div class="container detail-grid">
      <div>
        <div class="card">
          <div class="issue-img" style="height:220px;border-radius:12px;margin-bottom:16px">
            ${r.photo ? `<img src="${r.photo}" style="width:100%;height:220px;object-fit:cover;border-radius:12px">` : c.icon}
          </div>
          <h2>${c.icon} ${escapeHtml(r.title)}</h2>
          <p style="color:var(--gray);margin:10px 0">${escapeHtml(r.description)}</p>
          <div class="issue-meta">📍 ${locText(r)}</div>
          <div class="issue-meta">🗂️ ${c.label}</div>
          <div class="issue-meta">🕒 Reported ${timeAgo(r.createdAt)} (${fmtDate(r.createdAt)})</div>
          <div class="issue-meta">⏱️ Estimated resolution: ${etaMap[r.status]}</div>
          ${r.contact ? `<div class="issue-meta">☎️ ${escapeHtml(r.contact)}</div>` : ''}
        </div>
      </div>
      <div>
        <div class="card">
          <strong>Status Timeline</strong>
          <ul class="timeline" style="margin-top:14px">
            ${r.timeline.map(t=>`
              <li>
                <div class="tl-dot ${t.done?'done':''}">${t.done?'✓':'○'}</div>
                <div class="tl-text"><strong>${t.label}</strong><span>${t.done ? fmtDate(t.time) : 'Pending'}</span></div>
              </li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;
}
function afterDetail(id){}

/* ===================== COMMUNITY PAGE ===================== */
let communityFilters = { cat:'all', status:'all', priority:'all', q:'' };

function renderCommunity(){
  return `
  <section class="page-header">
    <div class="container">
      <h1>Community Issues</h1>
      <p>See what your community is reporting.</p>
    </div>
  </section>
  <section class="section" style="padding-top:20px">
    <div class="container">
      <div class="filters-bar">
        <div class="search-box"><i>🔎</i><input type="text" id="search-input" placeholder="Search by issue or location..." aria-label="Search community issues"></div>
        <select class="filter-select" id="filter-cat" aria-label="Filter by category">
          <option value="all">All Categories</option>
          ${CATEGORIES.map(c=>`<option value="${c.id}">${c.label}</option>`).join('')}
        </select>
        <select class="filter-select" id="filter-status" aria-label="Filter by status">
          <option value="all">All Status</option>
          <option value="submitted">New</option>
          <option value="review">Under Review</option>
          <option value="assigned">Assigned</option>
          <option value="resolved">Resolved</option>
        </select>
        <select class="filter-select" id="filter-priority" aria-label="Filter by priority">
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div id="map" style="margin-bottom:30px"></div>
      <div class="map-legend" style="margin-bottom:30px">
        <span><span class="legend-dot" style="background:var(--red)"></span>Critical / High</span>
        <span><span class="legend-dot" style="background:var(--yellow)"></span>Medium</span>
        <span><span class="legend-dot" style="background:var(--green)"></span>Resolved</span>
      </div>
      <div class="issue-grid" id="community-grid"></div>
    </div>
  </section>`;
}
function afterCommunity(){
  initLeafletMap('map', loadReports());
  renderCommunityGrid();
  document.getElementById('search-input').addEventListener('input', e=>{ communityFilters.q = e.target.value.toLowerCase(); renderCommunityGrid(); });
  document.getElementById('filter-cat').addEventListener('change', e=>{ communityFilters.cat = e.target.value; renderCommunityGrid(); });
  document.getElementById('filter-status').addEventListener('change', e=>{ communityFilters.status = e.target.value; renderCommunityGrid(); });
  document.getElementById('filter-priority').addEventListener('change', e=>{ communityFilters.priority = e.target.value; renderCommunityGrid(); });
}
function renderCommunityGrid(){
  let list = loadReports();
  if(communityFilters.cat !== 'all') list = list.filter(r=>r.category===communityFilters.cat);
  if(communityFilters.status !== 'all') list = list.filter(r=>r.status===communityFilters.status);
  if(communityFilters.priority !== 'all') list = list.filter(r=>r.priority===communityFilters.priority);
  if(communityFilters.q) list = list.filter(r=> (r.title+' '+r.area+' '+(r.locality||'')+' '+r.description).toLowerCase().includes(communityFilters.q));
  const grid = document.getElementById('community-grid');
  grid.innerHTML = list.length ? list.map(r=>issueCardHtml(r)).join('') : emptyStateHtml();
}
