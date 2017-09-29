const Ship  = require('./Ship');
const chalk = require('chalk');

const {
    SHIP_KEY,
    replacify,
    parseCoordinates,
    isCoordinateValid,
    ACCEPTED_DIRECTIONS,
} = require('../utils/helpers');

const {
    turn,
    validate,
    outOfBounds,
    duplicatePlacement,
} = require('../utils/messages');

class Player {
    constructor() {
        this.ownBoard = [
            [ '   ', ' 1 ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 ', ' 10' ],
            [ ' A ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' B ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' C ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' D ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' E ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' F ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' G ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' H ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' I ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ],
            [ ' J ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ' ], ];
        this.opponentBoard = JSON.parse(JSON.stringify(this.ownBoard));
        this.ships = [];
    }

    showBoard() {
        return 'Your board looks like this:\n' + replacify(JSON.stringify(this.ownBoard));
    }

    showOpponentBoard(msg) {
        console.log(chalk.red('\n>> ') + msg + '\n\nHere\'s your hits and misses so far:');
        console.log(replacify(JSON.stringify(this.opponentBoard)) + '\n');
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
                this.updateBoard(
                    row,
                    col,
                    'O',
                    opponent.ownBoard
                );
                return {
                    shipHit: false,
                    message: cpu
                        ? turn.CPU_MISSED
                        : turn.YOU_MISSED
                }
            // repeat:
            case 'O':
            case 'X':
                return {
                    shipHit: false,
                    message: turn.LOST_TURN
                }
            // hits:
            default:
                this.updateBoard(
                    row,
                    col,
                    'X',
                    opponent.ownBoard
                );
                const HIT = opponent.updateShip(
                    SPACE_ATTACKED.trim(),
                    cpu
                );
                return {
                    shipHit: true,
                    message: HIT
                }
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
                                ? chalk.green(turn.YOU_SUNK + __ship + '!')
                                : chalk.red(turn.CPU_SUNK + __ship + '!\n');
                        } else {
                            return !cpu
                                ? chalk.green(turn.YOU_HIT)
                                : chalk.magenta(turn.CPU_HIT + __ship + '.\n');
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
        // validate ship argument
        if (!SHIP_KEY[ship]) {
            return {
                isValid: false,
                message: validate.SHIP
            };
        }
        // validate coordinate argument
        if (!isCoordinateValid(coords)) {
            return {
                isValid: false,
                message: validate.COORDINATE
            };
        }
        // validate direction argument
        if (ACCEPTED_DIRECTIONS.indexOf(direction) === -1) {
            return {
                isValid: false,
                message: validate.DIRECTION
            };
        }
        // prevent duplicate placement
        for (let __ship of this.ships) {
            if ((__ship.type === ship || __ship.abbreviation === ship.toUpperCase()) && __ship.placed) {
                return {
                    isValid: false,
                    message: duplicatePlacement(__ship)

                };
            }
        }
        return {
            isValid: true
        };
    }

    updatePlacedShips(marker) {
        for (var ship of this.ships) {
           if (ship.abbreviation === marker) {
               ship.placed = true;
           }
        }
    }

    placeShip(ship, coords, direction, cpu) {
        var instruction = this.validateInstruction(ship, coords, direction);

        if (!instruction.isValid) {
            if (cpu) return false;
            return instruction.message;
        }

        const ROW_KEY = '0ABCDEFGHIJ';
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
            }
            return outOfBounds(ROW_KEY[row]+col)
        }

        this.updatePlacedShips(MARKER);

        if (cpu) {
            return true;
        }

        return;
    }

}

module.exports = Player;
