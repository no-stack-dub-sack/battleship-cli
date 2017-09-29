const Player  = require('./Player');
const Cpu     = require('./Cpu');
const chalk   = require('chalk');

class Game {
    constructor() {
        this.playerOne = new Player();
        this.cpu = new Cpu();
        this.message = 'The game is not yet initialized!';
        this.playerOneScore = 0;
        this.cpuScore = 0;
        this.coinToss = null;
        this.gameOver = null;
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

    readyPlayerOne() {
        var shipsPlaced = 0;
        for (var ship of this.playerOne.ships) {
            if (ship.placed) {
                shipsPlaced++;
            }
        }

        if (shipsPlaced > 4) {
            return true;
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
        this.playerOne.showOpponentBoard(message);
    }


    cpuAttack() {
        var coords = this.cpu.generateCpuGuess();

        let {
            shipHit,
            message
        } = this.cpu.fireTorpedo(coords, this.playerOne, true);

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
        console.log(chalk.red('\n>> ') + message);
    }


    checkGameStatus() {
        if (this.cpuScore === 1) {
            this.message = ' CPU wins! Do you dare to challenge again?';
            this.gameOver = true;
        } else if (this.playerOneScore === 1) {
            this.message = ' You win! Would you like to play again?';
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


    reset() {
        this.playerOne = new Player();
        this.cpu = new Cpu();
        this.message = 'The game is not yet initialized!';
        this.coinToss = null;
        this.playerOneScore = 0;
        this.cpuScore = 0;
        this.gameOver = null;
    }


    get status() {
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
               `   CPU Score: ${this.cpuScore} of 17 hits\n` +
               `   CPU ships in play: ${JSON.stringify(cpuShips)}\n\r` +
               `   P1 Score: ${this.playerOneScore} of 17 hits\n` +
               `   P1 ships in play: ${JSON.stringify(playerOneShips)}`;
    }

}


module.exports = Game;
