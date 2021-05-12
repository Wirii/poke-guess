const colors = {
	fire: '#f08030',
	grass: '#78c850',
	electric: '#f8d030',
	water: '#6890f0',
	ground: '#e0c068',
	rock: '#b8a038',
	fairy: '#edb4ba',
	poison: '#a040a0',
	bug: '#a8b61f',
	dragon: '#7038f8',
	psychic: '#f85888',
	flying: '#a890f0',
	fighting: '#c03028',
	normal: '#a8a878',
  ghost: '#705897',
  dark: '#705848',
  steel: '#b8b8d0',
  ice: '#98d8d8'
};

let guessArr = [];
let pokeName = "";
let toGuess = "";

const gameDiv = document.querySelector(".game");
const startDiv = document.querySelector(".start");
const messageContainer = document.querySelector(".replay");
const message = document.querySelector(".msg");
const pokeArt = document.querySelector(".pkmn-art");
const pkmnType1 = document.querySelector(".type1");
const pkmnType2 = document.querySelector(".type2");
const giveUpBtn = document.querySelector(".give-up");
const replayBtn = document.querySelector(".again");
const startBtn = document.querySelector(".start-btn");
const hiddenName = document.querySelector(".pkmn-guess");
const letterBtn = document.querySelector(".letter-btn");
const gameLogo = document.querySelector(".game-logo");


// inits game
const initGame = async () => {
  startDiv.style.display = "none";
  document.querySelector(".loader").style.display = "flex";
  lettersButtons();
  await fetchData();
  pokeArt.onload = () => {
    gameDiv.style.display = "flex";
    document.querySelector(".loader").style.display = "none";
  }
}

// get random pokemon id
const randomPokemon = () => {
  let pokeId =  Math.floor((Math.random() * 898) + 1);
  console.log(pokeId);
  return pokeId;
}

// display pokemon img and type, call guess
const displayPokemon = (pokemon) => {
  const type1 = pokemon.types[0].type.name;
  pkmnType1.style.backgroundColor = colors[type1];
  pkmnType1.innerHTML = `${type1}`;
  
  if (pokemon.types[1]) {
    const type2 = pokemon.types[1].type.name;
    pkmnType2.style.backgroundColor = colors[type2];
    pkmnType2.innerHTML = `${type2}`;
  }
  
  const pokeImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  pokeArt.src = pokeImg;
  pokeArt.style.filter = "brightness(0)";
  
  pokeArt.onload = () => {
    document.querySelector(".subhead").style.display = "none";
    document.querySelector(".game").style.display = "flex";
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".keyboard").style.display = "flex";
    gameLogo.style.width = "200px";
  }
}

const parseLetter = (letter) => {
  if (pokeName.indexOf(letter) != -1) {
    for (let j = 0; j < guessArr.length; j++) {
      if(pokeName[j] === letter) {
        guessArr[j] = letter;
      }
    }
    toGuess = guessArr.join(" ");
    hiddenName.innerHTML = `${toGuess.toUpperCase()}`;
  } 

  console.log(toGuess + ", " + pokeName);

  // check if guessed
  if (toGuess.replaceAll(" ", "") === pokeName) {      
    message.innerHTML = "Congrats! You guessed it right!";
    messageContainer.style.display = "flex";
    pokeArt.style.filter = "brightness(1)";
    hiddenName.style.color = "green";
  }
}

// handles give up action
const giveUp = () => {
  giveUpBtn.addEventListener("click", event => {
    event.preventDefault();
    messageContainer.style.display = "flex";
    message.innerHTML = "Yikes, better luck next time!";
    let correct = pokeName.split("").join(" ");
    hiddenName.innerHTML = `${correct.toUpperCase()}`;
    pokeArt.style.filter = "brightness(1)";
    hiddenName.style.color = "red";
  })
}

// handles replay action
const replay = () => {
  replayBtn.onclick = (event) => {
    event.preventDefault();
    messageContainer.style.display = "none";
    document.querySelector(".game").style.display = "none";
    document.querySelector(".keyboard").style.display = "none";
    document.querySelector(".loader").style.display = "flex";
    resetGame();
    fetchData();
  }
}

const makeButton = (letter) => {
  let button = `<button class="letter-btn" id='` + letter + `' onClick="letterChecker('` + letter + `')">` + letter.toUpperCase() + `</button>`;
  return button;
}

const lettersButtons = () => {
  let letters1 = 'qwertyuiop'.split('').map(letter => makeButton(letter)).join("");
  document.querySelector(".qtop").innerHTML = letters1;
  
  let letters2 = 'asdfghjkl'.split('').map(letter => makeButton(letter)).join("");
  document.querySelector(".atol").innerHTML = letters2;
  
  let letters3 = 'zxcvbnm'.split('').map(letter => makeButton(letter)).join("");
  document.querySelector(".ztom").innerHTML = letters3;
}

const letterChecker = (letter) => {
  let clicked = document.querySelector('#' + letter);
  clicked.disabled = true;
  parseLetter(letter);
}
 
// resets game data
const resetGame = () => {
  guessArr = [];
  pokeName = "";
  toGuess = "";
  lettersButtons();
  pkmnType1.innerHTML = "";
  pkmnType2.innerHTML = "";
  pkmnType1.style.background = "transparent";
  pkmnType2.style.background = "transparent";
  pokeArt.src = "";
  pokeArt.style.filter = "brightness(1)";
  hiddenName.style.color = "black";
}

const welcomeScreen = () => {
  gameDiv.style.display = "none";
  startDiv.style.display = "flex";
  document.querySelector(".loader").style.display = "none";
  startBtn.addEventListener("click", initGame);
}

// handles listening to user input
const letterListener = (e) => {
  if(e.keyCode >= 65 && e.keyCode <= 90) {
    let letter = e.key;

    // change "_" to letter if correct
    letterChecker(letter);
  }
}

const fetchData = async () => {
  let pokeId = randomPokemon();
  let url = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;
  let result = await fetch(url);
  let pokemon = await result.json();
  
  displayPokemon(pokemon);
  
  pokeName = pokemon.species.name;
  console.log(pokeName);
  for (let i = 0; i < pokeName.length; i++) {
    if(pokeName[i] == "-") {
      toGuess = toGuess + "- ";
    } else {
      toGuess = toGuess + "_ ";     
    }
  }
  
  guessArr = toGuess.split(" ");
  hiddenName.innerHTML = `${toGuess}`;
  
  window.addEventListener("keydown", letterListener);
  letterBtn.addEventListener("click", letterChecker);
};

welcomeScreen();
giveUp();
replay();