const Ship   = require('./Ship');
const chalk = require('chalk');

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
        this.shipKey = {
            'cruiser': { size: 3, abbreviation: 'CRU' },
            'submarine': { size: 3, abbreviation: 'SUB' },
            'destroyer': { size: 2, abbreviation: 'DST' },
            'carrier': { size: 5, abbreviation: 'CAR' },
            'battleship': { size: 4, abbreviation: 'BTL' },
            'cru': { size: 3, abbreviation: 'CRU' },
            'sub': { size: 3, abbreviation: 'SUB' },
            'dst': { size: 2, abbreviation: 'DST' },
            'car': { size: 5, abbreviation: 'CAR' },
            'btl': { size: 4, abbreviation: 'BTL' }
        };
    }


    showBoard() {
        return 'Your board looks like this:\n' +
               JSON.stringify(this.ownBoard).slice(1, -1).replace(/\],/g, ']\n').replace(/"/g, '\'');
    }



    showOpponentBoard(msg) {
        console.log(chalk.red('\n>> ') + msg + '\n\nHere\'s your hits and misses so far:');
        console.log(JSON.stringify(this.opponentBoard).slice(1, -1).replace(/\],/g, ']\n').replace(/"/g, '\''));
    }


    populateShips() {
        this.ships.push(new Ship('cruiser', 3, 'CRU'));
        this.ships.push(new Ship('submarine', 3, 'SUB'));
        this.ships.push(new Ship('battleship', 4, 'BTL'));
        this.ships.push(new Ship('destroyer', 2, 'DST'));
        this.ships.push(new Ship('carrier', 5, 'CAR'));
    }


    fireTorpedo(coords, opponent, cpu) {
        const { row, col } = this.parseCoordinates(coords);
        const SPACE_ATTACKED = opponent.ownBoard[row][col];

        const YOU_MISSED = 'Drats, you missed!'
        const CPU_MISSED = 'The computer missed. Hard to believe.\n'
        const LOST_TURN = 'You already guessed that space!\nI have zero sympathy, and you lose a turn.';

        switch (SPACE_ATTACKED) {

            // MISS:
            case '   ':
                this.updateBoard(
                    row,
                    col,
                    '🕳',
                    opponent.ownBoard
                );
                return {
                    shipHit: false,
                    message: cpu
                        ? CPU_MISSED
                        : YOU_MISSED
                }

            // REPEAT:
            case ' 🕳 ':
            case ' 💥 ':
                return {
                    shipHit: false,
                    message: LOST_TURN
                }

            // HITS:
            default:
                this.updateBoard(
                    row,
                    col,
                    '💥',
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
        const YOU_SUNK = 'You bastard! You sunk the computer\'s ';
        const CPU_SUNK = 'Ha ha! The computer sunk your ';
        const CPU_HIT = 'Uh oh. The computer hit your ';
        const YOU_HIT = 'You hit a ship!';

        for (var key in this.shipKey) {
            if (this.shipKey[key].abbreviation === abbreviation) {
                for (var ship of this.ships) {
                    if (ship.type === key) {
                        ship.incrementHits();
                        var __ship = key.slice(0, 1).toUpperCase() + key.slice(1)
                        if (ship.sunk) {
                            return !cpu
                                ? chalk.green(YOU_SUNK + __ship + '!')
                                : chalk.red(CPU_SUNK + __ship + '!\n');
                        } else {
                            return !cpu
                                ? chalk.green(YOU_HIT)
                                : chalk.magenta(CPU_HIT + __ship + '.\n');
                        }
                    }
                }
            }
        }
    }


    updateBoard(row, col, marker, opponentOwnBoard) {
        // update board once per turn for both players
        this.opponentBoard[row][col] = ' ' + marker + ' ';
        opponentOwnBoard[row][col] = ' ' + marker + ' ';
    }


    parseCoordinates(coords) {
        return {
            row: coords[0].toUpperCase().charCodeAt(0) - 64,
            col: coords.slice(1)
        }
    }


    isCoordinateValid(coords) {
        if (!coords) {
            return false;
        }

        const { row, col } = this.parseCoordinates(coords);

        if (coords.length > 3   ||
            !/[1-9]+/.test(col) ||
            row > 10 ||
            col > 10 ||
            col < 1  ||
            col < 1  ) {
            return false;
        }

        return true;
    }


    validateInstruction(ship, coords, direction) {
        // validate ship argument
        if (!this.shipKey[ship]) {
            return {
                isValid: false,
                message: `Please enter a valid ship: \'Battleship\', \'Crusier\', \'Carrier\', \'Submarine\', or \'Destroyer\'`
            };
        }
        // validate coordinate argument
        if (!this.isCoordinateValid(coords)) {
            return {
                isValid: false,
                message: 'Please enter valid starting coordinate! i.e. A1 - J10\n'
            };
        }
        // validate direction argument
        const ACCEPTED_DIRECTIONS = ['l', 'r', 'left', 'right', 'u', 'd', 'up', 'down'];
        if (ACCEPTED_DIRECTIONS.indexOf(direction) === -1) {
            return {
                isValid: false,
                message: 'Please enter a valid direction! e.g. \'Right\', \'Left\', \'Up\', \'Down\', or \'R\', \'L\', \'U\', \'D\'\n'
            };
        }
        // prevent duplicate placement
        for (let __ship of this.ships) {
            if ((__ship.type === ship || __ship.abbreviation === ship.toUpperCase()) && __ship.placed) {
                return {
                    isValid: false,
                    message: `You have already placed your ${__ship.type.slice(0, 1).toUpperCase() + __ship.type.slice(1)}!\n`

                };
            }
        }
        return {
            isValid: true
        };
    }


    placeShip(ship, coords, direction, cpu) {
        var instruction = this.validateInstruction(ship, coords, direction);

        if (!instruction.isValid) {
            if (cpu) return false;
            return instruction.message;
        }

        const ROW_KEY = '0ABCDEFGHIJ';
        var distance = this.shipKey[ship].size;
        const MARKER = this.shipKey[ship].abbreviation;
        var { row, col } = this.parseCoordinates(coords);
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

            var failureCoord = ROW_KEY[row]+col;
            return `${failureCoord} is either occupied or out of bounds!\n` +
                   '   Please enter valid, unoccupied coordinates, i.e. A1 - J10\n';
        }

        // update placed ships
        for (var __ship of this.ships) {
           if (__ship.abbreviation === MARKER) {
               __ship.placed = true;
           }
        }

        if (cpu) {
            return true;
        }

        return;
    }

}

module.exports = Player;
