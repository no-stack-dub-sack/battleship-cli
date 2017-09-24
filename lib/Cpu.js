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
        // console.log(nextBestGuesses)
        // console.log('all guesses: ', this.allGuesses)
        this.nextGuesses = nextBestGuesses;
    }

    // TODO: add "streak" fucntionality where computer detects
    // multiple hits in a row, and narrows down guess based
    // on available info. i.e. make guess in same direction
    // as previous 2 hits (left or right || up or down)
    generateCpuGuess() {
        var guess;
        if (this.lastHit) {
            // if last hit is different than previous hit
            // a new hit has been made, and new guesses should be formulated
            if (this.lastHit !== this.prevHit) {
                this.prevHit = this.lastHit;
                this.smartGuess();
            }
            // if lastHit !== null, take a guess off of nextGuesses array
            // if lastHit is true, this array should never be empty
            // because another hit should be made before guesses
            // run out. When the cpu shinks a ship, lastHit
            // is reinitialized as null, and the cpu
            // reverts back to a wild guess
            // until another hit is made
            console.log(this.nextGuesses)
            guess = this.nextGuesses.length ? this.nextGuesses.pop() : this.wildGuess();

        } else {
            guess = this.wildGuess();
            while (this.allGuesses.indexOf(guess) !== -1) {
                guess = this.wildGuess();
            }
        }
        console.log(guess)
        return guess;
    }

}

module.exports = Cpu;
