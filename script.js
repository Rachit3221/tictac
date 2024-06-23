// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1YrOL5UGHFMVg01sspBTHcbowiISwYyI",
    authDomain: "tic-tac-toe-cec00.firebaseapp.com",
    projectId: "tic-tac-toe-cec00",
    storageBucket: "tic-tac-toe-cec00.appspot.com",
    messagingSenderId: "187231526118",
    appId: "1:187231526118:web:b7bffdfacc98f220d92f27",
    databaseURL: "https://tic-tac-toe-cec00.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let gameId = null;
let player = null;

document.getElementById('generate').addEventListener('click', () => {
    gameId = Math.random().toString(36).substr(2, 9);
    player = 'X';
    database.ref('games/' + gameId).set({
        board: Array(9).fill(null),
        currentPlayer: 'X'
    });
    alert('Game code: ' + gameId);
});

document.getElementById('connect').addEventListener('click', () => {
    gameId = document.getElementById('code').value;
    player = 'O';
    database.ref('games/' + gameId).once('value').then(snapshot => {
        if (snapshot.exists()) {
            startGame();
        } else {
            alert('Invalid code!');
        }
    });
});

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        database.ref('games/' + gameId).once('value').then(snapshot => {
            const game = snapshot.val();
            if (game.board[index] === null && game.currentPlayer === player) {
                game.board[index] = player;
                game.currentPlayer = player === 'X' ? 'O' : 'X';
                database.ref('games/' + gameId).set(game);
            }
        });
    });
});

function startGame() {
    database.ref('games/' + gameId).on('value', snapshot => {
        const game = snapshot.val();
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = game.board[i];
        }
        if (checkWin(game.board, 'X')) {
            alert('X wins!');
            resetGame();
        } else if (checkWin(game.board, 'O')) {
            alert('O wins!');
            resetGame();
        } else if (game.board.every(cell => cell !== null)) {
            alert('Draw!');
            resetGame();
        }
    });
}

function checkWin(board, player) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    return winningCombos.some(combo => {
        return combo.every(index => board[index] === player);
    });
}

function resetGame() {
    database.ref('games/' + gameId).remove();
    gameId = null;
    player = null;
}
