$(document).ready(function () {

  // when our web page is loaded! Super crucial to do everything after this event
  getPokemons()

  //4 ==================================
  //just a var to hold current pokemon
  let activePokemon;

  //when click event appears on the div, start our logic
  $("#pokemons").on("click", "div", function (event) {

    //if we are clicking on the same pokemon
    if (event.target.id === activePokemon) {

      if ($("#info").hasClass("opacity-on")) {
        $("#info").removeClass("opacity-on")
      } else {
        $("#info").addClass("opacity-on")
      }
    } else {
      //if this is a new pokemon
      activePokemon = event.target.id

      $("#info").removeClass("opacity-on")
      gatherPokemonData(event.target.id)
    }

  });

  //1 =======================================
  //get all pokemons
  function getPokemons(amount = 151) {

    $.ajax({
      url:"https://pokeapi.co/api/v2/pokemon?limit=" + amount, 
      success: data => {
        drawPokemos(data.results);
        Storage.set("pokemons", data.results);
      }
    });

  }

  //5 ==================================
  //get pokemon details
  function gatherPokemonData(pokemonId) {
    console.log("gathering pokemon data");

    let pokemons = Storage.get("pokemons");
    let reqId = parseInt(pokemonId) + 1;
    //If we never requested this pokemon info before
    if (!pokemons[pokemonId].updated) {
      $.ajax({
        url:"https://pokeapi.co/api/v2/pokemon/" + reqId, 
        success: pokemon => {
          let obj = {
            height: pokemon.height,
            weight: pokemon.weight,
            sprite: pokemon.sprites.front_default,
            types: {
              types: pokemon.types,
              heading: "Types"
            },
            updated: true
          }

          $.extend(pokemons[pokemonId], obj);
          Storage.set("pokemons", pokemons)
          //console.log("initiating request");
          drawPokemonInfo(pokemons[pokemonId])
          $("#info").addClass("opacity-on")
      }
    })

    } else {
      //console.log("this pokemon has been already updated, showing stored data")
      drawPokemonInfo(pokemons[pokemonId])
      $("#info").addClass("opacity-on")
    }
    activePokemon = pokemonId;
  }

  // 2 =====================================
  //draw all pokemons
  function drawPokemos(pokeArr) {

    let pokeString = "";
    pokeString += "<div class='pokemon'>";
    for (let i = 0; i <= pokeArr.length - 1; i++) {
      pokeString += "<img id=" + i + " src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + (i + 1) + ".png' alt='image of " + pokeArr[i]["name"] + "'>"
    }
    pokeString += "</div>"
    $('#pokemons').append(pokeString);
  }

  //6 ==================================
  //draw clicked pokemon info
  function drawPokemonInfo(pokemon) {
    //clearing all the previous data that was inside #info tag
    $('#info').empty();

    let pokeString = "<div>"

    pokeString += "<h2 class='pokemon-info-heading'>" + pokemon.name + "</h2>"
    pokeString += "<img src=" + pokemon.sprite + " alt='image of " + pokemon.name + "'>"
    pokeString += "<dl class='info-item'>"
    pokeString += "<dt>" + pokemon.types.heading + ":</dt>"

    for (let i = 0; i < pokemon.types.types.length; i++) {
      pokeString += "<dd>" + pokemon.types.types[i].type.name + "</dd>"
    }

    pokeString += "<dt>Weight:</dt>"
    pokeString += "<dd>" + pokemon.weight + "</dd>"
    pokeString += "<dt>Height:</dt>"
    pokeString += "<dd>" + pokemon.height + "</dd>"
    pokeString += "</dl>"
    pokeString += "</div>"

    $('#info').append(pokeString);
  }
});

//3 ==================================
//Our Storage/state
const Storage = (function () {
  let myStorage = window.localStorage;

  function get(name) {
    return JSON.parse(myStorage.getItem(name));
  }

  function set(name, value) {
    myStorage.setItem(name, JSON.stringify(value));
  }

  return {
    get,
    set
  }
})();
