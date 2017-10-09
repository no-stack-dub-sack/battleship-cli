const PlayerOne     = require('./PlayerOne');
const Cpu           = require('./Cpu');
const chalk         = require('chalk');
const { drawBoard } = require('../utils/helpers');
const { Progress }  = require('clui');

class Game {
    constructor() {
        this.cpu = new Cpu();
        this.playerOne = new PlayerOne();
        this.message = 'The game is not yet initialized!';
        this.playerOneScore = 0;
        this.cpuScore = 0;
        this.coinToss = null;
        this.gameOver = null;
        this.boardSize = null;
        this.emojiBoard = true;
        this.lastCoord = 'J10'
    }

    drawBoards(size) {
        this.boardSize = size;
        this.cpu.threshold = size;
        this.playerOne.threshold = size;

        const BOARD = drawBoard(size);
        this.cpu.ownBoard = this.copyBoard(BOARD);
        this.cpu.opponentBoard = this.copyBoard(BOARD);
        this.playerOne.ownBoard = this.copyBoard(BOARD);
        this.playerOne.opponentBoard = this.copyBoard(BOARD);
    }

    copyBoard(board) {
        return JSON.parse(JSON.stringify(board));
    }

    populateP1Ships() {
        if (this.gameOver === null) {
            this.playerOne.populateShips();
            this.message = 'Player one is configuring their board!';
        }
    }

    setInitialState() {
        if (this.gameOver === null) {
            this.cpu.populateShips();
            this.cpu.randomizeConfiguration();
            this.gameOver = false;
            this.coinToss = Math.random() > .5 ? true : false;
            if (this.coinToss) {
                this.message = 'Player one goes first, you\'re up!'
            } else {
                this.message = 'CPU goes first.'
            }
        }
    }

    attack(coords) {
        if (this.gameOver === null || this.gameOver) {
            return this.status;
        }

        if (this.gameOver === false) {
            this.message = 'Game is in progress!';
            if (coords) {
                this.playerOneAttack(coords);
            } else {
                this.cpuAttack();
            }
        }
    }

    playerOneAttack(coords) {
        let {
            shipHit,
            message
        } = this.playerOne.fireTorpedo(coords, this.cpu);

        if (shipHit) {
            this.updateScore('playerOne');
        }

        this.checkGameStatus();
        this.playerOne.showBoards(message);
        if (message.includes('sunk')) {
            console.log(this.status.replace(/   /g, ''));
        }
    }

    cpuAttack() {
        var coords = this.cpu.generateGuess();

        let {
            shipHit,
            message
        } = this.cpu.fireTorpedo(coords, this.playerOne, true);
        this.cpu.allGuesses.add(coords);

        if (shipHit) {
            this.updateScore('cpu');
            this.cpu.hits.unshift(coords);
        }

        this.checkGameStatus();
        this.playerOne.showBoards(message);
        if (message.includes('sunk')) {
            this.cpu.hits = [];
            this.cpu.nextGuesses = [];
            console.log(this.status.replace(/   /g, ''));
        }
    }

    checkGameStatus() {
        if (this.cpuScore === 17) {
            this.message = ' CPU wins! Do you dare to challenge again?';
            this.gameOver = true;
            return;
        } else if (this.playerOneScore === 17) {
            this.message = ' You win! Would you like to play again?';
            this.gameOver = true;
            return;
        }

        if (this.cpuScore === this.playerOneScore) {
            this.message = 'Uh oh, this is a close game!';
        } else if (this.cpuScore > this.playerOneScore) {
            this.message = 'How does it feel to be losing to a machine?';
        } else {
            this.message = 'Keep it up, and you might not lose!';
        }
    }

    updateScore(player) {
        if (player === 'cpu') {
            this.cpuScore++;
        } else {
            this.playerOneScore++;
        }
    }

    reset() {
        this.playerOne = new PlayerOne();
        this.cpu = new Cpu();
        this.message = 'The game is not yet initialized!';
        this.coinToss = null;
        this.playerOneScore = 0;
        this.cpuScore = 0;
        this.gameOver = null;
        this.drawBoards(this.boardSize);
    }

    get status() {
        var progressCpu = new Progress(17);
        var progressPlayerOne = new Progress(17);
        var cpuShips = [], playerOneShips = [];

        for (var cpuShip of this.cpu.ships) {
            if (!cpuShip.sunk) {
                let ship = cpuShip.type.slice(0, 1).toUpperCase() + cpuShip.type.slice(1);
                cpuShips.push(ship);
            }
        }

        for (var p1Ship of this.playerOne.ships) {
            if (!p1Ship.sunk) {
                let ship = p1Ship.type.slice(0, 1).toUpperCase() + p1Ship.type.slice(1);
                playerOneShips.push(ship);
            }
        }

        return     this.message + '\n\r' +
               `   CPU Score: ${chalk.cyan(progressCpu.update(this.cpuScore, 17))} (${this.cpuScore} of 17 hits)\n` +
               `   CPU ships in play: ${JSON.stringify(cpuShips)}\n\r` +
               `   P1 Score:  ${chalk.cyan(progressPlayerOne.update(this.playerOneScore, 17))} (${this.playerOneScore} of 17 hits)\n` +
               `   P1 ships in play: ${JSON.stringify(playerOneShips)}\n`;
    }
}


module.exports = Game;
