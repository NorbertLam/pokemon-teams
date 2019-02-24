const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const POKEMONS_LIST = "http://localhost:3003/pokemon"

const pokeMap = [];

document.addEventListener('DOMContentLoaded', () => {
  loadTrainers();
  getAllPokemon();
})

function loadTrainers() {
  fetch(TRAINERS_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      const main = document.querySelector('main');

      for (const trainer of json) {
        const newDiv = document.createElement('div');
        newDiv.innerHTML = renderTrainer(trainer);
        const list = newDiv.querySelector('.pokemon-list');
        const button = newDiv.querySelector('.card button');
        button.addEventListener('click', handleAddPokemon);

        
        renderPokemon(trainer, list);
        main.append(newDiv);
      }
    })
}

function renderTrainer(trainer) {
  return(`<div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
  <button data-trainer-id=${trainer.id}>Add Pokemon</button>
  <ul class="pokemon-list">
  </ul>
</div>`);
}

function renderPokemon(trainer, element) {
  const pokemons = trainer.pokemons

  for (const pokemon of pokemons) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    
    li.innerText = `${pokemon.nickname} (${pokemon.species})`;
    button.className = "release";
    button.setAttribute('data-pokemon-id', pokemon.id);
    button.innerText = "Release"
    button.addEventListener('click', handleReleasePokemon);
    li.append(button);

    element.append(li);
  }
}

function handleAddPokemon(event) {
  const button = event.target;
  const dataset = button.dataset;
  const user = dataset.trainerId;
  const ul = button.parentNode.querySelector('ul')

  if (button.parentNode.querySelectorAll('li') == 6) {
    alert("Can't add more pokemon. \n Limit is 6!");
  } else{
    const pokemon = pokeMap[Math.floor(Math.random() * Object.keys(pokeMap).length)];
    const newPokemon = {
      species: pokemon.name,
      trainer_id: user
    } 
    addPokemon(newPokemon, ul);
  }  
}

function handleReleasePokemon(event) {
  const button = event.target;
  const dataset = button.dataset;
  const pokemondId = dataset.pokemonId;
  const ul = button.parentNode.parentNode

  releasePokemon(pokemondId, ul);
}

function addPokemon(pokemon, ul) {
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(pokemon)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      addPokemonLi(json, ul)
    })
}

function releasePokemon(pokemonId, ul) {
  fetch(`${POKEMONS_URL}/${pokemonId}`, {
    method: 'DELETE'
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    removePokemonLi(pokemonId, ul);
  })
}

function getAllPokemon() {
  fetch(POKEMONS_LIST)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      for (const pokemon of json) {
        pokeMap.push(pokemon);
      }
    })
}

function addPokemonLi(pokemon, ul) {
  const li = document.createElement('li');
  const button = document.createElement('button');

  li.innerText = `${pokemon.nickname} (${pokemon.species})`;
  button.className = "release";
  button.setAttribute('data-pokemon-id', pokemon.id);
  button.innerText = "Release"
  button.addEventListener('click', handleReleasePokemon);
  li.append(button);

  ul.append(li);
}

function removePokemonLi(pokemonId, ul) {
  ul.querySelector(`li [data-pokemon-id="${pokemonId}"]`).parentNode.remove();
}

