// Leonida Trophy Dashboard: progress ring, checklist, and a detail panel per trophy.
// Data comes from data/trophies.json; progress is saved in localStorage and can be
// exported to a file and imported back. The spoiler setting hides the name and
// description of story trophies until they are earned (or ?spoilers=on in the URL).
const KEY = 'gta6-trophy-guide-progress-v1';
const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('gradeFilter');
const spoilerEl = document.getElementById('spoilers');
const emptyOnline = document.getElementById('emptyOnline');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const roadmap = doc.roadmap || [];
let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let selectedId = null;

if (new URLSearchParams(location.search).get('spoilers') === 'on') {
  spoilerEl.checked = true;
}

// ?view=roadmap focuses the page on the roadmap (the checklist is hidden),
// so a reader — or a screenshot — lands straight on the platinum plan.
if (new URLSearchParams(location.search).get('view') === 'roadmap') {
  listEl.style.display = 'none';
  document.querySelector('.dash').style.display = 'none';
}

function saveProgress() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function spoilerHidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.name);
}

function sourceLinks(t) {
  return (t.sources || []).map((s) => {
    if (s.url) return `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`;
    return s.name;
  }).join(' · ');
}

function cardHtml(t) {
  const hidden = spoilerHidden(t);
  const name = hidden ? 'Hidden story trophy — earn it to reveal' : t.name;
  const desc = hidden ? 'Name and description hidden by your spoiler setting.' : t.description;
  const flags = [
    t.missable ? '<span class="flag">⚠ Missable</span>' : '',
    t.hidden ? '<span class="flag" style="background:#33505f">Hidden</span>' : '',
  ].join('');
  return `<article class="card ${earned.has(t.name) ? 'earned' : ''} ${selectedId === t.id ? 'selected' : ''}" data-id="${t.id}">
    <label><input type="checkbox" data-name="${t.name.replaceAll('"', '&quot;')}" ${earned.has(t.name) ? 'checked' : ''} aria-label="Mark ${name} earned">
    <span><span class="kind">${t.kind}${t.count ? ' · ' + t.count : ''}</span>
    <h3>${name}</h3>
    <p class="desc">${desc}</p>
    <span class="badge ${t.grade}">${t.grade}</span>${flags}</span></label>
  </article>`;
}

function renderRoadmap() {
  document.getElementById('roadmapList').innerHTML = roadmap.map((s) =>
    `<li><h3>Stage ${s.stage} — ${s.title}</h3><p>${s.detail}</p><p class="hours">${s.hours}</p></li>`).join('');
}

function renderDetail() {
  const m = location.hash.match(/^#trophy-(\d+)$/);
  const t = m ? trophies.find((x) => x.id === Number(m[1])) : null;
  selectedId = t ? t.id : null;
  if (!t) {
    detailEl.innerHTML = `<h2>Pick a trophy</h2>
      <p>Click any trophy in the list to read its full guide and sources here.</p>
      <p><strong>Next up:</strong> finish the story (Stage 1), then side characters, collectibles, activities, and the 100% checklist.</p>
      <p>⚠ The one trophy that can be missed is <strong>Positive Mental Attitude</strong> — meditate with Lucia on the balcony in Chapter 1.</p>`;
    return;
  }
  const hidden = spoilerHidden(t);
  detailEl.innerHTML = `<p><a href="#" onclick="history.back();return false">← Back</a></p>
    <h2>${hidden ? 'Hidden story trophy' : t.name}</h2>
    <p><span class="badge ${t.grade}">${t.grade}</span> ${t.missable ? '<span class="flag">⚠ Missable</span>' : ''} <span class="kind">${t.kind}</span></p>
    <p class="desc">Official description: “${hidden ? 'Hidden until earned.' : t.description}”</p>
    ${hidden ? '<p>Turn off the spoiler setting or earn this trophy to read its guide.</p>'
      : `<p class="guide">${t.guide}</p><p class="sources">Sources: ${sourceLinks(t)}</p>`}
    <p><button type="button" id="detailToggle">${earned.has(t.name) ? 'Mark as not earned' : 'Mark as earned'}</button></p>`;
  document.getElementById('detailToggle').addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name); else earned.add(t.name);
    saveProgress(); render();
  });
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const kind = kindEl.value;
  const grade = gradeEl.value;
  const shown = trophies.filter((t) => {
    if (kind === 'missable' && !t.missable) return false;
    if (kind === 'online') return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
  emptyOnline.hidden = kind !== 'online';
  listEl.innerHTML = shown.map(cardHtml).join('') || '<p>No trophies match these filters.</p>';
  listEl.querySelectorAll('input[type=checkbox]').forEach((box) => {
    box.addEventListener('change', () => {
      if (box.checked) earned.add(box.dataset.name); else earned.delete(box.dataset.name);
      saveProgress(); render();
    });
  });
  listEl.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'A') return;
      location.hash = '#trophy-' + card.dataset.id;
    });
  });
  document.getElementById('earnedCount').textContent = earned.size;
  const pct = earned.size / trophies.length;
  document.getElementById('ringFill').style.strokeDashoffset = String(326.7 * (1 - pct));
  document.getElementById('progressText').textContent =
    earned.size === trophies.length ? 'Platinum earned — Vice Got a Price! You are a Leonida Legend.'
    : `${trophies.length - earned.size} trophies to go · about 200 hours to the platinum.`;
  renderDetail();
}

function applyHash() {
  if (location.hash === '#missable') kindEl.value = 'missable';
  render();
  if (location.hash === '#roadmap') {
    requestAnimationFrame(() => document.getElementById('roadmap').scrollIntoView());
  }
}

searchEl.addEventListener('input', render);
kindEl.addEventListener('change', render);
gradeEl.addEventListener('change', render);
spoilerEl.addEventListener('change', render);
window.addEventListener('hashchange', applyHash);

document.getElementById('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    earned = new Set(names.filter((n) => trophies.some((t) => t.name === n)));
    saveProgress(); render();
  } catch { alert('That file is not a valid progress export.'); }
});

renderRoadmap();
applyHash();
