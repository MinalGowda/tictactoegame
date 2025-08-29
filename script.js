const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetBtn');
const playerSelectModal = document.getElementById('player-select-modal');
const chooseXBtn = document.getElementById('choose-x');
const chooseOBtn = document.getElementById('choose-o');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const welcomeMessage = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logoutBtn');

const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const playAgainBtn = document.getElementById('play-again');

let xTurn = true;
let currentUser = null;
let playerXUsername = 'Player X';
let playerOUsername = 'Player O';
let selectedPlayer = null; // 'X' or 'O'

const WINNING_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// Authentication Functions
function loginUser(username, email) {
  const user = { username, email };
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('user_' + email, JSON.stringify(user));
  currentUser = user;
  
  // Set player usernames based on selected player
  if (selectedPlayer === 'X') {
    playerXUsername = username;
    playerOUsername = 'Player O';
  } else {
    playerXUsername = 'Player X';
    playerOUsername = username;
  }
  
  // Update UI
  welcomeMessage.textContent = `Welcome, ${username}!`;
  logoutBtn.style.display = 'inline-block';
  loginModal.style.display = 'none';
  
  // Start game
  startGame();
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  welcomeMessage.textContent = '';
  logoutBtn.style.display = 'none';
  playerSelectModal.style.display = 'flex';
  loginModal.style.display = 'none';
  playerXUsername = 'Player X';
  playerOUsername = 'Player O';
}

function checkLoggedIn() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    welcomeMessage.textContent = `Welcome back, ${currentUser.username}!`;
    logoutBtn.style.display = 'inline-block';
    playerSelectModal.style.display = 'none';
    loginModal.style.display = 'none';
    startGame();
  } else {
    playerSelectModal.style.display = 'flex';
    loginModal.style.display = 'none';
  }
}

function startGame() {
  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('x', 'o');
    cell.addEventListener('click', handleClick, { once: true });
  });
  xTurn = true;
  setStatus(`${playerXUsername}'s Turn`);
  popup.style.display = 'none';
}

function handleClick(e) {
  const cell = e.target;
  const currentPlayer = xTurn ? 'X' : 'O';
  cell.innerText = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWin(currentPlayer)) {
    endGame(false, currentPlayer);
  } else if (isDraw()) {
    endGame(true);
  } else {
    xTurn = !xTurn;
    setStatus();
  }
}

function isDraw() {
  return [...cells].every(cell => cell.innerText !== '');
}

function checkWin(player) {
  return WINNING_COMBOS.some(combination => {
    return combination.every(index => {
      return cells[index].innerText === player;
    });
  });
}

resetButton.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

// Player selection
chooseXBtn.addEventListener('click', () => {
  selectedPlayer = 'X';
  playerSelectModal.style.display = 'none';
  loginModal.style.display = 'flex';
});

chooseOBtn.addEventListener('click', () => {
  selectedPlayer = 'O';
  playerSelectModal.style.display = 'none';
  loginModal.style.display = 'flex';
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  if (username && email) {
    loginUser(username, email);
  }
});

// Logout button
logoutBtn.addEventListener('click', () => {
  logoutUser();
});

// Updated setStatus to show username instead of Player X/O
function setStatus() {
  if (xTurn) {
    statusText.innerText = `${playerXUsername}'s Turn`;
  } else {
    statusText.innerText = `${playerOUsername}'s Turn`;
  }
}

// Updated endGame to show username instead of Player X/O
function endGame(draw, winner = '') {
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
  popup.style.display = 'flex';
  if (draw) {
    popupMessage.innerText = "🤝 It's a Draw!";
  } else {
    const winnerName = winner === 'X' ? playerXUsername : playerOUsername;
    popupMessage.innerText = ` ${winnerName} Wins!`;
  }
}

// Initialize app
checkLoggedIn();
