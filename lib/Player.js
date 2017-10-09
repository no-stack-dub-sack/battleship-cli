const Ship  = require('./Ship');
const chalk = require('chalk');

const {
    parseCoordinates,
    isCoordinateValid,
} = require('../utils/validateCoords');

const {
    SHIP_KEY,
    ACCEPTED_DIRECTIONS
} = require('../utils/keys');

const {
    P1,
    CPU,
    INVALID,
    outOfBounds,
    duplicatePlacement,
} = require('../utils/messages');

class Player {
    constructor() {
        this.ownBoard = null;
        this.opponentBoard = null;
        this.threshold = null;
        this.ships = [];
    }

    populateShips() {
        this.ships.push(new Ship('cruiser', 3, 'CRU'));
        this.ships.push(new Ship('submarine', 3, 'SUB'));
        this.ships.push(new Ship('battleship', 4, 'BTL'));
        this.ships.push(new Ship('destroyer', 2, 'DST'));
        this.ships.push(new Ship('carrier', 5, 'CAR'));
    }

    fireTorpedo(coords, opponent, cpu) {
        const { row, col } = parseCoordinates(coords);
        const SPACE_ATTACKED = opponent.ownBoard[row][col];

        switch (SPACE_ATTACKED) {
            // miss:
            case '   ':
                this.updateBoard(row, col, ' 0 ', opponent.ownBoard);
                return { shipHit: false, message: cpu ? CPU.MISSED : P1.MISSED }
            // repeat:
            case ' 0 ':
            case ' X ':
                return { shipHit: false, message: cpu ? CPU.LOST_TURN : P1.LOST_TURN }
            // hits:
            default:
                this.updateBoard(row, col, ' X ', opponent.ownBoard);
                const MSG = opponent.updateShip(SPACE_ATTACKED.trim(), cpu);
                return { shipHit: true, message: MSG }
        }
    }

    updateShip(abbreviation, cpu) {
        for (var key in SHIP_KEY) {
            if (SHIP_KEY[key].abbreviation === abbreviation) {
                for (var ship of this.ships) {
                    if (ship.type === key) {
                        ship.incrementHits();
                        var __ship = key.slice(0, 1).toUpperCase() + key.slice(1)
                        if (ship.sunk) {
                            return !cpu
                                ? chalk.green(P1.SUNK_SHIP + __ship + '!')
                                : chalk.red(CPU.SUNK_SHIP + __ship + '!');
                        } else {
                            return !cpu
                                ? chalk.cyan(P1.HIT_SHIP)
                                : chalk.magenta(CPU.HIT_SHIP + __ship + '.');
                        }
                    }
                }
            }
        }
    }

    updateBoard(row, col, marker, opponentOwnBoard) {
        // update board once per turn for both players
        this.opponentBoard[row][col] = marker;
        opponentOwnBoard[row][col] = marker;
    }

    validateInstruction(ship, coords, direction) {
        if (!SHIP_KEY[ship]) {
            return { isValid: false, message: INVALID.SHIP };
        }

        if (!isCoordinateValid(coords, this.threshold)) {
            return { isValid: false, message: INVALID.COORDINATE() };
        }

        if (ACCEPTED_DIRECTIONS.indexOf(direction) === -1) {
            return { isValid: false, message: INVALID.DIRECTION };
        }

        for (let __ship of this.ships) {
            if ((__ship.type === ship || __ship.abbreviation === ship.toUpperCase()) && __ship.placed) {
                return { isValid: false, message: duplicatePlacement(__ship) };
            }
        }

        return { isValid: true };
    }

    /* used by both CPU and PlayerOne:
       * returns false if fails when CPU places ship
       * return message if fails when P1 places ship
       * returns undefined if successful for P1
       * return true if successful for CPU
       * this logic can probably stand to be refactored a bit
    **/
    configureShip(ship, coords, direction, cpu) {
        var instruction = this.validateInstruction(ship, coords, direction);

        if (!instruction.isValid) {
            if (cpu) {
                return false;
            } else {
                return instruction.message;
            }
        }

        var distance = SHIP_KEY[ship].size;
        const MARKER = SHIP_KEY[ship].abbreviation;
        var { row, col } = parseCoordinates(coords);
        const PREV_BOARD_STATE = JSON.parse(JSON.stringify(this.ownBoard));

        switch (direction) {
            case 'l':
            case 'left':
                while (distance > 0) {
                    if (this.ownBoard[row][col] === '   ') {
                        this.ownBoard[row][col--] = MARKER;
                        distance--;
                    } else {
                        return fail.apply(this);
                    }
                }
                break;
            case 'r':
            case 'right': {
                let i = 0;
                while (i < distance) {
                    if (this.ownBoard[row][col] === '   ') {
                        this.ownBoard[row][col++] = MARKER;
                        i++;
                    } else {
                        return fail.apply(this);
                    }
                }
                break;
            }
            case 'u':
            case 'up':
                while (distance > 0) {
                    if (this.ownBoard[row] && this.ownBoard[row][col] === '   ') {
                        this.ownBoard[row--][col] = MARKER;
                        distance--;
                    } else {
                        return fail.apply(this);
                    }
                }
                break;
            default: {
                let i = 0;
                while (i < distance) {
                    if (this.ownBoard[row] && this.ownBoard[row][col] === '   ') {
                        this.ownBoard[row++][col] = MARKER;
                        i++;
                    } else {
                        return fail.apply(this);
                    }
                }
                break;
            }
        }

        function fail() {
            this.ownBoard = PREV_BOARD_STATE;
            if (cpu) {
                return false;
            } else {
                const ROW_KEY = '0ABCDEFGHIJKLMNOPQRSTU';
                return outOfBounds(ROW_KEY[row]+col);
            }
        }

        this.updatePlacedShips(MARKER);

        if (cpu) {
            return true;
        } else {
            return;
        }
    }

    updatePlacedShips(marker) {
        for (var ship of this.ships) {
           if (ship.abbreviation === marker) {
               ship.placed = true;
           }
        }
    }
}

module.exports = Player;
