var Player = require('./Player');
var Cpu    = require('./Cpu');

class Game {
    constructor() {
        // I have a q, can we iniate those two players like this in JS?
        this.playerOne = new Player();
        this.cpu = new Cpu();
        this.message = 'The game is not yet initialized!';
        this.isHuman = null;
        this.playerOneScore = 0;
        this.cpuScore = 0;
        this.gameInitialized = false;
        this.gameOver = null;
        // ^^ how about this instead?
        // Can we set the initial state to false here?
        // this.message can relay game state, and
        // we can use gameOver to know when to begin a
        // new round

        // initialize to null so we know when setInitialState should not work
    }


    setInitialState() {
        if (this.gameOver === null) {
            this.playerOne.populateShips();
            this.cpu.populateShips();
            this.cpu.randomizeConfiguration();
            this.gameOver = false;

            // SET TO TRUE FOR NOW FOR TESTING:
            this.isHuman = true;
            // this.isHuman = Math.random() > .5 ? true : false;
            if (this.isHuman) {
                this.message = 'Player one goes first! Configure your board and take a turn!\n'
            } else {
                this.message = 'CPU goes first.'
            }

            return this.status;
        }
    }


    confirmInitialization() {
        var shipsPlaced = 0;
        for (var ship of this.playerOne.ships) {
            if (ship.placed) {
                shipsPlaced++;
            }
        }

        if (shipsPlaced > 4) {
            this.gameInitialized = true;
            return true;
        }
    }


    attack(coords) {

        if (this.gameOver === null || this.gameOver) {
            return this.status;
        }

        if (!this.gameInitialized) {
            if (!this.confirmInitialization()) {
                this.message = 'Please configure your board before taking a turn.';
                return this.status;
            }
        }

        if (this.gameOver === false) {

            switch (this.isHuman) {

                case true: {
                        let { shipHit, message } = this.playerOne.takeTurn(coords, this.cpu);

                        if (shipHit) {
                            this.updateScore('playerOne');
                        }

                        this.checkGameStatus();
                        this.advanceTurn();
                        // this.playerOne.showOpponentBoard(message);
                        return;
                    }

                default: {
                        coords = this.cpu.generateCpuGuess();
                        let { shipHit, message } = this.cpu.takeTurn(coords, this.playerOne, true);

                        if (shipHit) {
                            this.updateScore('cpu');
                            this.cpu.lastHit = coords;
                        }

                        if (message.includes('sunk')) {
                            this.cpu.lastHit = null;
                            this.cpu.nextGuesses = [];
                        }

                        this.cpu.allGuesses.push(coords);
                        this.checkGameStatus();
                        console.log(message);
                        this.advanceTurn();

                        return;
                    }
            }
        }
    }


    checkGameStatus() {
        if (this.cpuScore > 16 /*6*/) {
            this.message = 'CPU wins! Use game.reset() to play again.';
            this.gameOver = true;
        } else if (this.playerOneScore > 16 /*6*/) {
            this.message = 'You win! Use game.reset() to play again.';
            this.gameOver = true;
        }
    }


    updateScore(player) {
        if (player === 'cpu') {
            this.cpuScore++;
        } else {
            this.playerOneScore++;
        }
    }


    advanceTurn() {
        this.isHuman = !this.isHuman;

        // automatically take cpu turn after
        // displaying last message for 2 seconds;
        if (!this.isHuman) {
            // DISABLE FOR NOW
            // setTimeout(() => this.attack(), 2000);
        }
    }


    reset() {
        this.playerOne = new Player();
        this.cpu = new Cpu();
        this.message = 'Game is about to begin!';
        this.isHuman = null;
        this.playerOneScore = 0;
        this.cpuScore = 0;
        this.gameInitialized = false;
        this.gameOver = null;

        this.setInitialState();
    }


    get status() {
        console.log(this.message);
    }

}


module.exports = Game;
