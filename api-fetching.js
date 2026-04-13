let pokesArr = [];

async function fetchPokes() {
    for (let i = 1; i <= 5; i++) { //we will do api calls to five pokemons
        let pokeObj = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(result => { return result.json() })
        
    
        let formObj = await fetch(pokeObj.forms[0].url).then(result => { return result.json() })
        
        let abilityObj = await fetch(pokeObj.abilities[0].ability.url).then(result => {return result.json()})
        
        //console.log(pokeObj.types)
        
        //gets all the ability a pokemon might have
        ability_entries = []
        for (let abilities of pokeObj.abilities) {
            let resObj = await fetch(abilities.ability.url).then(res => { return res.json() })
            ability_entries.push({
                name: resObj.name,
                effect: resObj.effect_entries[2].effect,
                shortEffect: resObj.effect_entries[2].short_effect
            })
        }

        //gets all the types a pokemon has
        type_entries = []
        for (let types of pokeObj.types) {
            let resObj = await fetch(types.type.url).then(res => { return res.json() })
            //console.log(resObj.sprites['generation-iii'].colosseum.name_icon)
            
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
    showPokes(pokesArr)
}

function showPokes(pokesArr) {
    let pokeView = '<table>'
    pokesArr.forEach(poke => {
        document.getElementById('view').innerHTML += `
        <table>
            <tr>
                <td> ${poke.name} </td>
                <td><img src = '${poke.sprite}'> </td>
            </tr>
        </table>`})

    
}

doIt();