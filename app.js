// ─────────────────────────────────────────────
//  HEATMAP (Weekly Clicks) — build dynamically
// ─────────────────────────────────────────────
(function buildHeatmap() {
  const grid = document.getElementById('heatmap');
  if (!grid) return;
  // 5 rows × 6 cols = 30 cells; seed a deterministic look
  const vals = [
    0.9,0.4,0.7,0.3,0.8,0.5,
    0.3,0.85,0.2,0.9,0.4,0.7,
    0.6,0.5,0.95,0.3,0.6,0.85,
    0.2,0.7,0.4,0.8,0.25,0.6,
    0.8,0.3,0.6,0.5,0.9,0.4
  ];
  vals.forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'hcell';
    cell.style.opacity = (0.12 + v * 0.88).toFixed(2);
    grid.appendChild(cell);
  });
})();

// ─────────────────────────────────────────────
//  CHART DEFAULTS
// ─────────────────────────────────────────────
const baseOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  animation: { duration: 700 }
};

// ── Total Views — grouped bar ──
new Chart(document.getElementById('viewsChart'), {
  type: 'bar',
  data: {
    labels: ['20','9','23','19','21','12'],
    datasets: [
      { data: [60,35,80,55,70,50], backgroundColor: '#3b5bdb', borderRadius: 3, barPercentage: 0.45, categoryPercentage: 0.8 },
      { data: [28,50,36,30,45,36], backgroundColor: '#74c045', borderRadius: 3, barPercentage: 0.45, categoryPercentage: 0.8 }
    ]
  },
  options: {
    ...baseOpts,
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#9499ad' }, border: { display: false } },
      y: { display: false }
    }
  }
});

// ── Product Analytics — radar ──
new Chart(document.getElementById('radarChart'), {
  type: 'radar',
  data: {
    labels: ['15.09','16.09','17.09','18.09','19.09','20.09','13.09','14.09'],
    datasets: [
      {
        data: [65,72,58,82,68,76,54,70],
        borderColor: '#4c6ef5', backgroundColor: 'rgba(76,110,245,0.18)',
        borderWidth: 1.5, pointBackgroundColor: '#4c6ef5',
        pointRadius: 3, pointHoverRadius: 4
      },
      {
        data: [38,52,42,58,48,62,35,50],
        borderColor: '#e64980', backgroundColor: 'rgba(230,73,128,0.08)',
        borderWidth: 1.5, pointBackgroundColor: '#e64980',
        pointRadius: 3, pointHoverRadius: 4
      }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        grid:        { color: 'rgba(255,255,255,0.07)' },
        angleLines:  { color: 'rgba(255,255,255,0.07)' },
        ticks:       { display: false, stepSize: 20 },
        pointLabels: { color: 'rgba(255,255,255,0.35)', font: { size: 9 } },
        min: 0, max: 100
      }
    }
  }
});

// ── Projects Timeline — stacked bar + trend line ──
new Chart(document.getElementById('timelineChart'), {
  type: 'bar',
  data: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        type: 'line', label: 'Trend',
        data: [17,19,18,22,20,19,22],
        borderColor: '#111', borderWidth: 1.2, borderDash: [4,3],
        pointRadius: 0, fill: false, tension: 0.4, yAxisID: 'y', order: 0
      },
      { label: 'TV',    data: [8,10,8,13,12,10,12], backgroundColor: '#3b5bdb', borderRadius: 3, stack: 's', barPercentage: 0.55, order: 1 },
      { label: 'PA',    data: [6, 6,6, 5, 5, 6, 7], backgroundColor: '#74c045', borderRadius: 3, stack: 's', barPercentage: 0.55, order: 1 },
      { label: 'Radio', data: [3, 3,4, 4, 3, 3, 3], backgroundColor: '#3bc9db', borderRadius: 3, stack: 's', barPercentage: 0.55, order: 1 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false },
      tooltip: {
        enabled: true, mode: 'index', intersect: false,
        backgroundColor: '#fff', titleColor: '#111', bodyColor: '#555',
        borderColor: '#e9eaf0', borderWidth: 1,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9499ad', font: { size: 10 } }, border: { display: false } },
      y: { grid: { color: '#f0f1f5' }, ticks: { color: '#9499ad', font: { size: 10 } }, border: { display: false }, beginAtZero: true }
    }
  }
});

// ─────────────────────────────────────────────
//  FILTER PILLS
// ─────────────────────────────────────────────
document.querySelectorAll('.fpill').forEach(p => {
  p.addEventListener('click', function () {
    document.querySelectorAll('.fpill').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─────────────────────────────────────────────
//  NAV TABS
// ─────────────────────────────────────────────
document.querySelectorAll('.nav-tab').forEach(t => {
  t.addEventListener('click', function () {
    document.querySelectorAll('.nav-tab').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─────────────────────────────────────────────
//  AI CHAT
// ─────────────────────────────────────────────
let apiKey = '';
let chatHistory = [];

const SYSTEM = `You are an AI assistant embedded in a Projects Monitoring dashboard.
Dashboard data: Total Views $557,354.02, Weekly Clicks $60,598.00, 14 team members,
Timeline totals — TV: $12,023.50, PA: $10,347.50, Radio: $5,903.05 (total $28,374.05).
Be concise and data-focused. Max 3 sentences per reply.`;

function saveKey() {
  apiKey = document.getElementById('apiKey').value.trim();
  if (apiKey) {
    document.querySelector('.api-row').style.background = '#f0fdf4';
    addMsg('bot', "Key saved! I'm ready. Ask me anything about your dashboard data.");
  }
}

function addMsg(role, text) {
  const box = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg ' + role;
  const av = document.createElement('div');
  av.className = 'mav';
  av.textContent = role === 'bot' ? '✦' : 'U';
  const b = document.createElement('div');
  b.className = 'mbub';
  b.textContent = text;
  d.appendChild(av); d.appendChild(b);
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function showTyping() {
  const box = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg bot'; d.id = 'typing';
  const av = document.createElement('div');
  av.className = 'mav'; av.textContent = '✦';
  const b = document.createElement('div');
  b.className = 'mbub';
  b.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  d.appendChild(av); d.appendChild(b);
  box.appendChild(d);
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
  if (!apiKey) { addMsg('bot', 'Please paste your Anthropic API key above and click Save.'); return; }

  addMsg('user', txt);
  chatHistory.push({ role: 'user', content: txt });
  inp.value = '';
  document.getElementById('sendBtn').disabled = true;
  showTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM,
        messages: chatHistory
      })
    });
    const data = await res.json();
    hideTyping();
    const reply = data?.content?.[0]?.text || 'No response received.';
    chatHistory.push({ role: 'assistant', content: reply });
    addMsg('bot', reply);
  } catch {
    hideTyping();
    addMsg('bot', 'Error reaching the AI. Check your API key and try again.');
  }

  document.getElementById('sendBtn').disabled = false;
}