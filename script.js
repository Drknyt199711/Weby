const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
// Represents the game board state. Empty strings for empty cells.
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true; // True if the game is ongoing, false if won or drawn.

// Define all possible winning combinations (rows, columns, diagonals)
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
];

/**
 * Handles a click on a game cell.
 * @param {Event} event The click event object.
 */
function handleCellClick(event) {
    const clickedCell = event.target;
    // Get the index of the clicked cell from its data attribute
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // If the cell is already occupied or the game is not active, do nothing
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update the board array with the current player's mark
    board[clickedCellIndex] = currentPlayer;
    // Add a class (e.g., 'x' or 'o') to style the cell
    clickedCell.classList.add(currentPlayer.toLowerCase());
    // Display the current player's mark in the cell
    clickedCell.textContent = currentPlayer;

    // Check if the current move resulted in a win or a draw
    checkResult();
}

/**
 * Checks the current state of the game board for a win or a draw.
 */
function checkResult() {
    let roundWon = false;
    // Iterate through all winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        // Get the values from the board for the current winning condition
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        // If any cell in the condition is empty, it's not a win yet
        if (a === '' || b === '' || c === '') {
            continue;
        }
        // If all three cells in the condition are the same, a player has won
        if (a === b && b === c) {
            roundWon = true;
            break; // Stop checking further conditions
        }
    }

    if (roundWon) {
        statusMessage.textContent = `Player ${currentPlayer} has won! 🎉`;
        gameActive = false; // End the game
        return;
    }

    // Check for a draw: if no empty cells left and no one has won
    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusMessage.textContent = `It's a draw! 🤝`;
        gameActive = false; // End the game
        return;
    }

    // If no win or draw, switch to the other player's turn
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
    currentPlayer = 'X'; // Start with Player X
    board = ['', '', '', '', '', '', '', '', '']; // Clear the board array
    gameActive = true; // Set game back to active
    statusMessage.textContent = `Player X's Turn`; // Update status message

    // Clear content and remove 'x'/'o' classes from all cells
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Add event listeners
// Attach click listener to each cell
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// Attach click listener to the reset button
resetButton.addEventListener('click', resetGame);

// Set initial status message when the page loads
statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
