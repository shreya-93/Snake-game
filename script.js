const boardSize = 20; // 20x20 grid
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const gamesPlayedSpan = document.getElementById('games-played');
const highScoreSpan = document.getElementById('high-score');
const currentScoreSpan = document.getElementById('current-score');
const cells = [];
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 }; // Initially move right
let food = {};
let gameInterval;
let gamesPlayed = 0;
let highScore = 0;
let currentScore = 0;

// Load high score from localStorage
function loadHighScore() {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
        highScore = parseInt(storedHighScore, 10);
        highScoreSpan.textContent = highScore;
    }
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('snakeHighScore', highScore);
}

// Initialize the game board
function createBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gameBoard.appendChild(cell);
        cells.push(cell);
    }
}

// Draw the snake and food on the board
function draw() {
    cells.forEach(cell => cell.className = 'grid-cell'); // Reset all cells
    
    snake.forEach((segment, index) => {
        const segmentClass = index % 2 === 0 ? 'snake-light' : 'snake-dark';
        const cellIndex = segment.y * boardSize + segment.x;
        cells[cellIndex].classList.add(segmentClass);
    });
    
    const foodIndex = food.y * boardSize + food.x;
    cells[foodIndex].classList.add('food');
}

// Move the snake
function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Check for collision with walls or self
    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        clearInterval(gameInterval);
        alert('Game Over');
        updateStats();
        resetGame();
        return;
    }
    
    snake.unshift(newHead);

    // Check if snake has eaten the food
    if (newHead.x === food.x && newHead.y === food.y) {
        currentScore++;
        updateCurrentScore();
        generateFood();
    } else {
        snake.pop();
    }
    
    draw();
}

// Generate food at a random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    };

    // Ensure food does not spawn on the snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

// Handle arrow key input
function handleKeyInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

// Start the game
function startGame() {
    gamesPlayed++;
    currentScore = 0;
    updateStats();
    startButton.disabled = true;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 }; // Reset direction
    generateFood();
    draw();
    gameInterval = setInterval(moveSnake, 200);
}

// Update stats
function updateStats() {
    gamesPlayedSpan.textContent = gamesPlayed;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreSpan.textContent = highScore;
        saveHighScore(); // Save new high score to localStorage
    }
    updateCurrentScore();
}

// Update current score
function updateCurrentScore() {
    currentScoreSpan.textContent = currentScore;
}

// Reset game after game over
function resetGame() {
    clearInterval(gameInterval);
    startButton.disabled = false;
}

// Initialize board and event listeners
function initialize() {
    createBoard();
    loadHighScore(); // Load high score from localStorage
    startButton.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyInput);
}

initialize();
