const Player               = require('./Player');
const { parseCoordinates } = require('../utils/helpers');

class Cpu extends Player {
    constructor() {
        super();
        this.lastHit = null;
        this.prevHit = null;
        this.allGuesses = new Set();
        this.nextGuesses = [];
        this.boardSize = null;
        this.rows = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
    }

    randomizeConfiguration() {
        const ships = ['cruiser','submarine','battleship','destroyer','carrier'];
        const directions = ['l', 'r', 'u', 'd'];
        var index = 0;
        while (index < 5) {
            let coords = this.wildGuess();
            let direction = directions[Math.floor(Math.random() * 4)];
            if (this.configureShip(ships[index], coords, direction, true)) {
                index++;
            }
        }
    }

    wildGuess() {
        return this.rows[Math.floor(Math.random() * this.boardSize)] + Math.ceil(Math.random() * this.boardSize);
    }

    smartGuess() {
        // generate up to 4 of the "next best guesses" based
        // on last hit - the next most likely hits will be
        // the four spaces surrounding the pos of last hit.
        const { row, col } = parseCoordinates(this.lastHit);
        const rows = this.rows;
        rows.unshift('_');
        var nextBestGuesses = [];
        if (row > 1) {
            var upOne = rows[row-1] + (col);
            if (!this.allGuesses.has(upOne)) {
                nextBestGuesses.push(upOne);
            }
        }
        if (row < 10) {
            var downOne = rows[row+1] + (col);
            if (!this.allGuesses.has(downOne)) {
                nextBestGuesses.push(downOne);
            }
        }
        if (col > 1) {
            var backOne = rows[row] + (col-1);
            if (!this.allGuesses.has(backOne)) {
                nextBestGuesses.push(backOne);
            }
        }
        if (col < 10) {
            var overOne = rows[row] + (col+1);
            if (!this.allGuesses.has(overOne)) {
                nextBestGuesses.push(overOne);
            }
        }

        this.nextGuesses = nextBestGuesses;
    }

    // TODO: add "streak" fucntionality where computer detects
    // multiple hits in a row, and narrows down guess based
    // on available info. i.e. make guess in same direction
    // as previous 2 hits (left or right || up or down)
    generateCpuGuess() {
        if (this.lastHit && this.lastHit !== this.prevHit) {
            // if last hit is different than previous hit a new hit
            // has been made, and new guesses should be formulated
            this.prevHit = this.lastHit;
            this.smartGuess();
        }

        // this covers edge cases of computer not being able to generate
        // any next best guesses, if all surrounding spaces have already
        // been guessed, and the case in which the nextGuesses array is
        // depleted before a new hit can be made => revert to wildGuess.
        var guess = this.nextGuesses.length ? this.nextGuesses.pop() : this.wildGuess();

        // prevent duplicate wildGuesses
        // all smartGuesses are checked before this point
        while (this.allGuesses.has(guess)) {
            guess = this.wildGuess();
        }

        return guess;
    }

}

module.exports = Cpu;
