const Player               = require('./Player');
const { ROWS }             = require('../utils/keys');
const { parseCoordinates } = require('../utils/validateCoords');

class Cpu extends Player {
    constructor() {
        super();
        this.lastHit = null;
        this.prevHit = null;
        this.threshold = null;
        this.nextGuesses = [];
        this.allGuesses = new Set();
        this.difficulty = 2;
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
        return ROWS[Math.floor(Math.random() * this.threshold)] + Math.ceil(Math.random() * this.threshold);
    }

    smartGuess() {
        // generate up to 4 of the "next best guesses" based
        // on last hit - the next most likely hits will be
        // the four spaces surrounding the pos of last hit.
        const { row, col } = parseCoordinates(this.lastHit);
        const rows = ['_', ...ROWS];
        var nextBestGuesses = [];
        if (row > 1) {
            var upOne = rows[row-1] + (col);
            if (!this.allGuesses.has(upOne)) {
                nextBestGuesses.push(upOne);
            }
        }
        if (row < this.threshold) {
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
        if (col < this.threshold) {
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
    cpuMedium() {
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

    cpuEasy() {
        // wild guess every time
        // but prevent duplicate guesses
        var guess = this.wildGuess();
        while (this.allGuesses.has(guess)) {
            guess = this.wildGuess();
        }

        return guess;
    }

    cpuSuperEasy() {
        // wild guess every time
        // may be duplicate guesses
        return this.wildGuess();
    }

    generateCpuGuess() {
        switch (this.difficulty) {
            case 1:
                return cpuEasy();
            case 0:
                return cpuSuperEasy();
                break;
            default:
                return cpuMedium();
        }
    }
}

module.exports = Cpu;
