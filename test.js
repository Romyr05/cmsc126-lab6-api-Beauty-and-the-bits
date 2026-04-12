let x = fetch("https://pokeapi.co/api/v2/pokemon/35")
    .then(result => {return result.json()})
    .then(object => {console.log(object)}) //this just prints what the object has



