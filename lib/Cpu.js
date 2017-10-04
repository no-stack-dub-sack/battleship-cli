const Player               = require('./Player');
const { ROWS }             = require('../utils/keys');
const { parseCoordinates } = require('../utils/validateCoords');

class Cpu extends Player {
    constructor() {
        super();
        this.hits = [];
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
        var { row, col } = parseCoordinates(this.hits[0]);
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

    bestGuess() {
        var nextBestGuesses = [],
            rows = ['_', ...ROWS],
            rowMin = 0,
            rowMax = 0,
            colMin = 0,
            colMax = 0,
            goVert = false,
            goHorz = false,
            prevHit = 0;

        // get hit before last
        if (this.hits[1]) {
            prevHit = parseCoordinates(this.hits[1]);
        }

        // starting coordinates
        var { row, col } = parseCoordinates(this.hits[0]);

        // search boundaries
        // 5 is greatest target size
        rowMin = row - 5;
        rowMax = row + 5;
        colMin = col - 5;
        colMax = col + 5;

        // ensure search boundaries are in bounds
        if (rowMin < 1) {
            rowMin = 1;
        }
        if (rowMax > this.threshold) {
            rowMax = this.threshold;
        }
        if (colMin < 1) {
            colMin = 1;
        }
        if (colMax > this.threshold) {
            colMax = this.threshold;
        }

        // see if we know the direction of the target
        if (prevHit.row || prevHit.col) {
            // equal rows across last 2 hits imply horizontal target
            // if abs val of diff of last 2 cols is 1, targets are next to eachother
            if (prevHit.row === row && Math.abs(prevHit.col - col) === 1) {
                goHorz = true;
            }
            // equal columns across last 2 hits imply vertical target
            // if abs val of diff of last 2 rows is 1, targets are next to eachother
            if (prevHit.col === col && Math.abs(prevHit.row - row) === 1) {
                goVert = true;
            }
        }

        // search for possible coordinates:

        // go left
        if (!goVert) {
            for (let iCol = col-1; iCol >= colMin; iCol--) {
                // ran into previous hit/miss no more possible in this direction
                if (this.opponentBoard[row][iCol] === ' 0 ') {
                    break;
                } else if (this.opponentBoard[row][iCol] !== ' X ') {
                    nextBestGuesses.push(rows[row] + iCol);
                }
            }
        }

        // go up
        if (!goHorz) {
            for (let iRow = row+1; iRow >= rowMin; iRow--) {
                // ran into previous hit/miss no more possible in this direction
                if (this.opponentBoard[iRow][col] === ' 0 ') {
                    break;
                } else if (this.opponentBoard[iRow][col] !== ' X ') {
                    nextBestGuesses.push(rows[iRow] + col);
                }
            }
        }

        // go right
        if (!goVert) {
            for (let iCol = col+1; iCol <= colMax; iCol++) {
                // ran into previous hit/miss no more possible in this direction
                if (this.opponentBoard[row][iCol] === ' 0 ') {
                    break;
                } else if (this.opponentBoard[row][iCol] !== ' X ') {
                    nextBestGuesses.push(rows[row] + iCol);
                }
            }
        }

        // go down
        if (!goHorz) {
            for (let iRow = row-1; iRow <= rowMax; iRow++) {
                // ran into previous hit/miss no more possible in this direction
                if (this.opponentBoard[iRow][col] === ' 0 ') {
                    break;
                } else if (this.opponentBoard[iRow][col] !== ' X ') {
                    nextBestGuesses.push(rows[iRow] + col);
                }
            }
        }

        // return the first possibility
        return nextBestGuesses[0];
    }

    cpuHard() {
        // if last hit is true, use
        // this algo to finish off ship
        if (this.hits[0]) {
            return this.bestGuess();
        } else {
            return this.guessFailSafe(this.wildGuess());
        }
    }

    cpuMedium() {
        if (this.hits[0] && this.hits[0] !== this.hits[1]) {
            // if last hit is different than previous hit a new hit
            // has been made, and new guesses should be formulated
            // this.hits.unshift(this.lastHit);
            this.smartGuess();
        }

        // this covers edge cases of computer not being able to generate
        // any next best guesses, if all surrounding spaces have already
        // been guessed, and the case in which the nextGuesses array is
        // depleted before a new hit can be made => revert to wildGuess.
        var guess = this.nextGuesses.length ? this.nextGuesses.pop() : this.wildGuess();

        // prevent duplicate wildGuesses
        // all smartGuesses are checked before this point
        return this.guessFailSafe(guess);
    }

    cpuEasy() {
        // wild guess every time
        // but prevent duplicate guesses
        return this.guessFailSafe(this.wildGuess());
    }

    cpuSuperEasy() {
        // wild guess every time
        // may be duplicate guesses
        return this.wildGuess();
    }

    guessFailSafe(guess) {
        while (this.allGuesses.has(guess)) {
            guess = this.wildGuess();
        }

        return guess;
    }

    generateGuess() {
        switch (this.difficulty) {
            case 3:
                return this.cpuHard();
            case 1:
                return this.cpuEasy();
            case 0:
                return this.cpuSuperEasy();
            default:
                return this.cpuMedium();
        }
    }
}

module.exports = Cpu;
