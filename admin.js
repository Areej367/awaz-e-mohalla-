/* ===================== ADMIN DASHBOARD ===================== */
const ADMIN_EMAIL = 'admin@awazemohalla.pk';
const ADMIN_PASS = 'admin123';

document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  const loggedIn = sessionStorage.getItem('awaz_admin_session');
  if(loggedIn){ showAdminApp(); } else { showLogin(); }

  document.getElementById('login-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    if(email === ADMIN_EMAIL && pass === ADMIN_PASS){
      sessionStorage.setItem('awaz_admin_session', '1');
      showAdminApp();
    } else {
      toast('Invalid credentials. Use the demo login shown below.', '⚠️');
    }
  });

  document.getElementById('logout-btn').addEventListener('click', ()=>{
    sessionStorage.removeItem('awaz_admin_session');
    showLogin();
  });
});

function showLogin(){
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-app').classList.add('hidden');
}
function showAdminApp(){
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-app').classList.remove('hidden');
  window.addEventListener('hashchange', adminRouter);
  document.querySelectorAll('#admin-nav a').forEach(a=>{
    a.addEventListener('click', ()=>{
      document.querySelectorAll('#admin-nav a').forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
    });
  });
  adminRouter();
}

function adminRouter(){
  const view = (location.hash || '#overview').replace('#','');
  const main = document.getElementById('admin-main');
  if(view === 'reports') main.innerHTML = renderAdminReports();
  else if(view === 'map') main.innerHTML = renderAdminMap();
  else if(view === 'users') main.innerHTML = renderAdminUsers();
  else if(view === 'analytics') main.innerHTML = renderAdminAnalytics();
  else if(view === 'settings') main.innerHTML = renderAdminSettings();
  else main.innerHTML = renderAdminOverview();

  afterAdminRender(view);
}

function afterAdminRender(view){
  if(view === 'reports') bindReportsTable();
  else if(view === 'map') initLeafletMap('admin-map', filteredAdminReports(adminMapFilter));
  else if(view === 'settings') bindSettingsPage();
  else bindOverviewTable(); // overview (default)
}

/* ---------- OVERVIEW ---------- */
function renderAdminOverview(){
  const reports = loadReports();
  const counts = countByStatus(reports);
  const recent = [...reports].sort((a,b)=>b.createdAt-a.createdAt).slice(0,6);
  return `
    <div class="admin-top"><h1>Good Evening, Admin 👋</h1></div>
    <div class="admin-stats">
      ${statCard('Total Reports', reports.length)}
      ${statCard('Pending', counts.submitted + counts.review)}
      ${statCard('In Progress', counts.assigned)}
      ${statCard('Resolved', counts.resolved)}
    </div>
    <div class="card">
      <strong>Recent Reports</strong>
      <table class="admin-table" style="margin-top:14px">
        <thead><tr><th>Ticket</th><th>Issue</th><th>Location</th><th>Priority</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody id="overview-tbody">
          ${recent.map(r=>adminRowHtml(r)).join('')}
        </tbody>
      </table>
    </div>`;
}
function bindOverviewTable(){ bindStatusSelectHandlers('overview-tbody'); }

function statCard(label, num){
  return `<div class="stat-card"><div class="stat-num">${num.toLocaleString()}</div><div class="stat-label">${label}</div></div>`;
}
function countByStatus(reports){
  const c = {submitted:0, review:0, assigned:0, resolved:0};
  reports.forEach(r=> c[r.status] = (c[r.status]||0)+1 );
  return c;
}

/* ---------- REPORTS MANAGEMENT ---------- */
let adminReportFilter = {status:'all', q:''};

function renderAdminReports(){
  return `
    <div class="admin-top"><h1>Reports</h1></div>
    <div class="filters-bar">
      <div class="search-box"><i>🔎</i><input type="text" id="admin-search" placeholder="Search ticket, title, location..." aria-label="Search reports"></div>
      <select class="filter-select" id="admin-status-filter" aria-label="Filter reports by status">
        <option value="all">All Status</option>
        <option value="submitted">Submitted</option>
        <option value="review">Under Review</option>
        <option value="assigned">Assigned</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
    <div class="card" style="padding:0;overflow-x:auto">
      <table class="admin-table">
        <thead><tr><th>Ticket</th><th>Issue</th><th>Location</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody id="admin-reports-tbody"></tbody>
      </table>
    </div>`;
}
function bindReportsTable(){
  renderAdminReportsTable();
  document.getElementById('admin-search').addEventListener('input', e=>{ adminReportFilter.q = e.target.value.toLowerCase(); renderAdminReportsTable(); });
  document.getElementById('admin-status-filter').addEventListener('change', e=>{ adminReportFilter.status = e.target.value; renderAdminReportsTable(); });
}
function renderAdminReportsTable(){
  let list = loadReports();
  if(adminReportFilter.status !== 'all') list = list.filter(r=>r.status===adminReportFilter.status);
  if(adminReportFilter.q) list = list.filter(r=> (r.id+' '+r.title+' '+r.area+' '+(r.locality||'')).toLowerCase().includes(adminReportFilter.q));
  const tbody = document.getElementById('admin-reports-tbody');
  tbody.innerHTML = list.length ? list.map(r=>adminRowHtml(r)).join('') : `<tr><td colspan="7"><div class="empty-state"><i>📭</i><h3>No reports found</h3><p>Try adjusting your filters.</p></div></td></tr>`;
  bindStatusSelectHandlers('admin-reports-tbody');
}
function adminRowHtml(r){
  const c = catMeta(r.category);
  return `
  <tr data-id="${r.id}">
    <td><strong>${r.id}</strong></td>
    <td>${c.icon} ${escapeHtml(r.title)}</td>
    <td>📍 ${locText(r)}</td>
    <td><select class="status-select priority-select" data-id="${r.id}">
      ${['low','medium','high','critical'].map(p=>`<option value="${p}" ${p===r.priority?'selected':''}>${PRIORITY_LABEL[p]}</option>`).join('')}
    </select></td>
    <td><select class="status-select status-change" data-id="${r.id}">
      ${STATUS_FLOW.map(s=>`<option value="${s}" ${s===r.status?'selected':''}>${STATUS_LABEL[s].replace(/^[^ ]+ /,'')}</option>`).join('')}
    </select></td>
    <td>${fmtDate(r.createdAt)}</td>
    <td><a href="index.html?admin=1#/report/${r.id}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">View</a></td>
  </tr>`;
}
function bindStatusSelectHandlers(tbodyId){
  const tbody = document.getElementById(tbodyId);
  if(!tbody) return;
  tbody.querySelectorAll('.status-change').forEach(sel=>{
    sel.addEventListener('change', (e)=>{
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      const r = getReport(id);
      if(!r) return;
      const now = Date.now();
      const timeline = buildTimelineFor(newStatus, r.createdAt);
      // preserve actual transition times where possible, just mark done up to new status with "now" for the newest step
      const idx = STATUS_FLOW.indexOf(newStatus);
      timeline.forEach((t,i)=>{ if(i===idx) t.time = now; });
      updateReport(id, {status:newStatus, updatedAt:now, timeline});
      toast(`Report ${id} updated successfully.`, '🔔');
    });
  });
  tbody.querySelectorAll('.priority-select').forEach(sel=>{
    sel.addEventListener('change', (e)=>{
      const id = e.target.dataset.id;
      updateReport(id, {priority:e.target.value, updatedAt:Date.now()});
      toast(`Priority for ${id} updated.`, '🔔');
    });
  });
}

/* ---------- MAP ---------- */
let adminMapFilter = 'all';
function renderAdminMap(){
  return `
    <div class="admin-top"><h1>Report Map</h1></div>
    <div class="chip-row">
      <div class="chip active" data-f="all">All</div>
      <div class="chip" data-f="high">High Priority</div>
      <div class="chip" data-f="pending">Pending</div>
      <div class="chip" data-f="resolved">Resolved</div>
    </div>
    <div id="admin-map"></div>`;
}
function filteredAdminReports(filter){
  let list = loadReports();
  if(filter==='high') list = list.filter(r=>r.priority==='high'||r.priority==='critical');
  if(filter==='pending') list = list.filter(r=>r.status!=='resolved');
  if(filter==='resolved') list = list.filter(r=>r.status==='resolved');
  return list;
}
document.addEventListener('click', (e)=>{
  if(e.target.classList && e.target.classList.contains('chip') && e.target.dataset.f){
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    e.target.classList.add('active');
    adminMapFilter = e.target.dataset.f;
    const mapEl = document.getElementById('admin-map');
    if(mapEl){ mapEl.innerHTML=''; setTimeout(()=> initLeafletMap('admin-map', filteredAdminReports(adminMapFilter)), 30); }
  }
});

/* ---------- USERS ---------- */
function renderAdminUsers(){
  const users = [
    {name:'Ali', community:'Lahore', points:340, reports:12},
    {name:'Sara', community:'Karachi', points:280, reports:9},
    {name:'Areej', community:'Jamshoro', points:240, reports:8},
    {name:'Hamza', community:'Islamabad', points:210, reports:7},
    {name:'Fatima', community:'Multan', points:190, reports:6}
  ];
  return `
    <div class="admin-top"><h1>Users</h1></div>
    <div class="card" style="padding:0;overflow-x:auto">
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Community</th><th>Reports Filed</th><th>Points</th></tr></thead>
        <tbody>${users.map(u=>`<tr><td><strong>${u.name}</strong></td><td>📍 ${u.community}</td><td>${u.reports}</td><td>⭐ ${u.points}</td></tr>`).join('')}</tbody>
      </table>
    </div>`;
}

/* ---------- ANALYTICS ---------- */
function renderAdminAnalytics(){
  const reports = loadReports();
  const catCounts = {};
  reports.forEach(r=> catCounts[r.category] = (catCounts[r.category]||0)+1 );
  const total = reports.length || 1;
  const catRows = CATEGORIES.map(c=>({label:c.label, icon:c.icon, pct: Math.round(((catCounts[c.id]||0)/total)*100)}))
    .sort((a,b)=>b.pct-a.pct).filter(r=>r.pct>0);

  const statusCounts = countByStatus(reports);
  const statusRows = [
    {label:'Resolved', val: statusCounts.resolved, color:'#0E8F68'},
    {label:'In Progress', val: statusCounts.assigned, color:'#F4B942'},
    {label:'Pending', val: statusCounts.submitted + statusCounts.review, color:'#3b82c4'}
  ];
  const statusTotal = statusRows.reduce((s,r)=>s+r.val,0) || 1;

  return `
    <div class="admin-top"><h1>Analytics</h1></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <strong>Reports by Category</strong>
        <div class="bar-chart" style="margin-top:16px">
          ${catRows.map(r=>`
            <div class="bar-row">
              <span>${r.icon} ${r.label}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${r.pct}%"></div></div>
              <span>${r.pct}%</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <strong>Reports by Status</strong>
        <div class="bar-chart" style="margin-top:16px">
          ${statusRows.map(r=>`
            <div class="bar-row">
              <span>${r.label}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${Math.round((r.val/statusTotal)*100)}%;background:${r.color}"></div></div>
              <span>${r.val}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ---------- SETTINGS ---------- */
function renderAdminSettings(){
  return `
    <div class="admin-top"><h1>Settings</h1></div>
    <div class="card" style="max-width:520px">
      <div class="form-group"><label>Admin Email</label><input type="text" value="${ADMIN_EMAIL}" disabled></div>
      <div class="form-group"><label>Organization</label><input type="text" value="Awaz-e-Mohalla Civic Platform" disabled></div>
      <p class="hint" style="margin-top:10px">⚠️ This is a hackathon demo. Settings are not persisted and this login is not production-secure.</p>
      <button class="btn btn-outline btn-sm" id="reset-demo-btn" style="margin-top:14px">Reset Demo Data</button>
    </div>`;
}
function bindSettingsPage(){
  const btn = document.getElementById('reset-demo-btn');
  if(btn) btn.addEventListener('click', ()=>{
    if(confirm('This will clear all reports and your profile, and restore the original sample data. The welcome popup will appear again. Continue?')){
      localStorage.removeItem(DB.reports);
      localStorage.removeItem(DB.init);
      ['awaz_profile','awaz_user','awaz_voted'].forEach(k=>localStorage.removeItem(k));
      sessionStorage.removeItem('awaz_session');
      location.reload();
    }
  });
}
