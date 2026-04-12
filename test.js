/*
let x = fetch("https://pokeapi.co/api/v2/pokemon/35")
    .then(result => {return result.json()})
    .then(object => {console.log(object)}) //this just prints what the object has
*/

/* an pokemon object has the attributes
pokemon.abilites[0...x]
pokemon.

*/

for (i = 1; i <= 20; i++) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${i}`) //get the first 20 pokemon
        .then(result => { return result.json() })
        .then(object => {
            console.log(object.forms[0].name);
            console.log(object.forms[0].url);
            document.getElementById('view').innerHTML += `
                <h1> ${ object.forms[0].name } </h1>`
            fetch(object.forms[0].url)
                .then(result => { return result.json() })
                .then(object => {
                    console.log(object);
                })
        })
}


