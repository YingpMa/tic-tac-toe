// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes("") ? null : "Tie";
    };

    return {getBoard, resetBoard, placeMarker, checkWinner};
})();

// Player Factory Function
const Player = (name, marker) => {
    return { name, marker};
}

// Game Controller Module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.updateBoard();
    }

    const playTurn = (index) => {
        if (gameOver || !Gameboard.placeMarker(index, players[currentPlayerIndex].marker)) return;
        DisplayController.updateBoard();
        const winner = Gameboard.checkWinner();
        if (winner) {
            gameOver = true;
            DisplayController.displayWinner(winner === "Tie" ? "It's a tie!" : `${players[currentPlayerIndex].name} Wins!`);
            return;
        }
        currentPlayerIndex = 1 -currentPlayerIndex;
    };

    return { startGame, playTurn };
})();

// Display Controller Module
const DisplayController = (() => {
    const boardElement = document.getElementById("gameboard");
    const resultElement = document.getElementById("result");
    const  restartButton = document.getElementById("restart");

    const updateBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => GameController.playTurn(index));
            boardElement.appendChild(cellElement);
        });
    };

    const displayWinner = (message) => {
        resultElement.textContent = message;
    };

    restartButton.addEventListener("click", () => {
        resultElement.textContent = "";
        GameController.startGame("Player 1", "Player 2");
        gameOver = false;
    });

    return { updateBoard, displayWinner };
})();

// Initial Game setup
GameController.startGame("Player 1", "Player 2");