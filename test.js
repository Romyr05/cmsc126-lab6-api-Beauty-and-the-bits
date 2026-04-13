
/* ─── StatColor ────────────────────────────────────────────────────── */
function statColor(name) {
  const map = {
    hp: '#e74c3c',
    attack: '#d85a30',
    defense: '#185fa5',
    'special-attack': '#534ab7',
    'special-defense': '#0f6e56',
    speed: '#1d9e75',
  };
  return map[name] || '#888';
}
/* ─── API Helper/Builder ──────────────────────────────────────────────── */
const BASE = 'https://pokeapi.co/api/v2';

async function fetchJSON(url) {
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
return res.json();
}

async function fetchPokemon(id) {
return fetchJSON(`${BASE}/pokemon/${id}`);
}

/* ─── State ────────────────────────────────────────────────────── */
let allPokemon = [];
let filtered = [];

/* ─── Render Cards ─────────────────────────────────────────────── */
function renderCards(list) {
const grid = document.getElementById('grid');

if (!list.length) {
  grid.innerHTML = '<div id="empty">No Pokémon found. Try a different name.</div>';
  return;
}

grid.innerHTML = list
  .map((p) => {
    const typesBadges = p.types
      .map(
        (t) =>
          `<span class="type-badge">${t.type.name}</span>`
      )
      .join('');

    return `
      <div class="card" onclick="openModal(${p.id})">
        <img src="${p.sprites.front_default}" alt="${p.name}" loading="lazy" />
        <span class="poke-id">#${String(p.id).padStart(3, '0')}</span>
        <span class="poke-name">${p.name}</span>
        <div class="types">${typesBadges}</div>
      </div>
    `;
  })
  .join('');
}

/* ─── Open Modal ───────────────────────────────────────────────── */
async function openModal(id) {
const p = allPokemon.find((x) => x.id === id);
if (!p) return;

// Show modal with loading state
const modalBg = document.getElementById('modal-bg');
const modalBody = document.getElementById('modal-body');
modalBg.classList.remove('hidden');
modalBody.innerHTML = `
  <div class="loading">
    <div class="spinner"></div>
    <span>Loading details…</span>
  </div>
`;

try {
  // Type badges
  const typesBadges = p.types
    .map(
      (t) =>
         `<span class="type-badge">${t.type.name}</span>`
    )
    .join('');

  // Stats
  const statsHtml = p.stats
    .map((s) => {
      const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
      return `
        <div class="stat-row">
          <span class="stat-name">${s.stat.name}</span>
          <div class="stat-bar-bg">
            <div class="stat-bar" style="width:${pct}%;background:${statColor(s.stat.name)}"></div>
          </div>
          <span class="stat-val">${s.base_stat}</span>
        </div>
      `;
    })
    .join('');

  // Moves (first 12)
  const movesHtml = p.moves
    .slice(0, 12)
    .map((m) => `<span class="move-badge">${m.move.name}</span>`)
    .join('');

 

  // Render full modal
  modalBody.innerHTML = `
    <div class="modal-hero">
      <img src="${p.sprites.front_default}" alt="${p.name}" />
      <h2>${p.name}</h2>
      <p class="modal-meta">
        #${String(p.id).padStart(3, '0')}
        &nbsp;·&nbsp; ${p.types.map((t) => t.type.name).join(' / ')}
        &nbsp;·&nbsp; ${(p.weight / 10).toFixed(1)} kg
        &nbsp;·&nbsp; ${(p.height / 10).toFixed(1)} m
      </p>
      <div class="modal-types">${typesBadges}</div>
    </div>

    <div class="section-label">Base stats</div>
    ${statsHtml}


    <div class="section-label">Moves (first 12)</div>
    <div class="moves-grid">${movesHtml}</div>
  `;
} catch (err) {
  modalBody.innerHTML = `<p>Failed to load details.</p>`;
  console.error(err);
}
}

/* ─── Close Modal ──────────────────────────────────────────────── */
function closeModal() {
document.getElementById('modal-bg').classList.add('hidden');
}

function handleModalBgClick(e) {
if (e.target === document.getElementById('modal-bg')) {
  closeModal();
}
}

/* ─── Search ───────────────────────────────────────────────────── */
document.getElementById('search').addEventListener('input', function () {
const query = this.value.toLowerCase().trim();
filtered = query
  ? allPokemon.filter((p) => p.name.toLowerCase().includes(query))
  : allPokemon;
renderCards(filtered);
});

/* ─── Init ─────────────────────────────────────────────────────── */
(async function init() {
const ids = Array.from({ length: 20 }, (_, i) => i + 1);

try {
  // Fetch all 20 Pokémon in parallel
  allPokemon = await Promise.all(ids.map(fetchPokemon));
  filtered = allPokemon;
  renderCards(allPokemon);
} catch (err) {
  document.getElementById('grid').innerHTML =
    '<div id="empty">Failed to load Pokémon. zzZZ</div>';
  console.error(err);
}
})();

