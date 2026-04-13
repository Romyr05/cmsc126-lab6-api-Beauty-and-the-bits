/*
let x = fetch("https://pokeapi.co/api/v2/pokemon/35")
    .then(result => {return result.json()})
    .then(object => {console.log(object)}) //this just prints what the object has
*/

/* an pokemon object has the attributes
pokemonObj.abilites[0...x] -> for abilities
formsObj.sprites[0].front_default -> for pictures of pokemon
pokemonObj.forms[0].name -> name of pokemon
pokemonObj.forms[0].url -> for use in fetching the sprite
abilityObj.effect_entries[2].effect -> english version of the effect of an ability

pokes.push({
            pokemon: pokeObj,
            name: pokeObj.name,
            sprite: formObj.sprites.front_default,
            abilities: pokeObj.abilities
        })

*/
let pokemon = {};
let pokesArr = [];


async function fetchPokes() {
    let effectEntryEn;

    for (let i = 1; i <= 1; i++) { //we will do api calls to five pokemons
        let pokeObj = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(result => { return result.json() })
        
    
        let formObj = await fetch(pokeObj.forms[0].url).then(result => { return result.json() })
        
        let abilityObj = await fetch(pokeObj.abilities[0].ability.url).then(result => {return result.json()})
        
        //console.log(pokeObj.types)
        
        //gets all the ability a pokemon might have
        ability_entries = []
        for (let abilities of pokeObj.abilities) {
            let resObj = await fetch(abilities.ability.url).then(res => { return res.json() })
            ability_entries.push({
                abilityName: resObj.name,
                abilityEffect: resObj.effect_entries[2].effect,
                abilityShortEffect: resObj.effect_entries[2].short_effect
            })
        }

        //gets all the types a pokemon has
        type_entries = []
        for (let types of pokeObj.types) {
            let resObj = await fetch(types.type.url).then(res => { return res.json() })
            console.log(resObj.sprites['generation-iii'].colosseum.name_icon)
            
            type_entries.push({
                name: types.type.name,
                sprite: resObj.sprites['generation-iii'].colosseum.name_icon
            })
            
        }
        

        //combine all the name, types, sprites, ability into one object
        pokesArr.push({
            name: pokeObj.name, //name of poke
            sprite: formObj.sprites.front_default, //a png of poke
            abilityEntries: ability_entries, //multiple objects
            typeEntries: type_entries
        })

    }
    
    

    
    
}

async function doIt() {
    await fetchPokes();
    console.log(pokesArr[0].typeEntries);
    //await showPokes(pokes);
   
}

async function showPokes(pokesArr) {
    pokesArr.forEach(poke => {
        console.log(poke.name)
        console.log(poke.picture)
        poke.abilities.forEach(abilityObj => {
            let ability = abilityObj
            console.log(ability)
        })
    })
}

doIt()

