const Player = require('./Player');

class Cpu extends Player {
    constructor() {
        super();
        this.lastHit = null;
        this.prevHit = null;
        this.allGuesses = [];
        this.nextGuesses = [];
    }


    randomizeConfiguration() {
        const ships = ['cruiser','submarine','battleship','destroyer','carrier'];
        const directions = ['l', 'r', 'u', 'd'];
        var index = 0;
        while (index < 5) {
            let coords = this.wildGuess();
            let direction = directions[Math.floor(Math.random() * 4)];
            if (this.placeShip(ships[index], coords, direction, true)) {
                index++;
            }
        }
    }


    wildGuess() {
        const rows = ['A','B','C','D','E','F','G','H','I','J'];
        return rows[Math.floor(Math.random() * 10)] + Math.ceil(Math.random() * 10);
    }


    smartGuess() {
        // generate up to 4 of the "next best guesses" based
        // on last hit - the next most likely hits will be
        // the four spaces surrounding the pos of last hit.
        const { row, col } = this.parseCoordinates(this.lastHit);
        const rows = ['_','A','B','C','D','E','F','G','H','I','J'];
        var nextBestGuesses = [];
        if (row > 1) {
            var upOne = rows[row-1] + (col);
            if (this.allGuesses.indexOf(upOne) === -1) {
                nextBestGuesses.push(upOne);
            }
        }
        if (row < 10) {
            var downOne = rows[row+1] + (col);
            if (this.allGuesses.indexOf(downOne) === -1) {
                nextBestGuesses.push(downOne);
            }
        }
        if (col > 1) {
            var backOne = rows[row] + (col-1);
            if (this.allGuesses.indexOf(backOne) === -1) {
                nextBestGuesses.push(backOne);
            }
        }
        if (col < 10) {
            var overOne = rows[row] + (Number(col)+1);
            if (this.allGuesses.indexOf(overOne) === -1) {
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
        while (this.allGuesses.indexOf(guess) !== -1) {
            guess = this.wildGuess();
        }

        return guess;
    }

}

module.exports = Cpu;
