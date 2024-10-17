function Gameboard () {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Marker());
        }
    }

    const getBoard = () => board;

    const playerChoice = (row, column, marker) => {
        board[row][column].addChoice(marker)
    }

    return {getBoard, playerChoice};
}

function Marker() {
    let value = 0;

    const addChoice = (marker) => {
        value = marker;
    };

    const getValue = () => value;

    return {addChoice, getValue};
}

function GameController() {
    const board = Gameboard()

    function Player(name, marker) {
        this.name = name;
        this.marker = marker;
        this.changeName = (newName) => {
            this.name = newName;
        }
    }
    player1 = new Player("Player 1", 'X');
    player2 = new Player("Player 2", 'O');

    let activePlayer = player1;

    const switchTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== 0) {
            return
        }
        board.playerChoice(row, column, activePlayer.marker);
        if (checkWinner(board.getBoard())) {
            return
        }
        switchTurn()
    }

    const checkWinner = (board) => {
        const diagonal = [[board[0][0].getValue(), board[1][1].getValue(), board[2][2].getValue()], [board[0][2].getValue(), board[1][1].getValue(), board[2][0].getValue()]];
        for (let row of board) {
            if (row.every((x) => x.getValue() === activePlayer.marker)) {
                return true;
            };
        };

        for (column = 0; column < 3; column++) {
            let currentColumn = []
            for (row = 0; row < 3; row++) {
                currentColumn.push(board[row][column])
            }
            if (currentColumn.every((x) => x.getValue() === activePlayer.marker)) {
                return true;
            }
        }

        for (condition of diagonal) {
            if (condition.every((x) => x === activePlayer.marker)) {
                return true;
            }
        }
        return false
    };

    return {playRound, getActivePlayer, getBoard: board.getBoard, checkWinner, getPlayers: () => [player1, player2]};
};

function ScreenController() {
    const game = GameController();
    const playerTurn = document.querySelector(".turn");
    const gameBoard = document.querySelector(".container");
    const dialog = document.querySelector("dialog")

    const updateScreen = () => {
        gameBoard.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn...`

        board.forEach(row => {
            row.forEach((marker, index) => {
                const markerButton = document.createElement("button");
                markerButton.classList.add("marker");
                markerButton.dataset.column = index;
                markerButton.dataset.row = board.indexOf(row);
                markerButton.textContent = marker.getValue() !== 0 ? marker.getValue() : '';
                gameBoard.appendChild(markerButton);
            })
        })
    }

    function clickHandler(e) {
        const activePlayer = game.getActivePlayer();
        const selectedRow = e.target.dataset.row
        const selectedColumn = e.target.dataset.column

        if (!selectedColumn) {
            return
        }

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
        if (game.checkWinner(game.getBoard())) {
            dialog.textContent = `${activePlayer.name} is the winner!`
            dialog.showModal();
        }
    }

    dialog.addEventListener("click", (e) => {
        if (e.target !== e) {
            location.reload()
        }
    })

    const change = document.querySelector(".change");

    const changeName1 = document.createElement("input");
    changeName1.textContent = "Change name:";
    changeName1.placeholder = "Player 1 name"
    change.appendChild(changeName1);

    const changeName2 = document.createElement("input");
    changeName2.textContent = "Change name:";
    changeName2.placeholder = "Player 2 name"
    change.appendChild(changeName2);

    const changeButton = document.createElement("button");
    changeButton.textContent = "Change"
    change.appendChild(changeButton);
    changeButton.addEventListener("click", () => {
        players = game.getPlayers()
        players[0].changeName(changeName1.value)
        players[1].changeName(changeName2.value)
        changeName1.value = ""
        changeName2.value = ""
    })

    gameBoard.addEventListener("click", clickHandler);

    updateScreen()
}

function start() {
    const startGame = document.querySelector(".start")
    startGame.addEventListener("click", () => {
        ScreenController()
    })

    const resetGame = document.querySelector(".reset")
    resetGame.addEventListener("click", () => {
        location.reload()
    })

}

start()