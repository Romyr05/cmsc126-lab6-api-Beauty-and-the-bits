const BASE = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 30;   //Number of pokemon

const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const modalBg = document.getElementById('modal-bg');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close');
const loadedCount = document.getElementById('loaded-count');
const visibleCount = document.getElementById('visible-count');
const queryStatus = document.getElementById('query-status');

let allPokemon = [];
let filteredPokemon = [];
let lastFocusedCard = null;

function statColor(name) {
  const map = {
    hp: '#d95f4f',
    attack: '#c57a28',
    defense: '#4476c2',
    'special-attack': '#8d56c6',
    'special-defense': '#2d8c73',
    speed: '#dbbf47',
  };

  return map[name] || '#6d765e';
}

//Removes every symbols and make it Capital
function titleCase(text) {
  return text
    .split(/[-\s]+/)
    .filter(Boolean)   //Removes all falsy
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))  //Capitalizes it
    .join(' ');
}

//Pokemon number
function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

//Sprite
function getPokemonSprite(pokemon) {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'
  );
}

//Basically the type
function renderTypeBadges(types) {
  return types
    .map((entry) => `<span class="type-badge type-${entry.type.name}">${titleCase(entry.type.name)}</span>`)
    .join('');
}

function renderStats(stats) {
  return stats
    .map((entry) => {
      const statColorBar = Math.min(100, Math.round((entry.base_stat / 255) * 100));

      return `
        <div class="stat-row">
          <span class="stat-name">${titleCase(entry.stat.name)}</span>
          <div class="stat-bar-bg">
            <div
              class="stat-bar"
              style="width:${statColorBar}%; background:${statColor(entry.stat.name)}"   //The bar color
            ></div>
          </div>
          <span class="stat-val">${entry.base_stat}</span>
        </div>
      `;
    })
    .join('');
}

//Moveset just renders it 
function renderMoves(moves) {
  const selectedMoves = moves.slice(0, 12);

  if (!selectedMoves.length) {
    return '<p class="empty-copy">No move data available.</p>';
  }

  return selectedMoves
    .map((entry) => `<span class="move-badge">${titleCase(entry.move.name)}</span>`)
    .join('');
}


//Loading image
function renderLoading(message) {
  grid.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>${message}</span>
    </div>
  `;
}

// Message if no pokemon
function renderEmpty(message) {
  grid.innerHTML = `<div id="empty">${message}</div>`;
}

function updateSummary(query = '') {
  loadedCount.textContent = String(allPokemon.length);
  visibleCount.textContent = String(filteredPokemon.length);
  queryStatus.textContent = query ? titleCase(query) : 'All';
}

function renderCards(list) {
  if (!list.length) {
    renderEmpty('No Pokémon matched that search. Try another name from the first 20.');
    return;
  }

  grid.innerHTML = list
    .map((pokemon) => {
      const sprite = getPokemonSprite(pokemon);

      return `
        <button
          class="card"
          type="button"
          data-pokemon-id="${pokemon.id}"
          aria-label="Open details for ${titleCase(pokemon.name)}"
        >
          <div class="sprite-frame">
            <img src="${sprite}" alt="${titleCase(pokemon.name)}" loading="lazy" />
          </div>
          <span class="poke-id">${formatPokemonNumber(pokemon.id)}</span>
          <span class="poke-name">${titleCase(pokemon.name)}</span>
          <div class="types">${renderTypeBadges(pokemon.types)}</div>
        </button>
      `;
    })
    .join('');
}

//Filtered pokemon 
function setFilteredPokemon(query) {
  const normalizedQuery = query.toLowerCase().trim();    
  filteredPokemon = normalizedQuery
    ? allPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(normalizedQuery)) //filtered
    : allPokemon;   //show all 

  updateSummary(normalizedQuery);
  renderCards(filteredPokemon);
}

//Fetching
async function fetchJSON(url) {
  const response = await fetch(url);

  //No response API
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.json();
}


//Fetching the pokemons id based on API
function fetchPokemon(id) {
  return fetchJSON(`${BASE}/pokemon/${id}`);
}


//Basically the modal when clicked
function openModal(id, triggerElement = null) {
  const pokemon = allPokemon.find((entry) => entry.id === id);

  if (!pokemon) {
    return;
  }

  lastFocusedCard = triggerElement || document.activeElement;
  modalBg.classList.remove('hidden');
  modalBg.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const sprite = getPokemonSprite(pokemon);
  const statsHtml = renderStats(pokemon.stats);
  const movesHtml = renderMoves(pokemon.moves);
  const typesHtml = renderTypeBadges(pokemon.types);

  modalBody.innerHTML = `
    <div class="modal-hero">
      <div class="modal-sprite-frame">
        <img src="${sprite}" alt="${titleCase(pokemon.name)}" />
      </div>
      <div>
        <h2 id="modal-title">${titleCase(pokemon.name)}</h2>
        <p class="modal-meta">
          ${formatPokemonNumber(pokemon.id)}
        </p>
        <div class="modal-types">${typesHtml}</div>
        <div class="modal-quickstats">
          <span class="quickstat">Height ${pokemon.height / 10} m</span>
          <span class="quickstat">Weight ${(pokemon.weight / 10).toFixed(1)} kg</span>
          <span class="quickstat">Moves ${pokemon.moves.length}</span>
        </div>
      </div>
    </div>

    <div class="section-label">Base Stats</div>
    <section class="stats-panel">${statsHtml}</section>

    <div class="section-label">Move Set Preview</div>
    <section class="moves-panel">
      <div class="moves-grid">${movesHtml}</div>
    </section>
  `;

  modalCloseBtn.focus();
}

//Close modal
function closeModal() {
  if (modalBg.classList.contains('hidden')) {
    return;
  }

  modalBg.classList.add('hidden');
  modalBg.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocusedCard instanceof HTMLElement) {
    lastFocusedCard.focus();
  }
}

function handleGridInteraction(event) {
  const card = event.target.closest('.card'); // Does this so that we will not attach 
                                            // The addEventListener to every card

  if (!card) {
    return;
  }

  openModal(Number(card.dataset.pokemonId), card);
}


//press Esc to exit
function handleDocumentKeydown(event) {
  if (event.key === 'Escape' && !modalBg.classList.contains('hidden')) {
    closeModal();
  }
}


// Main function
async function init() {
  renderLoading('Loading Pokémon…');   //Loading image if no api

  const ids = Array.from({ length: POKEMON_LIMIT }, (_, index) => index + 1);

  //Fetching pokemon
  try {

    allPokemon = await Promise.all(ids.map(fetchPokemon));  //Gets all the ids then fetch them
    filteredPokemon = allPokemon;
    renderCards(filteredPokemon);
    updateSummary();

  } catch (error) {
    renderEmpty('Failed to load Pokémon. Please refresh the page and try again.');
    updateSummary();
    console.error(error);
  }
}

//Filter
searchInput.addEventListener('input', (event) => {
  setFilteredPokemon(event.target.value);
});

grid.addEventListener('click', handleGridInteraction);
modalCloseBtn.addEventListener('click', closeModal);
modalBg.addEventListener('click', (event) => {
  if (event.target === modalBg) {
    closeModal();
  }
});
document.addEventListener('keydown', handleDocumentKeydown);

init();
