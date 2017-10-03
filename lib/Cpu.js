const Player               = require('./Player');
const { ROWS }             = require('../utils/keys');
const { parseCoordinates } = require('../utils/validateCoords');

class Cpu extends Player {
    constructor() {
        super();
        this.lastHit = 'C3';
        this.prevHits = [];
        this.nextGuesses = [];
        this.allGuesses = new Set();
        this.difficulty = 3;
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
        var { row, col } = parseCoordinates(this.lastHit);
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
        console.log('before:', this.prevHits)
        // get hit before last
        if (this.prevHits[0]) {
            prevHit = parseCoordinates(this.prevHits[0]);
        }

        console.log(this.prevHit)

        // after parsing previous hit add
        // last hit to list for next iteration
        this.prevHits.unshift(this.lastHit);
        console.log('after:', this.prevHits)
        // starting coordinates
        var { row, col } = parseCoordinates(this.lastHit);

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
            // last two hits imply horizontal target
            if (prevHit.row === row) {
                // last two hits were next to each other
                if (Math.abs(prevHit.col - col) === 1) {
                    goHorz = true;
                }
            }
            // last two hits imply vertical target
            if (prevHit.col === col) {
                // last two hits were next to each other
                if (Math.abs(prevHit.row - row) === 1) {
                    goVert = true;
                }
            }
        }

        // search for possible coordinates

        // go left
        if (!goVert) {
            for (let iCol = col; iCol >= colMin; iCol--) {
                // ran into previous hit no more possible in this direction
                if (this.opponentBoard[row][iCol] === ' 0 ') {
                    break;
                } else {
                    if (this.opponentBoard[row][iCol] !== ' X ') {
                        nextBestGuesses.push(rows[row] + iCol);
                    }
                }
            }
        }

        // go up
        if (!goHorz) {
            for (let iRow = row; iRow >= rowMin; iRow--) {
                // ran into previous hit no more possible in this direction
                if (this.opponentBoard[iRow][col] === ' 0 ') {
                    break;
                } else {
                    if (this.opponentBoard[iRow][col] !== ' X ') {
                        nextBestGuesses.push(rows[iRow] + col);
                    }
                }
            }
        }

        // go right
        if (!goVert) {
            for (let iCol = col; iCol <= colMax; iCol++) {
                // ran into previous hit no more possible in this direction
                if (this.opponentBoard[row][iCol] === ' 0 ') {
                    break;
                } else {
                    if (this.opponentBoard[row][iCol] !== ' X ') {
                        nextBestGuesses.push(rows[row] + iCol);
                    }
                }
            }
        }

        // go down
        if (!goHorz) {
            for (let iRow = row; iRow <= rowMax; iRow++) {
                // ran into previous hit no more possible in this direction
                if (this.opponentBoard[iRow][col] === ' 0 ') {
                    break;
                } else {
                    if (this.opponentBoard[iRow][col] !== ' X ') {
                        nextBestGuesses.push(rows[iRow] + col);
                    }
                }
            }
        }

        // return the first possibility
        return nextBestGuesses[0];
    }

    cpuHard() {
        // if last hit is true, use
        // this algo to finish off ship
        if (this.lastHit) {
            return this.bestGuess();
        } else {
            return this.guessFailSafe(this.wildGuess());
        }
    }

    cpuMedium() {
        if (this.lastHit && this.lastHit !== this.prevHits[0]) {
            // if last hit is different than previous hit a new hit
            // has been made, and new guesses should be formulated
            this.prevHits.unshift(this.lastHit);
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
