const cells = Array.from(document.querySelectorAll('.cell'));
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let board = Array(9).fill('');
let currentPlayer = 'X';
let isGameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function updateStatus(message) {
  status.textContent = message;
}

function restartGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  isGameActive = true;

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'winning');
  });

  updateStatus("Player X's turn");
}

function checkWinner() {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: [a, b, c] };
    }
  }

  if (board.every((cell) => cell !== '')) {
    return { winner: 'Draw', combo: [] };
  }

  return null;
}

function handleCellClick(event) {
  const clickedCell = event.target;
  const cellIndex = Number(clickedCell.dataset.cellIndex);

  if (board[cellIndex] || !isGameActive) {
    return;
  }

  board[cellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());

  const result = checkWinner();

  if (result && result.winner !== 'Draw') {
    isGameActive = false;

    result.combo.forEach((index) => {
      cells[index].classList.add('winning');
    });

    updateStatus(`Player ${result.winner} wins!`);
    return;
  }

  if (result && result.winner === 'Draw') {
    isGameActive = false;
    updateStatus("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);

restartGame();
