let pokes = [];

async function fetchPokes() {
    for (i = 1; i <= 20; i++) {
        await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`) //get the first 20 pokemon
            .then(result => { return result.json() })
            .then(pokemon => {
                fetch(pokemon.forms[0].url)
                    .then(result => { return result.json() })
                    .then(forms => {
                        pokes.push({
                            name: pokemon.forms[0].name,
                            picture: forms.sprites.front_default
                        })
                    })
            })
    }
}

async function doIt() {
    await fetchPokes();
    console.log(pokes);
    showPokes(pokes)
}

function showPokes(pokesArr) {
    pokesArr.forEach(poke => {
        document.getElementById('view').innerHTML += `
        <table>
            <tr>
                <td> ${poke.name} </td>
                <td><img src = '${poke.picture}'> </td>
            </tr>
        
        </table>`})

    
}

doIt();