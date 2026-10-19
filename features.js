/* ===== Awaz-e-Mohalla extra features ===== */
const UR={'Home':'ہوم','Report Issue':'مسئلہ رپورٹ کریں','Community':'کمیونٹی','My Reports':'میری رپورٹس','Dashboard':'ڈیش بورڈ','Report an Issue':'مسئلہ رپورٹ کریں','Explore Community Issues':'کمیونٹی کے مسائل دیکھیں','Explore Community':'کمیونٹی دیکھیں','Your Neighborhood.':'آپ کا محلہ۔','Your':'آپ کی','Voice.':'آواز۔','Your Report.':'آپ کی رپورٹ۔','How It Works':'یہ کیسے کام کرتا ہے','What Can You Report?':'آپ کیا رپورٹ کر سکتے ہیں؟','Community Issue Map':'کمیونٹی مسائل کا نقشہ','Recent Issues':'حالیہ مسائل','Before & After':'پہلے اور بعد میں','Together, We Make a Difference':'مل کر ہم فرق لاتے ہیں','Community Heroes':'کمیونٹی ہیروز','Your street deserves a voice.':'آپ کی گلی کی بھی آواز ہونی چاہیے۔','One report can start a change.':'ایک رپورٹ تبدیلی شروع کر سکتی ہے۔','Report a Community Issue':'کمیونٹی کا مسئلہ رپورٹ کریں','Issue Category':'مسئلے کی قسم','Issue Title':'مسئلے کا عنوان','Description':'تفصیل','Area / City':'علاقہ / شہر','Location':'مقام','Use My Location':'میرا مقام استعمال کریں','Photo Upload':'تصویر اپ لوڈ کریں','Severity':'شدت','Submit Report':'رپورٹ جمع کریں','Low':'کم','Medium':'درمیانہ','High':'زیادہ','Critical':'نازک','Pothole':'گڑھا','Garbage':'کچرا','Streetlight':'اسٹریٹ لائٹ','Water Leakage':'پانی کا رساؤ','Road Damage':'سڑک کو نقصان','Drainage / Flooding':'نکاسی / سیلاب','Open Manhole':'کھلا مین ہول','Other':'دیگر','Community Issues':'کمیونٹی کے مسائل','See what your community is reporting.':'دیکھیں آپ کی کمیونٹی کیا رپورٹ کر رہی ہے۔','View Details':'تفصیل دیکھیں','Reports Submitted':'جمع شدہ رپورٹس','Issues Resolved':'حل شدہ مسائل','Resolution Rate':'حل کی شرح','Communities':'کمیونٹیز','Spot It':'دیکھیں','Report It':'رپورٹ کریں','Track It':'ٹریک کریں','Fix It':'حل کریں','Status Timeline':'حالت کی ٹائم لائن','Report Submitted':'رپورٹ جمع ہو گئی','Under Review':'زیرِ جائزہ','Assigned to Local Team':'مقامی ٹیم کو تفویض','Resolved':'حل شدہ','Submitted':'جمع شدہ','Assigned':'تفویض','Track a report':'رپورٹ ٹریک کریں','Track':'ٹریک','I see this too':'مجھے بھی یہ نظر آتا ہے','Share on WhatsApp':'واٹس ایپ پر شیئر کریں','Confirm fixed':'حل کی تصدیق کریں','Still broken':'ابھی بھی خراب ہے','Emergency? Call Rescue 1122 or Police 15':'ایمرجنسی؟ ریسکیو 1122 یا پولیس 15 پر کال کریں'};
let LANG=localStorage.getItem('awaz_lang')||'en';
const $=s=>document.querySelector(s);
const tr=(en)=>LANG==='ur'&&UR[en]?UR[en]:en;

/* ---------- Language toggle + translation walker ---------- */
function translateTree(root){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){
    if(n.parentNode&&/SCRIPT|STYLE/.test(n.parentNode.nodeName))continue;
    if(n._o===undefined)n._o=n.nodeValue;
    const m=n._o.match(/^([\s\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B50\u2B06\uFE0F\u200D]*)(.*?)([\s\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B50\uFE0F\u200D]*)$/su);
    if(!m||!m[2])continue;
    const u=LANG==='ur'?urText(m[2].trim()):null;
    const next=u?m[1]+u+m[3]:n._o;
    if(n.nodeValue!==next)n.nodeValue=next;
  }
}
const MON={Jan:'جنوری',Feb:'فروری',Mar:'مارچ',Apr:'اپریل',May:'مئی',Jun:'جون',Jul:'جولائی',Aug:'اگست',Sep:'ستمبر',Oct:'اکتوبر',Nov:'نومبر',Dec:'دسمبر'};
const RULES=[[/(\d+) min ago/g,'$1 منٹ پہلے'],[/(\d+) hours? ago/g,'$1 گھنٹے پہلے'],[/(\d+) days? ago/g,'$1 دن پہلے'],[/just now/g,'ابھی ابھی'],
[/^Reported /,'رپورٹ کیا گیا: '],[/(Low|Medium|High|Critical) Priority/g,(a,b)=>UR[b]+' ترجیح'],[/ · (Critical|High|Medium|Low)$/,(a,b)=>' · '+UR[b]],
[/(\d+) Reports Tracked/,'$1 رپورٹس ٹریک شدہ'],[/I see this too \((\d+)\)/,'مجھے بھی نظر آتا ہے ($1)'],[/Estimated resolution: /,'متوقع حل: '],[/(\d+)-(\d+) days/,'$1-$2 دن'],[/Completed/,'مکمل'],
[/(\d+) similar open reports? in (\w+)/,(a,n,c)=>n+' ملتی جلتی کھلی رپورٹس — '+(UR[c]||c)],[/(\d+) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,(a,d,mo)=>d+' '+MON[mo]],[/Welcome back, (.+?) · (.+?) · ⭐ (\d+) points/,(a,u,c,p)=>'خوش آمدید، '+(UR[u]||u)+' · '+(UR[c]||c)+' · ⭐ '+p+' پوائنٹس'],[/Verified! (AM-\d+) priority raised to (\w+)\./,'$1']];
function urText(c){
  if(UR[c])return UR[c];
  let x=c;RULES.forEach(([re,fn])=>{x=x.replace(re,fn);});
  return x!==c?x:null;
}
function translateAttrs(root){
  root.querySelectorAll('[placeholder]').forEach(el=>{
    if(el._ph===undefined)el._ph=el.getAttribute('placeholder');
    const t=LANG==='ur'&&UR[el._ph]?UR[el._ph]:el._ph;if(el.getAttribute('placeholder')!==t)el.setAttribute('placeholder',t);
  });
}
function applyLang(){
  document.documentElement.lang=LANG==='ur'?'ur':'en';
  document.documentElement.dir=LANG==='ur'?'rtl':'ltr';
  document.body.classList.toggle('lang-ur',LANG==='ur');
  const b=$('#lang-btn');if(b)b.textContent=LANG==='ur'?'EN':'اردو';
}
function setLang(l){LANG=l;localStorage.setItem('awaz_lang',l);applyLang();enhance(true);}
function injectLangBtn(){
  if($('#lang-btn'))return;
  const host=$('.nav-right')||$('.admin-top')||document.body;
  const b=document.createElement('button');b.id='lang-btn';b.className='btn btn-outline btn-sm';b.type='button';
  b.setAttribute('aria-label','Switch language');b.textContent=LANG==='ur'?'EN':'اردو';
  b.addEventListener('click',()=>setLang(LANG==='ur'?'en':'ur'));
  host.insertBefore(b,host.firstChild);
}

/* ---------- Geo + duplicates + Me Too ---------- */
function km(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,dl=r(c-a),dn=r(d-b);const h=Math.sin(dl/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
const RANK=['low','medium','high','critical'];
function voted(){try{return JSON.parse(localStorage.getItem('awaz_voted')||'[]')}catch(e){return[]}}
function meToo(id){
  const v=voted();if(v.includes(id)){toast('You already verified this issue.','ℹ️');return;}
  const r=getReport(id);if(!r)return;
  const votes=(r.votes||0)+1;let pr=r.priority,bumped=false;
  if(votes>=3&&RANK.indexOf(pr)<2){pr=RANK[RANK.indexOf(pr)+1];bumped=true;}
  updateReport(id,{votes,priority:pr});v.push(id);localStorage.setItem('awaz_voted',JSON.stringify(v));
  const u=loadUser();u.points+=5;localStorage.setItem(DB.user,JSON.stringify(u));
  toast(bumped?`Verified! ${id} priority raised to ${PRIORITY_LABEL[pr]}.`:`Thanks! ${votes} neighbors confirm ${id}.`,'🙌');
  if(location.hash.startsWith('#/report/'))router();else checkDup();
}
function checkDup(){
  const box=$('#dup-box');if(!box||typeof formState==='undefined')return;
  const area=$('#f-area')?.value;
  if(!formState.category||!area){box.classList.add('hidden');return;}
  const hits=loadReports().filter(r=>r.status!=='resolved'&&r.category===formState.category&&
    (r.area===area||(formState.lat&&r.lat&&km(formState.lat,formState.lng,r.lat,r.lng)<0.2))).slice(0,3);
  if(!hits.length){box.classList.add('hidden');return;}
  box.classList.remove('hidden');
  box.innerHTML=`<strong>👀 ${hits.length} similar open report${hits.length>1?'s':''} in ${area}</strong>`+hits.map(r=>
    `<div class="dup-row"><span>${r.id} · ${escapeHtml(r.title)} · 👍 ${r.votes||0}</span><button type="button" class="btn btn-outline btn-sm" data-me="${r.id}">I see this too</button></div>`).join('')+
    `<small>Same problem? Verify it instead of filing a duplicate — more verifications raise priority.</small>`;
  box.querySelectorAll('[data-me]').forEach(b=>b.addEventListener('click',()=>{meToo(b.dataset.me);}));
  translateTree(box);
}

/* ---------- Page enhancers ---------- */
function enhance(force){
  const app=$('#app');
  if(app){
    // Home: tracker box
    const ha=$('.hero-actions');
    if(ha&&!$('#track-box')){
      const d=document.createElement('form');d.id='track-box';d.className='track-box';
      d.innerHTML='<input type="text" id="track-in" placeholder="AM-1001" aria-label="Ticket ID" maxlength="10"><button class="btn btn-accent btn-sm" type="submit">Track a report</button>';
      d.addEventListener('submit',e=>{e.preventDefault();let id=$('#track-in').value.trim().toUpperCase();if(/^\d+$/.test(id))id='AM-'+id;
        if(getReport(id))location.hash='#/report/'+id;else toast('No report found with that ticket ID.','⚠️');});
      ha.after(d);
    }
    // Form: duplicate box
    const desc=$('#f-desc');
    if(desc&&!$('#dup-box')){

      const box=document.createElement('div');box.id='dup-box';box.className='dup-box hidden';$('#smart-priority-box').after(box);
    }
    // Detail: me-too, whatsapp, emergency, confirm
    const m=location.hash.match(/^#\/report\/(AM-\d+)/);
    const card=$('.detail-grid .card');
    if(m&&card&&!$('#xtra')){
      const r=getReport(m[1]);if(r){
        const url=location.href.split('#')[0]+'#/report/'+r.id;
        const msg=encodeURIComponent(`${r.id}: ${r.title} (${r.area}) — track it on Awaz-e-Mohalla: ${url}`);
        const x=document.createElement('div');x.id='xtra';x.className='xtra';
        x.innerHTML=`${r.priority==='critical'?'<div class="emerg">🚨 Emergency? Call Rescue 1122 or Police 15</div>':''}
        <div class="xrow"><button class="btn btn-primary btn-sm" id="x-me">👍 I see this too (${r.votes||0})</button>
        <a class="btn btn-accent btn-sm" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${msg}">Share on WhatsApp</a></div>
        ${r.status==='resolved'?(r.confirmed?`<div class="pill pill-resolved">✅ Fix confirmed by citizen: ${r.confirmed==='yes'?'Resolved':'Still broken'}</div>`:'<div class="xrow"><button class="btn btn-outline btn-sm" id="x-yes">Confirm fixed</button><button class="btn btn-outline btn-sm" id="x-no">Still broken</button></div>'):''}`;
        card.appendChild(x);
        $('#x-me').addEventListener('click',()=>meToo(r.id));
        const cf=v=>()=>{updateReport(r.id,v==='yes'?{confirmed:'yes'}:{confirmed:'no',status:'review',timeline:buildTimelineFor('review',r.createdAt)});
          toast(v==='yes'?'Thanks for confirming! 🎉':'Reopened for review.','🔔');router();};
        $('#x-yes')&&$('#x-yes').addEventListener('click',cf('yes'));$('#x-no')&&$('#x-no').addEventListener('click',cf('no'));
      }
    }
  }
  const nav=$('#admin-nav');
  if(nav&&!$('#nav-score')){const a=document.createElement('a');a.id='nav-score';a.href='#scorecard';a.dataset.view='scorecard';a.textContent='🏛️ Scorecard';nav.insertBefore(a,nav.children[4]);}
  injectLangBtn();translateTree(document.body);translateAttrs(document.body);
}
let _t=0;
new MutationObserver(()=>{cancelAnimationFrame(_t);_t=requestAnimationFrame(()=>enhance());}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('input',e=>{if(e.target.id==='f-desc')checkDup();});
document.addEventListener('change',e=>{if(e.target.id==='f-area')checkDup();});
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#cat-select'))setTimeout(checkDup,30);});

/* ---------- Admin: Accountability Scorecard ---------- */
function scoreHtml(){
  const rs=loadReports(),by={};
  rs.forEach(r=>{const c=by[r.area]=by[r.area]||{t:0,res:0,hrs:[],over:0};c.t++;
    if(r.status==='resolved'){c.res++;const t=(r.timeline||[]).find(s=>s.key==='resolved');if(t)c.hrs.push((t.time-r.createdAt)/3.6e6);}
    else{const age=(Date.now()-r.createdAt)/3.6e6;if(age>(['high','critical'].includes(r.priority)?48:72))c.over++;}});
  const rows=Object.keys(by).sort((a,b)=>by[b].over-by[a].over).map(k=>{const c=by[k],avg=c.hrs.length?Math.round(c.hrs.reduce((a,b)=>a+b,0)/c.hrs.length):'—',rate=Math.round(c.res/c.t*100);
    return `<tr><td><strong>📍 ${k}</strong></td><td>${c.t}</td><td>${rate}%<div class="bar-track"><div class="bar-fill" style="width:${rate}%"></div></div></td><td>${avg}${avg==='—'?'':' h'}</td><td>${c.over?`<span class="pill pill-critical">⚠️ ${c.over} overdue</span>`:'<span class="pill pill-resolved">On track</span>'}</td></tr>`}).join('');
  return `<div class="admin-top"><h1>Accountability Scorecard</h1><button class="btn btn-outline btn-sm" id="csv-btn">⬇ Export CSV</button></div>
  <p style="color:var(--gray);margin-bottom:16px">Overdue = unresolved for 72h (48h for High/Critical). Public transparency by area.</p>
  <div class="card" style="padding:0;overflow-x:auto"><table class="admin-table"><thead><tr><th>Area</th><th>Reports</th><th>Resolution rate</th><th>Avg. fix time</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
if(typeof adminRouter==='function'){
  const _ar=adminRouter;
  adminRouter=function(){
    if((location.hash||'')==='#scorecard'){
      document.querySelectorAll('#admin-nav a').forEach(a=>a.classList.toggle('active',a.id==='nav-score'));
      $('#admin-main').innerHTML=scoreHtml();
      $('#csv-btn').addEventListener('click',()=>{
        const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
        const csv=['id,title,category,area,priority,status,votes,created'].concat(loadReports().map(r=>[r.id,r.title,r.category,r.area,r.priority,r.status,r.votes||0,new Date(r.createdAt).toISOString()].map(q).join(','))).join('\n');
        const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='awaz-reports.csv';a.click();toast('CSV exported.','⬇');
      });
    } else _ar();
  };
}
/* ---------- PWA ---------- */
if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
document.addEventListener('DOMContentLoaded',()=>{applyLang();enhance();});

/* ===== v2: dark mode, flood mode, badges, heatmap ===== */
Object.assign(UR,{'Monsoon Alert: drainage & flooding reports get priority.':'مون سون الرٹ: نکاسی اور سیلاب کی رپورٹس کو ترجیح دی جاتی ہے۔','Heatmap':'ہیٹ میپ','Your Badges':'آپ کے بیجز','First Report':'پہلی رپورٹ','Active Reporter':'متحرک رپورٹر','Verifier':'تصدیق کنندہ','Safety Spotter':'حفاظتی نگران','Community Hero':'کمیونٹی ہیرو'});
const floodOn=()=>{const v=localStorage.getItem('awaz_flood'),m=new Date().getMonth();return v==='on'||(v!=='off'&&m>=5&&m<=8);};
const _csp=computeSmartPriority;
computeSmartPriority=function(c,d,s){let p=_csp(c,d,s);if(floodOn()&&(c==='drainage'||c==='water'))p=RANK[Math.max(RANK.indexOf(p),2)];return p;};
const _add=addReport;
addReport=function(r){r.by='me';return _add(r);};

function badgesHtml(){
  const mine=loadReports().filter(r=>r.by==='me'),u=loadUser(),v=voted().length;
  const B=[['🥇','First Report',mine.length>=1,'File your first report'],['📣','Active Reporter',mine.length>=3,'File 3 reports'],['🙌','Verifier',v>=3,'Verify 3 issues'],['🛡️','Safety Spotter',mine.some(r=>['high','critical'].includes(r.priority)),'Report a high-priority issue'],['🏆','Community Hero',u.points>=250,'Reach 250 points']];
  return `<strong>Your Badges</strong><div class="badge-list">${B.map(b=>`<span class="bdg ${b[2]?'on':''}" title="${b[3]}${b[2]?' — earned':''}">${b[0]} <span>${b[1]}</span></span>`).join('')}</div>`;
}
let heatLayer=null,heatOn=false;
function drawHeat(){
  const m=window.lastMap;if(!m)return;
  if(heatLayer){try{m.removeLayer(heatLayer);}catch(e){}heatLayer=null;}
  if(!heatOn)return;
  heatLayer=L.layerGroup(loadReports().filter(r=>r.status!=='resolved'&&r.lat).map(r=>
    L.circle([r.lat,r.lng],{radius:7000+4000*RANK.indexOf(r.priority),stroke:false,fillColor:'#e5534b',fillOpacity:.22,interactive:false}))).addTo(m);
}
function floodBanner(){
  const app=$('#app');if(!app)return;let b=$('#flood-banner');
  if(floodOn()){if(!b){b=document.createElement('div');b.id='flood-banner';b.className='flood-banner';
    b.innerHTML='🌧️ <strong>Monsoon Alert: drainage &amp; flooding reports get priority.</strong>';app.before(b);}}
  else if(b)b.remove();
}
function mkTool(id,txt,label,fn,host){
  if($('#'+id))return;const b=document.createElement('button');b.id=id;b.type='button';b.className='btn btn-outline btn-sm tool';
  b.textContent=txt;b.setAttribute('aria-label',label);b.addEventListener('click',fn);host.insertBefore(b,host.firstChild);
}
function extra(){
  document.body.classList.toggle('dark',localStorage.getItem('awaz_dark')==='1');
  let host=$('.nav-right');
  if(!host){host=$('#tools');if(!host){host=document.createElement('div');host.id='tools';host.className='tools';document.body.appendChild(host);}
    const lb=$('#lang-btn');if(lb&&lb.parentNode!==host)host.appendChild(lb);}
  mkTool('dark-btn','🌙','Toggle dark mode',()=>{const on=localStorage.getItem('awaz_dark')!=='1';localStorage.setItem('awaz_dark',on?'1':'0');extra();},host);
  mkTool('flood-btn','🌧️','Toggle monsoon flood mode',()=>{const on=!floodOn();localStorage.setItem('awaz_flood',on?'on':'off');
    toast(on?'Flood mode ON — drainage & water reports prioritised.':'Flood mode OFF.','🌧️');floodBanner();},host);
  const d=$('#dark-btn');if(d)d.textContent=document.body.classList.contains('dark')?'☀️':'🌙';
  floodBanner();
  if(location.hash.startsWith('#/my-reports')&&$('.page-header .container')&&!$('#badges')){
    const x=document.createElement('div');x.id='badges';x.className='badges';x.innerHTML=badgesHtml();$('.page-header .container').appendChild(x);translateTree(x);}
  if(($('#admin-map')||$('#map'))&&!$('#heat-btn')){
    const h=$('.chip-row')||$('.map-legend');
    if(h){const b=document.createElement('button');b.id='heat-btn';b.type='button';b.className='chip'+(heatOn?' active':'');b.textContent='🔥 Heatmap';
      b.addEventListener('click',()=>{heatOn=!heatOn;b.classList.toggle('active',heatOn);drawHeat();});
      h.appendChild(b);translateTree(b);setTimeout(drawHeat,150);}
  }
}
const _en=enhance;
enhance=function(f){_en(f);extra();};
document.addEventListener('click',e=>{if(e.target.classList&&e.target.classList.contains('chip')&&e.target.dataset.f)setTimeout(drawHeat,150);});
document.addEventListener('DOMContentLoaded',extra);

/* ===== Urdu: full dictionary ===== */
Object.assign(UR,{
'Built for Pakistan · Pakistan@79':'پاکستان کے لیے بنایا گیا · پاکستان@79','Pakistan@79':'پاکستان@79',
'Turn everyday problems into community action. Report potholes, garbage, broken streetlights, water leaks and other local issues — then track what happens next.':'روزمرہ کے مسائل کو کمیونٹی کے عمل میں بدلیں۔ گڑھے، کچرا، خراب اسٹریٹ لائٹس، پانی کے رساؤ اور دیگر مقامی مسائل رپورٹ کریں اور پھر ان کی پیش رفت دیکھیں۔',
'Resolved: Garbage Cleared':'حل شدہ: کچرا صاف ہو گیا','Simple Process':'آسان طریقہ','Categories':'اقسام','Live Map':'لائیو نقشہ','Real Results':'حقیقی نتائج','Impact':'اثر','Gamification':'انعامات',
'From spotting a problem to seeing it fixed — in four simple steps.':'مسئلہ دیکھنے سے لے کر اس کے حل تک — صرف چار آسان مراحل میں۔','See a problem in your neighborhood.':'اپنے محلے میں کوئی مسئلہ دیکھیں۔','Upload a photo and location.':'تصویر اور مقام شامل کریں۔','Follow the complaint status.':'شکایت کی صورتحال دیکھتے رہیں۔','See the issue resolved.':'مسئلہ حل ہوتا دیکھیں۔',
'Select a category to start your report.':'رپورٹ شروع کرنے کے لیے قسم منتخب کریں۔','See what\'s being reported near you right now.':'دیکھیں اس وقت آپ کے قریب کیا رپورٹ ہو رہا ہے۔','The latest problems reported by your community.':'آپ کی کمیونٹی کے تازہ ترین رپورٹ کردہ مسائل۔','Reports that turned into real community impact.':'وہ رپورٹس جو حقیقی تبدیلی بنیں۔',
'Critical / High':'نازک / زیادہ','Resolution time: 2 days':'حل کا وقت: 2 دن','Issue Resolved':'مسئلہ حل ہو گیا','BEFORE':'پہلے','AFTER':'بعد میں','Reports':'رپورٹس','Active':'فعال','Community Contributors':'کمیونٹی کے معاونین','Community Resolution Rate':'کمیونٹی حل کی شرح',
'Earn points by submitting useful reports and helping verify community issues.':'مفید رپورٹس جمع کرا کر اور کمیونٹی کے مسائل کی تصدیق میں مدد کر کے پوائنٹس حاصل کریں۔','Ali':'علی','Sara':'سارہ','Areej':'اریج','Hamza':'حمزہ','Fatima':'فاطمہ','340 pts':'340 پوائنٹس','280 pts':'280 پوائنٹس','240 pts':'240 پوائنٹس','210 pts':'210 پوائنٹس','190 pts':'190 پوائنٹس',
'Karachi':'کراچی','Lahore':'لاہور','Islamabad':'اسلام آباد','Hyderabad':'حیدرآباد','Jamshoro':'جامشورو','Multan':'ملتان','Peshawar':'پشاور','Select city':'شہر منتخب کریں',
'About':'ہمارے بارے میں','Admin':'ایڈمن','Links':'روابط','Transparency · Community · Action':'شفافیت · کمیونٹی · عمل','Built with ❤️ for stronger Pakistani communities.':'مضبوط پاکستانی کمیونٹیز کے لیے ❤️ کے ساتھ بنایا گیا۔',
'© 2026 Awaz-e-Mohalla. Hackathon demo project.':'© 2026 آواز محلہ۔ ہیکاتھون ڈیمو پروجیکٹ۔','Pakistan @79':'پاکستان @79',
'"See it. Report it. Fix it." — Awaz-e-Mohalla is a civic-tech concept designed to make local problem reporting simple, transparent and community-driven.':'«دیکھیں۔ رپورٹ کریں۔ حل کریں۔» — آواز محلہ ایک سول ٹیک تصور ہے جو مقامی مسائل کی رپورٹنگ کو آسان، شفاف اور کمیونٹی پر مبنی بناتا ہے۔',
'Your voice helps make your neighborhood better.':'آپ کی آواز آپ کے محلے کو بہتر بناتی ہے۔','be specific, it helps us prioritize':'واضح لکھیں، اس سے ترجیح طے کرنے میں مدد ملتی ہے','Contact (optional)':'رابطہ (اختیاری)','(optional)':'(اختیاری)','Click to upload':'اپ لوڈ کرنے کے لیے کلک کریں','or drag and drop':'یا کھینچ کر چھوڑیں','PNG, JPG up to ~2MB':'PNG، JPG تقریباً 2MB تک',
'Please select a category.':'براہ کرم قسم منتخب کریں۔','Please enter a short title.':'براہ کرم مختصر عنوان لکھیں۔','Please add a description.':'براہ کرم تفصیل لکھیں۔','Please select an area.':'براہ کرم علاقہ منتخب کریں۔','Please select severity.':'براہ کرم شدت منتخب کریں۔',
'Smart Priority:':'اسمارٹ ترجیح:','This report may require faster attention because it could pose a safety risk.':'اس رپورٹ پر جلد توجہ درکار ہو سکتی ہے کیونکہ یہ حفاظتی خطرہ بن سکتی ہے۔','This report will be reviewed in the normal queue based on severity.':'اس رپورٹ کا جائزہ شدت کی بنیاد پر عام ترتیب میں لیا جائے گا۔',
'Same problem? Verify it instead of filing a duplicate — more verifications raise priority.':'وہی مسئلہ ہے؟ نئی رپورٹ بنانے کے بجائے تصدیق کریں — زیادہ تصدیقات ترجیح بڑھاتی ہیں۔',
'Report Submitted Successfully!':'رپورٹ کامیابی سے جمع ہو گئی!','Your voice has been heard.':'آپ کی آواز سن لی گئی ہے۔','Track My Report':'میری رپورٹ ٹریک کریں','Report Another Issue':'ایک اور مسئلہ رپورٹ کریں',
'Search by issue or location...':'مسئلہ یا مقام سے تلاش کریں...','e.g. Large pothole near main road':'مثلاً مین روڈ کے قریب بڑا گڑھا','Describe the issue in detail...':'مسئلے کی تفصیل لکھیں...','Phone or email (optional)':'فون یا ای میل (اختیاری)','All Categories':'تمام اقسام','All Status':'تمام حالتیں','All Priority':'تمام ترجیحات','New':'نیا',
'Back to Community':'کمیونٹی پر واپس','Pending':'زیرِ التوا','No reports yet.':'ابھی کوئی رپورٹ نہیں۔','Your community is quiet — but you can help by reporting an issue.':'آپ کی کمیونٹی خاموش ہے — مگر آپ مسئلہ رپورٹ کر کے مدد کر سکتے ہیں۔','Report not found':'رپورٹ نہیں ملی',
'Ticket':'ٹکٹ','Issue':'مسئلہ','Priority':'ترجیح','Status':'حالت','Date':'تاریخ','Action':'کارروائی','View':'دیکھیں','Overview':'جائزہ','Map':'نقشہ','Users':'صارفین','Analytics':'تجزیات','Settings':'سیٹنگز','Scorecard':'اسکور کارڈ','Total Reports':'کل رپورٹس','In Progress':'جاری','Log Out':'لاگ آؤٹ','Recent Reports':'حالیہ رپورٹس','Reports by Category':'اقسام کے لحاظ سے رپورٹس','Reports by Status':'حالت کے لحاظ سے رپورٹس','Accountability Scorecard':'احتساب اسکور کارڈ','Export CSV':'CSV ایکسپورٹ','Area':'علاقہ','Avg. fix time':'اوسط حل کا وقت','Resolution rate':'حل کی شرح','On track':'درست رفتار','All':'تمام','High Priority':'زیادہ ترجیح','Heatmap':'ہیٹ میپ'
});

Object.assign(UR,{'Fresh Off the Feed':'تازہ ترین','Welcome back':'خوش آمدید',
'Large Pothole Near University Road':'یونیورسٹی روڈ کے قریب بڑا گڑھا','Broken Streetlight on Main Avenue':'مین ایونیو پر خراب اسٹریٹ لائٹ','Garbage Accumulation Near Market':'مارکیٹ کے قریب کچرے کا ڈھیر','Open Manhole Near School':'اسکول کے قریب کھلا مین ہول','Water Pipeline Leakage':'پانی کی پائپ لائن میں رساؤ','Drainage Blockage Causing Flooding':'نالے کی بندش سے سیلابی صورتحال','Damaged Road Surface':'سڑک کی سطح خراب','Multiple Potholes on Link Road':'لنک روڈ پر کئی گڑھے',
'Deep pothole causing traffic slowdowns and risk to motorbikes.':'گہرا گڑھا ٹریفک سست کر رہا ہے اور موٹر سائیکلوں کے لیے خطرہ ہے۔','Streetlight has been off for over a week, unsafe at night.':'اسٹریٹ لائٹ ایک ہفتے سے زیادہ سے بند ہے، رات کو غیر محفوظ ہے۔','Uncollected garbage piling up for days, bad smell and pests.':'کئی دنوں سے کچرا نہیں اٹھایا گیا، بدبو اور کیڑے پھیل رہے ہیں۔','Dangerous open manhole right outside a primary school gate.':'پرائمری اسکول کے گیٹ کے بالکل باہر خطرناک کھلا مین ہول۔','Continuous water leakage wasting water and flooding the street.':'مسلسل پانی کا رساؤ پانی ضائع کر رہا ہے اور گلی میں سیلاب بنا رہا ہے۔','Blocked drain causes flooding after every rainfall.':'بند نالہ ہر بارش کے بعد سیلاب کا سبب بنتا ہے۔','Cracked and uneven road surface near the bus stop.':'بس اسٹاپ کے قریب سڑک ٹوٹی ہوئی اور ناہموار ہے۔','Series of potholes making the road nearly unusable.':'گڑھوں کی قطار نے سڑک کو تقریباً ناقابلِ استعمال بنا دیا ہے۔'});
Object.assign(UR,{'— be specific, it helps us prioritize':'— واضح لکھیں، اس سے ترجیح طے کرنے میں مدد ملتی ہے','← Back to Community':'کمیونٹی پر واپس ←'});


/* ===== Profile: first-visit prompt + change profile ===== */
Object.assign(UR,{'Welcome to Awaz-e-Mohalla':'آواز محلہ میں خوش آمدید','Tell us who you are so your reports and points are yours.':'اپنا تعارف دیں تاکہ رپورٹس اور پوائنٹس آپ کے اپنے ہوں۔','Your name':'آپ کا نام','Your area':'آپ کا علاقہ','Continue':'جاری رکھیں','Use demo profile (Areej)':'ڈیمو پروفائل استعمال کریں (اریج)','Not you? Change profile':'آپ نہیں ہیں؟ پروفائل بدلیں','Cancel':'منسوخ کریں','Please enter your name.':'براہ کرم اپنا نام لکھیں۔'});
function cleanName(v){return String(v||'').replace(/[<>"'&`]/g,'').replace(/\s+/g,' ').trim().slice(0,30);}
const LOCKS=['.navbar','#app','footer','#flood-banner','#tools'];
function lockSite(on){
  LOCKS.forEach(s=>document.querySelectorAll(s).forEach(el=>{if(on){el.setAttribute('inert','');el.setAttribute('aria-hidden','true');}else{el.removeAttribute('inert');el.removeAttribute('aria-hidden');}}));
  document.body.style.overflow=on?'hidden':'';
}
function openProfile(gate){
  if($('#profile-modal'))return;
  const had=!!localStorage.getItem('awaz_profile'),u=loadUser(),pre=had&&!gate,o=document.createElement('div');
  o.id='profile-modal';o.className='modal-overlay'+(gate?' gate':'');
  const title=pre?'Welcome back!':'Welcome to Awaz-e-Mohalla';
  const sub=pre?'Confirm your name and area to continue.':'Tell us who you are so your reports and points are yours.';
  o.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="pm-t" style="width:100%;max-width:420px">
    <div class="big-icon">👋</div><h2 id="pm-t">${title}</h2>
    <p style="color:var(--gray)">${sub}</p>
    <form id="pm-form" novalidate style="text-align:left;margin-top:16px">
      <div class="form-group"><label for="pm-name">Your name</label><input id="pm-name" type="text" maxlength="30" autocomplete="off" placeholder="Enter your name here" value="${pre?escapeHtml(u.name):''}">
        <div class="field-error" id="pm-err">Please enter your name.</div></div>
      <div class="form-group"><label for="pm-city">Your area</label><select id="pm-city">${pre?'':'<option value="">Enter city here</option>'}${CITIES.map(c=>`<option value="${c}" ${pre&&c===u.community?'selected':''}>${c}</option>`).join('')}</select>
        <div class="field-error" id="pm-err2">Please select your city.</div></div>
      <div class="modal-actions"><button class="btn btn-primary" type="submit">Continue</button>
      ${gate?'':'<button type="button" class="btn btn-outline" id="pm-cancel">Cancel</button>'}</div></form></div>`;
  document.body.appendChild(o);document.documentElement.classList.remove('gate-pending');
  translateTree(o);translateAttrs(o);
  if(gate)lockSite(true);
  const close=()=>{o.remove();if(gate)lockSite(false);};
  setTimeout(()=>$('#pm-name').focus(),30);
  $('#pm-form').addEventListener('submit',e=>{e.preventDefault();
    const n=cleanName($('#pm-name').value),c=$('#pm-city').value;let bad=false;
    $('#pm-err').classList.toggle('show',!n);$('#pm-name').classList.toggle('error',!n);
    $('#pm-err2').classList.toggle('show',!c);$('#pm-city').classList.toggle('error',!c);
    if(!n||!c)return;
    localStorage.setItem(DB.user,JSON.stringify({name:n,community:c,points:(had&&u.name===n)?u.points:0}));
    localStorage.setItem('awaz_profile','1');sessionStorage.setItem('awaz_session','1');
    close();toast(`Welcome, ${n}!`,'👋');profileChip();router();});
  const cx=$('#pm-cancel');if(cx)cx.addEventListener('click',close);
  if(!gate)o.addEventListener('click',e=>{if(e.target===o)close();});
  // keyboard: gate cannot be dismissed; keep focus inside the card
  o.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(!gate)close();else e.preventDefault();return;}
    if(e.key!=='Tab')return;
    const els=[...o.querySelectorAll('input,select,button')].filter(x=>!x.disabled);
    const first=els[0],last=els[els.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
}
function profileChip(){
  const host=$('.nav-right');if(!host)return;
  const u=loadUser();let c=$('#profile-chip');
  if(!c){c=document.createElement('button');c.id='profile-chip';c.type='button';c.className='btn btn-outline btn-sm profile-chip';
    c.setAttribute('aria-label','Your profile — click to change');c.addEventListener('click',()=>openProfile(false));host.insertBefore(c,host.firstChild);}
  const label=u.name+' · '+u.community;
  if(c.dataset.l!==label){c.dataset.l=label;c.innerHTML='<span aria-hidden="true">👤</span> <span class="pc-name"></span>';c.querySelector('.pc-name').textContent=u.name;c.title=label;}
}
function profileUi(){
  if(!$('#app'))return;
  if(/[?&]fresh\b/.test(location.search)){['awaz_profile','awaz_user','awaz_voted'].forEach(k=>localStorage.removeItem(k));sessionStorage.removeItem('awaz_session');
    history.replaceState(null,'',location.pathname+location.hash);}
  const isAdminView=/[?&]admin=1\b/.test(location.search)||sessionStorage.getItem('awaz_admin_view');
  if(/[?&]admin=1\b/.test(location.search)){sessionStorage.setItem('awaz_admin_view','1');history.replaceState(null,'',location.pathname+location.hash);}
  if(!isAdminView)profileChip();
  if(!isAdminView&&!sessionStorage.getItem('awaz_session'))openProfile(true);
  if(location.hash.startsWith('#/my-reports')&&$('.page-header .container')&&!$('#change-profile')){
    const b=document.createElement('button');b.id='change-profile';b.type='button';b.className='btn btn-outline btn-sm';b.style.marginTop='10px';
    b.textContent='Not you? Change profile';b.addEventListener('click',()=>openProfile(false));
    $('.page-header .container p').after(b);translateTree(b);
  }
  const a=$('#f-area');
  if(a&&!a.dataset.pre){a.dataset.pre='1';const c=loadUser().community;if(!a.value&&CITIES.includes(c)){a.value=c;a.dispatchEvent(new Event('change',{bubbles:true}));}}
}
const _en3=enhance;
enhance=function(f){_en3(f);profileUi();};
document.addEventListener('DOMContentLoaded',profileUi);


Object.assign(UR,{'City':'شہر','Area / Neighbourhood':'علاقہ / محلہ','Select area':'علاقہ منتخب کریں','Select city first':'پہلے شہر منتخب کریں','Other…':'دیگر…','Please select a city.':'براہ کرم شہر منتخب کریں۔','Please select your area.':'براہ کرم اپنا علاقہ منتخب کریں۔','Type your area / street':'اپنا علاقہ / گلی لکھیں',
'Sindh University Area':'سندھ یونیورسٹی ایریا','University Road':'یونیورسٹی روڈ','Bilawal Colony':'بلاول کالونی','Jamshoro Bazaar':'جامشورو بازار','Kotri Road':'کوٹری روڈ','LUMHS Area':'لمس ایریا',
'Qasimabad':'قاسم آباد','Latifabad':'لطیف آباد','Hirabad':'ہیرآباد','Saddar':'صدر','Autobhan Road':'آٹوبھان روڈ','Gulistan-e-Sajjad':'گلستانِ سجاد',
'Gulshan-e-Iqbal':'گلشنِ اقبال','Clifton':'کلفٹن','North Nazimabad':'نارتھ ناظم آباد','Korangi':'کورنگی','Malir':'ملیر','Orangi Town':'اورنگی ٹاؤن','DHA':'ڈی ایچ اے',
'Gulberg':'گلبرگ','Model Town':'ماڈل ٹاؤن','Johar Town':'جوہر ٹاؤن','Anarkali':'انارکلی','Iqbal Town':'اقبال ٹاؤن','Shahdara':'شاہدرہ',
'F-7':'ایف-7','F-10':'ایف-10','G-9':'جی-9','I-8':'آئی-8','Blue Area':'بلیو ایریا','Bahria Town':'بحریہ ٹاؤن',
'Gulgasht Colony':'گلگشت کالونی','Cantt':'کینٹ','Shah Rukn-e-Alam Colony':'شاہ رکنِ عالم کالونی','Bosan Road':'بوسن روڈ','Hussain Agahi':'حسین آگاہی','Nawan Shehr':'نواں شہر',
'University Town':'یونیورسٹی ٹاؤن','Hayatabad':'حیات آباد','Gulbahar':'گلبہار','Ring Road':'رنگ روڈ','Qissa Khwani':'قصہ خوانی'});
RULES.push([/^(.+), (Karachi|Lahore|Islamabad|Hyderabad|Jamshoro|Multan|Peshawar)$/,(a,loc,c)=>(UR[loc]||loc)+'، '+UR[c]]);

Object.assign(UR,{'Welcome back!':'خوش آمدید!','Confirm your name and area to continue.':'جاری رکھنے کے لیے اپنا نام اور علاقہ تصدیق کریں۔','Select your city':'اپنا شہر منتخب کریں','Please select your city.':'براہ کرم اپنا شہر منتخب کریں۔'});

Object.assign(UR,{'Enter your name here':'اپنا نام یہاں لکھیں','Enter city here':'شہر یہاں منتخب کریں'});
