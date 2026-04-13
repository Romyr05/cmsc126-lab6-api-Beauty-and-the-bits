/*
  Scratch file for API experiments.
  The production app is driven by `test.js`, which now owns fetching,
  rendering, and interaction flow for the Pokedex page.

  This file is kept as a lightweight reference for simple fetch patterns.
*/

async function fetchFirstPokemonAbility() {
  const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/1').then((response) =>
    response.json()
  );

  return pokemon.abilities[0].ability.name;
}

fetchFirstPokemonAbility().then((abilityName) => {
  console.log('First ability of Pokemon #1:', abilityName);
});
