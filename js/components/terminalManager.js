// Terminal management system
import { launchApp } from './windowManager.js';
import { showNotification } from './notifications.js';

// Game state variables
let snakeGame = null;
let guessNumberGame = null;
let hangmanGame = null;

function handleTerminal(e) {
  if (e.key === 'Enter') {
    const input = document.getElementById('terminal-input');
    const command = input.value.trim().toLowerCase();
    const output = document.getElementById('terminal-output');
    
    output.innerHTML += `<div class="terminal-line"><span class="terminal-prompt">guest@portfolio:~$ </span>${command}</div>`;
    
    processCommand(command, output);
    
    input.value = '';
  }
  
  // Handle snake game key presses
  if (snakeGame && snakeGame.isRunning) {
    snakeGame.handleKeyPress(e);
  }
}

function processCommand(command, output) {
  // Extract command and arguments
  const args = command.split(' ');
  const mainCommand = args[0];
  
  // Command registry
  const commands = {
    help: () => {
      output.innerHTML += `
        <div class="terminal-line">Available commands:</div>
        <div class="terminal-line">- <strong>help</strong>: Show available commands</div>
        <div class="terminal-line">- <strong>about</strong>: Open about me window</div>
        <div class="terminal-line">- <strong>projects</strong>: Open projects window</div>
        <div class="terminal-line">- <strong>contact</strong>: Open contact window</div>
        <div class="terminal-line">- <strong>clear</strong>: Clear terminal</div>
        <div class="terminal-line"><br></div>
        <div class="terminal-line"><strong>Fun Commands:</strong></div>
        <div class="terminal-line">- <strong>ascii [text]</strong>: Generate ASCII art from text</div>
        <div class="terminal-line">- <strong>snake</strong>: Play Snake game</div>
        <div class="terminal-line">- <strong>guess</strong>: Play number guessing game</div>
        <div class="terminal-line">- <strong>hangman</strong>: Play Hangman word game</div>
        <div class="terminal-line">- <strong>fortune</strong>: Get a random quote</div>
        <div class="terminal-line">- <strong>weather [city]</strong>: Show ASCII weather art</div>
        <div class="terminal-line">- <strong>matrix</strong>: Display Matrix effect</div>
      `;
    },
    about: () => {
      output.innerHTML += `<div class="terminal-line">Opening about me window...</div>`;
      launchApp('about');
    },
    projects: () => {
      output.innerHTML += `<div class="terminal-line">Opening projects window...</div>`;
      launchApp('projects');
    },
    contact: () => {
      output.innerHTML += `<div class="terminal-line">Opening contact window...</div>`;
      launchApp('contact');
    },
    clear: () => {
      output.innerHTML = `Welcome to my Portfolio
      Type <strong>help</strong> for a list of commands.`;
    },
    ascii: () => {
      if (args.length < 2) {
        output.innerHTML += `<div class="terminal-line">Usage: ascii [text]</div>`;
        return;
      }
      
      const text = args.slice(1).join(' ');
      const asciiArt = generateAsciiArt(text);
      output.innerHTML += `<div class="terminal-line ascii-art">${asciiArt}</div>`;
    },
    snake: () => {
      if (snakeGame && snakeGame.isRunning) {
        output.innerHTML += `<div class="terminal-line">Snake game is already running!</div>`;
        return;
      }
      
      output.innerHTML += `
        <div class="terminal-line">Starting Snake game...</div>
        <div class="terminal-line">Use arrow keys to control the snake.</div>
        <div class="terminal-line">Collect food (o) to grow. Avoid hitting walls or yourself.</div>
        <div class="terminal-line">Press ESC to quit.</div>
        <div id="snake-game" class="terminal-game"></div>
      `;
      
      // Scroll to the game area
      output.scrollTop = output.scrollHeight;
      
      // Initialize the game
      snakeGame = initSnakeGame('snake-game');
    },
    guess: () => {
      if (guessNumberGame && guessNumberGame.isRunning) {
        output.innerHTML += `<div class="terminal-line">Guess game is already running!</div>`;
        return;
      }
      
      const secretNumber = Math.floor(Math.random() * 100) + 1;
      let attempts = 0;
      
      output.innerHTML += `
        <div class="terminal-line">Number guessing game started!</div>
        <div class="terminal-line">I'm thinking of a number between 1 and 100.</div>
        <div class="terminal-line">Type a number and press Enter to guess.</div>
        <div class="terminal-line">Type 'quit' to exit the game.</div>
        <div id="guess-game" class="terminal-game"></div>
      `;
      
      // Initialize the game state
      guessNumberGame = {
        isRunning: true,
        secretNumber: secretNumber,
        attempts: attempts,
        handleGuess: function(guess) {
          if (guess === 'quit') {
            output.innerHTML += `<div class="terminal-line">Game over! The number was ${this.secretNumber}.</div>`;
            guessNumberGame.isRunning = false;
            return;
          }
          
          const num = parseInt(guess);
          if (isNaN(num)) {
            output.innerHTML += `<div class="terminal-line">Please enter a valid number or 'quit'.</div>`;
            return;
          }
          
          this.attempts++;
          
          if (num === this.secretNumber) {
            output.innerHTML += `<div class="terminal-line">Congratulations! You guessed the number in ${this.attempts} attempts!</div>`;
            this.isRunning = false;
          } else if (num < this.secretNumber) {
            output.innerHTML += `<div class="terminal-line">Too low! Try again.</div>`;
          } else {
            output.innerHTML += `<div class="terminal-line">Too high! Try again.</div>`;
          }
        }
      };
    },
    hangman: () => {
      if (hangmanGame && hangmanGame.isRunning) {
        output.innerHTML += `<div class="terminal-line">Hangman game is already running!</div>`;
        return;
      }
      
      // List of words for the game
      const words = [
        'javascript', 'python', 'terminal', 'computer', 'algorithm',
        'portfolio', 'developer', 'programming', 'cybersecurity', 'network'
      ];
      
      const word = words[Math.floor(Math.random() * words.length)];
      let guessedLetters = [];
      let remainingAttempts = 6;
      
      output.innerHTML += `
        <div class="terminal-line">Hangman game started!</div>
        <div class="terminal-line">Guess the programming-related word.</div>
        <div class="terminal-line">Type a letter and press Enter to guess.</div>
        <div class="terminal-line">Type 'quit' to exit the game.</div>
        <div id="hangman-game" class="terminal-game"></div>
      `;
      
      function updateHangmanDisplay() {
        const hangmanArt = [
          `
  +---+
  |   |
      |
      |
      |
      |
=========`,
          `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
          `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
          `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
          `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
          `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
          `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
        ];
        
        // Display current state
        let displayWord = '';
        for (let char of word) {
          if (guessedLetters.includes(char)) {
            displayWord += char + ' ';
          } else {
            displayWord += '_ ';
          }
        }
        
        const gameElement = document.getElementById('hangman-game');
        gameElement.innerHTML = `
          <div class="terminal-line">${hangmanArt[6 - remainingAttempts]}</div>
          <div class="terminal-line">Word: ${displayWord}</div>
          <div class="terminal-line">Guessed letters: ${guessedLetters.join(', ')}</div>
          <div class="terminal-line">Remaining attempts: ${remainingAttempts}</div>
        `;
        
        // Check win/lose condition
        if (!displayWord.includes('_')) {
          output.innerHTML += `<div class="terminal-line">Congratulations! You guessed the word: ${word}</div>`;
          hangmanGame.isRunning = false;
        } else if (remainingAttempts === 0) {
          output.innerHTML += `<div class="terminal-line">Game over! The word was: ${word}</div>`;
          hangmanGame.isRunning = false;
        }
      }
      
      // Initialize the game state
      hangmanGame = {
        isRunning: true,
        word: word,
        guessedLetters: guessedLetters,
        remainingAttempts: remainingAttempts,
        handleGuess: function(guess) {
          if (guess === 'quit') {
            output.innerHTML += `<div class="terminal-line">Game over! The word was ${this.word}.</div>`;
            this.isRunning = false;
            return;
          }
          
          if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
            output.innerHTML += `<div class="terminal-line">Please enter a single letter or 'quit'.</div>`;
            return;
          }
          
          const letter = guess.toLowerCase();
          
          if (this.guessedLetters.includes(letter)) {
            output.innerHTML += `<div class="terminal-line">You already guessed that letter!</div>`;
            return;
          }
          
          this.guessedLetters.push(letter);
          
          if (!this.word.includes(letter)) {
            this.remainingAttempts--;
          }
          
          updateHangmanDisplay();
        }
      };
      
      updateHangmanDisplay();
    },
    fortune: () => {
      const fortunes = [
        "The best way to predict the future is to create it.",
        "Code is like humor. When you have to explain it, it's bad.",
        "Programming is not about typing, it's about thinking.",
        "The most important property of a program is whether it accomplishes the intention of its user.",
        "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
        "Talk is cheap. Show me the code.",
        "Software and cathedrals are much the same — first we build them, then we pray.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "First, solve the problem. Then, write the code.",
        "Experience is the name everyone gives to their mistakes."
      ];
      
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      output.innerHTML += `<div class="terminal-line fortune">🔮 ${randomFortune}</div>`;
    },
    weather: () => {
      const city = args[1] ? args.slice(1).join(' ') : 'default';
      
      const weatherArt = {
        sunny: `
    \\   /
     .-.
  ― (   ) ―
     \`-'
    /   \\
        `,
        cloudy: `
      .--.
   .-(    ).
  (___.__)__)
        `,
        rainy: `
     .-.
    (   ).
   (___(__)
    ' ' ' '
   ' ' ' '
        `,
        snowy: `
     .-.
    (   ).
   (___(__)
    * * * *
   * * * *
        `
      };
      
      // Simulated weather based on city name length
      let weather;
      const seed = city.length % 4;
      
      switch(seed) {
        case 0: weather = 'sunny'; break;
        case 1: weather = 'cloudy'; break;
        case 2: weather = 'rainy'; break;
        case 3: weather = 'snowy'; break;
        default: weather = 'sunny';
      }
      
      output.innerHTML += `
        <div class="terminal-line">Weather forecast for ${city}:</div>
        <div class="terminal-line ascii-art">${weatherArt[weather]}</div>
        <div class="terminal-line">Current condition: ${weather.charAt(0).toUpperCase() + weather.slice(1)}</div>
      `;
    },
    matrix: () => {
      output.innerHTML += `<div class="terminal-line">Starting Matrix effect...</div>`;
      
      const matrixElement = document.createElement('div');
      matrixElement.id = 'matrix-effect';
      matrixElement.className = 'terminal-game';
      output.appendChild(matrixElement);
      
      // Scroll to the effect area
      output.scrollTop = output.scrollHeight;
      
      let matrixInterval;
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
      const width = 40;
      const height = 15;
      
      // Create matrix effect
      const columns = [];
      for (let i = 0; i < width; i++) {
        columns[i] = Math.floor(Math.random() * height);
      }
      
      matrixInterval = setInterval(() => {
        let matrixHTML = '';
        
        for (let y = 0; y < height; y++) {
          matrixHTML += '<div class="matrix-row">';
          
          for (let x = 0; x < width; x++) {
            if (y < columns[x]) {
              matrixHTML += '<span class="matrix-empty">&nbsp;</span>';
            } else if (y === columns[x]) {
              matrixHTML += `<span class="matrix-head">${chars.charAt(Math.floor(Math.random() * chars.length))}</span>`;
            } else {
              matrixHTML += `<span class="matrix-tail">${chars.charAt(Math.floor(Math.random() * chars.length))}</span>`;
            }
          }
          
          matrixHTML += '</div>';
        }
        
        matrixElement.innerHTML = matrixHTML;
        
        // Update column positions
        for (let i = 0; i < width; i++) {
          if (Math.random() > 0.975) {
            columns[i] = 0;
          } else {
            columns[i]++;
            if (columns[i] >= height) {
              columns[i] = 0;
            }
          }
        }
      }, 100);
      
      // Automatically stop after 10 seconds
      setTimeout(() => {
        clearInterval(matrixInterval);
        output.innerHTML += `<div class="terminal-line">Matrix effect stopped.</div>`;
      }, 10000);
    },
    default: () => {
      // Check if we're in a game
      if (guessNumberGame && guessNumberGame.isRunning) {
        guessNumberGame.handleGuess(command);
        return;
      }
      
      if (hangmanGame && hangmanGame.isRunning) {
        hangmanGame.handleGuess(command);
        return;
      }
      
      output.innerHTML += `<div class="terminal-line">Command not found: ${command}</div>`;
    }
  };

  setTimeout(() => {
    if (commands[mainCommand]) {
      commands[mainCommand]();
    } else {
      commands.default();
    }
    
    output.scrollTop = output.scrollHeight;
  }, 100);
}

// ASCII Art generator
function generateAsciiArt(text) {
  const fontStyles = [
    // Simple block style
    (char) => {
      switch(char.toLowerCase()) {
        case 'a': return '█▀█\n█▀█\n▀ ▀';
        case 'b': return '█▀▄\n█▀▄\n▀▀ ';
        case 'c': return '█▀▀\n█  \n▀▀▀';
        case 'd': return '█▀▄\n█ █\n▀▀ ';
        case 'e': return '█▀▀\n█▀▀\n▀▀▀';
        case 'f': return '█▀▀\n█▀ \n▀  ';
        case 'g': return '█▀▀\n█ █\n▀▀▀';
        case 'h': return '█ █\n█▀█\n▀ ▀';
        case 'i': return '▀█▀\n █ \n▀▀▀';
        case 'j': return '  █\n  █\n▀▀▀';
        case 'k': return '█ █\n█▀▄\n▀ ▀';
        case 'l': return '█  \n█  \n▀▀▀';
        case 'm': return '█▀▄▀█\n█ ▀ █\n▀   ▀';
        case 'n': return '█▀█\n█ █\n▀ ▀';
        case 'o': return '█▀█\n█ █\n▀▀▀';
        case 'p': return '█▀█\n█▀▀\n▀  ';
        case 'q': return '█▀█\n█ █\n ▀▀';
        case 'r': return '█▀▄\n█▀▄\n▀ ▀';
        case 's': return '█▀▀\n▀▀█\n▀▀▀';
        case 't': return '▀█▀\n █ \n ▀ ';
        case 'u': return '█ █\n█ █\n▀▀▀';
        case 'v': return '█ █\n█ █\n ▀ ';
        case 'w': return '█   █\n█ ▄ █\n ▀ ▀ ';
        case 'x': return '█ █\n▄▀▄\n▀ ▀';
        case 'y': return '█ █\n▀█▀\n ▀ ';
        case 'z': return '▀▀█\n▄▀ \n▀▀▀';
        case ' ': return '   \n   \n   ';
        case '0': return '█▀█\n█ █\n▀▀▀';
        case '1': return '▄█ \n █ \n▄█▄';
        case '2': return '█▀█\n ▄▀\n█▄▄';
        case '3': return '█▀█\n ▀█\n▀▀█';
        case '4': return '█ █\n█▄█\n  █';
        case '5': return '█▀▀\n▀▀█\n▀▀▀';
        case '6': return '█▀▀\n█▀█\n▀▀▀';
        case '7': return '▀▀█\n ▄▀\n█  ';
        case '8': return '█▀█\n█▀█\n▀▀▀';
        case '9': return '█▀█\n▀▀█\n▀▀▀';
        case '.': return '   \n   \n ▄ ';
        case ',': return '   \n   \n ▄▀';
        case '!': return ' █ \n █ \n ▀ ';
        case '?': return '█▀█\n ▄▀\n ▄ ';
        default: return '   \n   \n   ';
      }
    }
  ];
  
  // Use the first font style
  const fontStyle = fontStyles[0];
  
  // Convert text to ASCII art
  const charArts = [];
  for (let i = 0; i < text.length; i++) {
    charArts.push(fontStyle(text[i]));
  }
  
  // Combine the character arts
  let result = '';
  const lines = charArts[0].split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < charArts.length; j++) {
      const charLines = charArts[j].split('\n');
      result += charLines[i] + ' ';
    }
    result += '\n';
  }
  
  return result;
}

// Snake Game
function initSnakeGame(containerId) {
  const container = document.getElementById(containerId);
  const width = 20;
  const height = 10;
  let snake = [{x: 5, y: 5}];
  let food = {x: 10, y: 5};
  let direction = 'right';
  let nextDirection = 'right';
  let score = 0;
  let gameInterval;
  
  function drawGame() {
    let gameHTML = '';
    
    // Create the game board
    gameHTML += '<div class="snake-board">';
    for (let y = 0; y < height; y++) {
      gameHTML += '<div class="snake-row">';
      for (let x = 0; x < width; x++) {
        // Check if this position is snake
        let isSnake = snake.some(segment => segment.x === x && segment.y === y);
        // Check if this position is food
        let isFood = food.x === x && food.y === y;
        
        if (isSnake) {
          gameHTML += '<span class="snake-cell snake">█</span>';
        } else if (isFood) {
          gameHTML += '<span class="snake-cell food">o</span>';
        } else {
          gameHTML += '<span class="snake-cell"> </span>';
        }
      }
      gameHTML += '</div>';
    }
    gameHTML += '</div>';
    
    // Display score
    gameHTML += `<div class="snake-score">Score: ${score}</div>`;
    
    container.innerHTML = gameHTML;
  }
  
  function updateGame() {
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = {...snake[0]};
    switch(direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    // Check collision with walls
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
      endGame();
      return;
    }
    
    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      endGame();
      return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      score++;
      
      // Generate new food
      generateFood();
    } else {
      // Remove tail
      snake.pop();
    }
    
    // Redraw
    drawGame();
  }
  
  function generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
  }
  
  function startGame() {
    drawGame();
    gameInterval = setInterval(updateGame, 200);
  }
  
  function endGame() {
    clearInterval(gameInterval);
    container.innerHTML += `<div class="game-over">Game Over! Final Score: ${score}</div>`;
    snakeGame.isRunning = false;
  }
  
  function handleKeyPress(e) {
    switch(e.key) {
      case 'ArrowUp':
        if (direction !== 'down') nextDirection = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') nextDirection = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') nextDirection = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') nextDirection = 'right';
        break;
      case 'Escape':
        endGame();
        container.innerHTML += `<div class="game-over">Game stopped.</div>`;
        break;
    }
  }
  
  // Start the game
  startGame();
  
  // Return the game controller
  return {
    isRunning: true,
    handleKeyPress
  };
}

export { handleTerminal }; 