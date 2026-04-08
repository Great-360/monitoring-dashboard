// ═══════════════════════════════════════════════════════
//  FAKE DATA — edit anything here to customize
// ═══════════════════════════════════════════════════════

const PROJECTS = {
  TV:      { label: 'TV Broadcast',   color: '#3b5bdb', budget: 120000, client: 'NovaCorp Media'     },
  PA:      { label: 'Print & Ads',    color: '#74c045', budget: 85000,  client: 'Bright & Bold Co.'  },
  Radio:   { label: 'Radio Campaign', color: '#3bc9db', budget: 60000,  client: 'Soundwave Agency'   },
  Outdoor: { label: 'Outdoor Boards', color: '#f59f00', budget: 47000,  client: 'UrbanVision Ltd.'   },
  Web:     { label: 'Web & Digital',  color: '#e64980', budget: 95000,  client: 'Pixel Strategy Inc' },
};

const TEAM = [
  { init: 'LK', name: 'Laura Kim',      role: 'Project Lead',  color: '#e64980', handle: 'lkim'     },
  { init: 'GR', name: 'George Reyes',   role: 'Media Buyer',   color: '#3b5bdb', handle: 'greyes'   },
  { init: 'VS', name: 'Vera Santos',    role: 'Data Analyst',  color: '#6741d9', handle: 'vsantos'  },
  { init: 'LC', name: 'Leo Chen',       role: 'UI Designer',   color: '#0c8599', handle: 'lchen'    },
  { init: 'ET', name: 'Emma Taylor',    role: 'Copywriter',    color: '#f59f00', handle: 'etaylor'  },
  { init: 'MA', name: 'Marcus Adeyemi', role: 'Dev Lead',      color: '#2f9e44', handle: 'madeyemi' },
  { init: 'YH', name: 'Yuna Han',       role: 'QA Engineer',   color: '#c2255c', handle: 'yhan'     },
  { init: 'BA', name: 'Ben Ashford',    role: 'Ops Manager',   color: '#1971c2', handle: 'bashford' },
];

const ACTION_TEMPLATES = [
  (p, u) => `Contract signed for ${p.label} with ${p.client}`,
  (p, u) => `${p.label} budget approved — $${(p.budget / 1000).toFixed(0)}K allocated`,
  (p, u) => `@${u.handle} pushed analytics update to ${p.label} staging`,
  (p, u) => `${p.label} reached 80% delivery milestone ahead of schedule`,
  (p, u) => `New creative brief added to ${p.label} by @${u.handle}`,
  (p, u) => `${p.label} Q4 report reviewed and signed off by @${u.handle}`,
  (p, u) => `Weekly sync completed for ${p.label} — 3 action items logged`,
  (p, u) => `${p.label} final assets uploaded by @${u.handle} for client review`,
  (p, u) => `@${u.handle} updated the ${p.label} performance tracking sheet`,
  (p, u) => `${p.label} A/B test concluded — variant B wins by 14%`,
  (p, u) => `${p.client} approved the revised ${p.label} timeline`,
  (p, u) => `@${u.handle} flagged a pacing issue in ${p.label} — meeting scheduled`,
  (p, u) => `${p.label} invoice #${Math.floor(Math.random() * 8999 + 1000)} sent to ${p.client}`,
  (p, u) => `New task assigned to @${u.handle}: ${p.label} competitive analysis`,
  (p, u) => `${p.label} campaign launched successfully — tracking live`,
  (p, u) => `@${u.handle} shared ${p.label} weekly performance report`,
];

// ── Utilities ──
function rand(min, max)    { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr)         { return arr[randInt(0, arr.length - 1)]; }

// ── Live state ──
const state = {
  totalViews:   557354.02,
  weeklyClicks:  60598.00,
  tlTV:          12023.50,
  tlPA:          10347.50,
  tlRadio:        5903.05,
};

// ── Formatters ──
function fmtDollar(n) {
  const [int, dec] = Math.abs(n).toFixed(2).split('.');
  return '$' + parseInt(int).toLocaleString() + '.' + dec;
}
function fmtShort(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000)    return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

// ═══════════════════════════════════════════════════════
//  TEAM GRID — rendered dynamically from TEAM array
// ═══════════════════════════════════════════════════════
function buildTeamGrid() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = '';
  TEAM.forEach(m => {
    const el = document.createElement('div');
    el.className = 'tmem';
    el.title = `${m.name} — ${m.role}`;
    el.innerHTML = `
      <div class="tav" style="background:${m.color};">${m.init}</div>
      <div class="tinit">${m.init}</div>`;
    grid.appendChild(el);
  });
  // "+N more" cell
  const extra = document.createElement('div');
  extra.className = 'tmem';
  extra.innerHTML = `<div class="tav" style="background:#e9ecef;color:#555;">+5</div><div class="tinit">more</div>`;
  grid.appendChild(extra);
}

// ═══════════════════════════════════════════════════════
//  HEATMAP (Weekly Clicks)
// ═══════════════════════════════════════════════════════
const heatVals = [
  0.90, 0.40, 0.70, 0.30, 0.80, 0.50,
  0.30, 0.85, 0.20, 0.90, 0.40, 0.70,
  0.60, 0.50, 0.95, 0.30, 0.60, 0.85,
  0.20, 0.70, 0.40, 0.80, 0.25, 0.60,
  0.80, 0.30, 0.60, 0.50, 0.90, 0.40,
];

function buildHeatmap() {
  const grid = document.getElementById('heatmap');
  if (!grid) return;
  heatVals.forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'hcell';
    cell.style.opacity = (0.12 + v * 0.88).toFixed(2);
    grid.appendChild(cell);
  });
}

function refreshHeatmap() {
  document.querySelectorAll('.hcell').forEach(c => {
    const cur  = parseFloat(c.style.opacity);
    const next = Math.min(1, Math.max(0.1, cur + rand(-0.07, 0.07)));
    c.style.transition = 'opacity 1s ease';
    c.style.opacity    = next.toFixed(2);
  });
}

// ═══════════════════════════════════════════════════════
//  CHARTS
// ═══════════════════════════════════════════════════════
const baseOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  animation: { duration: 600 },
};

// Total Views — grouped bar
const viewsChart = new Chart(document.getElementById('viewsChart'), {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      { label: 'TV Broadcast', data: [60, 35, 80, 55, 70, 50], backgroundColor: '#3b5bdb', borderRadius: 3, barPercentage: 0.45, categoryPercentage: 0.8 },
      { label: 'Print & Ads',  data: [28, 50, 36, 30, 45, 36], backgroundColor: '#74c045', borderRadius: 3, barPercentage: 0.45, categoryPercentage: 0.8 },
    ],
  },
  options: {
    ...baseOpts,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true, mode: 'index', intersect: false,
        backgroundColor: '#fff', titleColor: '#111', bodyColor: '#555',
        borderColor: '#e9eaf0', borderWidth: 1,
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}K` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#9499ad' }, border: { display: false } },
      y: { display: false },
    },
  },
});

// Product Analytics — radar
const radarChart = new Chart(document.getElementById('radarChart'), {
  type: 'radar',
  data: {
    labels: ['TV', 'Print', 'Radio', 'Outdoor', 'Web', 'Social', 'Events', 'Direct'],
    datasets: [
      { label: 'Income', data: [78, 65, 55, 72, 88, 76, 48, 62], borderColor: '#4c6ef5', backgroundColor: 'rgba(76,110,245,0.18)', borderWidth: 1.5, pointBackgroundColor: '#4c6ef5', pointRadius: 3 },
      { label: 'Loss',   data: [32, 48, 38, 52, 28, 44, 60, 36], borderColor: '#e64980', backgroundColor: 'rgba(230,73,128,0.08)', borderWidth: 1.5, pointBackgroundColor: '#e64980', pointRadius: 3 },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        grid:        { color: 'rgba(255,255,255,0.07)' },
        angleLines:  { color: 'rgba(255,255,255,0.07)' },
        ticks:       { display: false },
        pointLabels: { color: 'rgba(255,255,255,0.38)', font: { size: 9 } },
        min: 0, max: 100,
      },
    },
  },
});

// Projects Timeline — stacked bar + trend line
const timelineChart = new Chart(document.getElementById('timelineChart'), {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { type: 'line', label: 'Total', data: [17, 19, 18, 22, 20, 19, 22], borderColor: '#111', borderWidth: 1.2, borderDash: [4, 3], pointRadius: 0, fill: false, tension: 0.4, yAxisID: 'y', order: 0 },
      { label: 'TV Broadcast',   data: [8, 10,  8, 13, 12, 10, 12], backgroundColor: '#3b5bdb', borderRadius: 3, stack: 's', barPercentage: 0.55, order: 1 },
      { label: 'Print & Ads',    data: [6,  6,  6,  5,  5,  6,  7], backgroundColor: '#74c045', borderRadius: 3, stack: 's', barPercentage: 0.55, order: 1 },
      { label: 'Radio Campaign', data: [3,  3,  4,  4,  3,  3,  3], backgroundColor: '#3bc9db', borderRadius: 3, stack: 's', barPercentage: 0.55, order: 1 },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true, mode: 'index', intersect: false,
        backgroundColor: '#fff', titleColor: '#111', bodyColor: '#555',
        borderColor: '#e9eaf0', borderWidth: 1,
        callbacks: { label: ctx => ctx.dataset.label !== 'Total' ? ` ${ctx.dataset.label}: $${ctx.parsed.y}K` : '' },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9499ad', font: { size: 10 } }, border: { display: false } },
      y: { grid: { color: '#f0f1f5' }, ticks: { color: '#9499ad', font: { size: 10 } }, border: { display: false }, beginAtZero: true },
    },
  },
});

// ═══════════════════════════════════════════════════════
//  LIVE UPDATES
// ═══════════════════════════════════════════════════════
function pulse(el) {
  if (!el) return;
  el.style.transition = 'color 0.3s';
  el.style.color = '#3b5bdb';
  setTimeout(() => { el.style.color = ''; el.style.transition = ''; }, 800);
}

function updateStatCards() {
  state.totalViews   = Math.max(520000, state.totalViews   + rand(-1200, 1800));
  state.weeklyClicks = Math.max(56000,  state.weeklyClicks + rand(-200,  300));
  state.tlTV         = Math.max(10500,  state.tlTV         + rand(-90,   130));
  state.tlPA         = Math.max(8500,   state.tlPA         + rand(-70,   100));
  state.tlRadio      = Math.max(4500,   state.tlRadio      + rand(-50,   80));

  const tvEl = document.getElementById('statTotalViews');
  const ckEl = document.getElementById('statWeeklyClicks');
  if (tvEl) { tvEl.textContent = fmtDollar(state.totalViews);   pulse(tvEl); }
  if (ckEl) { ckEl.textContent = fmtDollar(state.weeklyClicks); pulse(ckEl); }

  const total = state.tlTV + state.tlPA + state.tlRadio;
  const tlTotalEl = document.getElementById('tlTotal');
  const tlTVEl    = document.getElementById('tlTV');
  const tlPAEl    = document.getElementById('tlPA');
  const tlRadioEl = document.getElementById('tlRadio');

  if (tlTotalEl) tlTotalEl.innerHTML = fmtDollar(total).replace(/(\.\d{2})$/, '<span class="hl">$1</span>');
  if (tlTVEl)    tlTVEl.textContent    = fmtShort(state.tlTV);
  if (tlPAEl)    tlPAEl.textContent    = fmtShort(state.tlPA);
  if (tlRadioEl) tlRadioEl.textContent = fmtShort(state.tlRadio);
}

function updateViewsChart() {
  viewsChart.data.datasets[0].data = viewsChart.data.datasets[0].data.map(v => Math.max(10, Math.min(100, v + randInt(-8, 12))));
  viewsChart.data.datasets[1].data = viewsChart.data.datasets[1].data.map(v => Math.max(5,  Math.min(70,  v + randInt(-6, 9))));
  viewsChart.update('active');
}

function updateTimelineChart() {
  [1, 2, 3].forEach(i => {
    const ds = timelineChart.data.datasets[i];
    ds.data  = [...ds.data.slice(1), Math.max(2, ds.data[ds.data.length - 1] + randInt(-2, 3))];
  });
  timelineChart.data.datasets[0].data = timelineChart.data.datasets.slice(1).reduce(
    (acc, ds) => ds.data.map((v, i) => (acc[i] || 0) + v), []
  );
  timelineChart.update('active');
}

function updateRadarChart() {
  radarChart.data.datasets[0].data = radarChart.data.datasets[0].data.map(v => Math.max(30, Math.min(95, v + randInt(-4, 5))));
  radarChart.data.datasets[1].data = radarChart.data.datasets[1].data.map(v => Math.max(15, Math.min(75, v + randInt(-3, 4))));
  radarChart.update('active');
}

// ═══════════════════════════════════════════════════════
//  LIVE ACTIONS FEED
// ═══════════════════════════════════════════════════════
let actionLog = [];

function timeAgo(ms) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function generateAction() {
  const proj   = pick(Object.values(PROJECTS));
  const member = pick(TEAM);
  const tmpl   = pick(ACTION_TEMPLATES);
  return { text: tmpl(proj, member), color: proj.color, ts: Date.now() };
}

function renderActions() {
  const list = document.getElementById('actionsList');
  if (!list) return;
  list.innerHTML = '';
  actionLog.slice(0, 4).forEach(a => {
    const row = document.createElement('div');
    row.className = 'arow';
    row.innerHTML = `
      <div class="adot" style="background:${a.color};"></div>
      <div class="atxt">${a.text}</div>
      <div class="atm">${timeAgo(a.ts)}</div>`;
    list.appendChild(row);
  });
}

function addAction() {
  actionLog.unshift(generateAction());
  if (actionLog.length > 20) actionLog.pop();
  renderActions();
}

// ═══════════════════════════════════════════════════════
//  FILTER PILLS & NAV TABS
// ═══════════════════════════════════════════════════════
document.querySelectorAll('.fpill').forEach(p => {
  p.addEventListener('click', function () {
    document.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});
document.querySelectorAll('.nav-tab').forEach(t => {
  t.addEventListener('click', function () {
    document.querySelectorAll('.nav-tab').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

// ═══════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildTeamGrid();
  buildHeatmap();

  // Seed 4 initial actions with realistic spread-out timestamps
  [8 * 60, 35 * 60, 2 * 3600, 5 * 3600].forEach(offsetSec => {
    const a = generateAction();
    a.ts = Date.now() - offsetSec * 1000;
    actionLog.push(a);
  });
  renderActions();

  // Replace API key input row with a model badge
  const apiRow = document.querySelector('.api-row');
  if (apiRow) {
    apiRow.innerHTML = `<span style="font-size:11px;color:#9499ad;">Powered by <strong>${HF_MODEL.split('/')[1]}</strong> via Hugging Face</span>`;
    apiRow.style.cssText += 'background:#f5f6fa;padding:6px 13px;';
  }

  // Refresh charts + stat numbers every 3 s
  setInterval(() => {
    updateStatCards();
    updateViewsChart();
    updateTimelineChart();
    updateRadarChart();
    refreshHeatmap();
  }, 3000);

  // New activity event every 8 s
  setInterval(addAction, 8000);

  // Refresh "X ago" labels every 20 s
  setInterval(renderActions, 20000);
});

// ═══════════════════════════════════════════════════════
//  AI CHAT — Hugging Face Inference API
// ═══════════════════════════════════════════════════════


const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const HF_MODEL = 'Qwen/Qwen3-235B-A22B-Instruct-2507:together';

// Builds a fresh system prompt using the current live state
function buildSystem() {
  const total = state.tlTV + state.tlPA + state.tlRadio;
  return `You are an AI assistant embedded in a live Projects Monitoring dashboard for a media agency.
Current live data:
- Total Views: ${fmtDollar(state.totalViews)}
- Weekly Clicks: ${fmtDollar(state.weeklyClicks)}
- Active projects: ${Object.values(PROJECTS).map(p => `${p.label} (client: ${p.client}, budget: $${(p.budget / 1000).toFixed(0)}K)`).join('; ')}
- Team (${TEAM.length} people): ${TEAM.map(m => `${m.name} — ${m.role}`).join(', ')}
- This week's spend — TV Broadcast: ${fmtShort(state.tlTV)}, Print & Ads: ${fmtShort(state.tlPA)}, Radio Campaign: ${fmtShort(state.tlRadio)} — Total: ${fmtDollar(total)}
- Latest activity: "${actionLog[0]?.text || 'No recent activity'}"
Be concise and data-focused. Answer in 2-3 sentences max.`;
}

let chatHistory = [];

function addMsg(role, text) {
  const box = document.getElementById('chatMessages');
  const d   = document.createElement('div'); d.className = 'msg ' + role;
  const av  = document.createElement('div'); av.className = 'mav'; av.textContent = role === 'bot' ? '✦' : 'U';
  const b   = document.createElement('div'); b.className  = 'mbub'; b.textContent = text;
  d.appendChild(av); d.appendChild(b); box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function showTyping() {
  const box = document.getElementById('chatMessages');
  const d   = document.createElement('div'); d.className = 'msg bot'; d.id = 'typing';
  const av  = document.createElement('div'); av.className = 'mav'; av.textContent = '✦';
  const b   = document.createElement('div'); b.className  = 'mbub';
  b.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  d.appendChild(av); d.appendChild(b); box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing');
  if (el) el.remove();
}

async function sendMsg() {
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if (!txt) return;

  if (HF_TOKEN === 'hf_PASTE_YOUR_TOKEN_HERE') {
    addMsg('bot', 'Open app.js and replace HF_TOKEN with your free Hugging Face token (huggingface.co/settings/tokens).');
    return;
  }

  addMsg('user', txt);
  chatHistory.push({ role: 'user', content: txt });
  inp.value = '';
  document.getElementById('sendBtn').disabled = true;
  showTyping();

  try {
    const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [{ role: 'system', content: buildSystem() }, ...chatHistory],
        max_tokens: 200,
        temperature: 0.5,
      }),
    });

    const data  = await res.json();
    hideTyping();
    const reply = data?.choices?.[0]?.message?.content?.trim() || 'No response received.';
    chatHistory.push({ role: 'assistant', content: reply });
    addMsg('bot', reply);
  } catch {
    hideTyping();
    addMsg('bot', 'Error reaching Hugging Face. Check your token and internet connection.');
  }

  document.getElementById('sendBtn').disabled = false;
}