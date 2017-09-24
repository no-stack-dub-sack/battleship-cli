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
            'battleship': { size: 4, abbreviation: 'BTL' }
        };
    }


    get showBoard() {
        console.log('Your board looks like this:');
        console.log(JSON.stringify(this.ownBoard).slice(1, -1).replace(/\],/g, ']\n').replace(/"/g, '\''));
        console.log();
    }



    showOpponentBoard(msg) {
        if (msg) {
            console.log(msg);
        }
        console.log(JSON.stringify(this.opponentBoard).slice(1, -1).replace(/\],/g, ']\n').replace(/"/g, '\''));
        console.log();
    }


    populateShips() {
        this.ships.push(new Ship('cruiser', 3));
        this.ships.push(new Ship('submarine', 3));
        this.ships.push(new Ship('battleship', 4));
        this.ships.push(new Ship('destroyer', 2));
        this.ships.push(new Ship('carrier', 5));
    }


    takeTurn(coords, opponent, cpu) {
        // THIS CAN GO NOW THAT COORDS ARE VALIDATED AT TIME OF ENTRY
        // if (!this.isCoordinateValid(coords)) {
        //     return {
        //         shipHit: false,
        //         message: 'Please enter valid coordinates! i.e. A1 - J10'
        //     }
        // }

        const { row, col } = this.parseCoordinates(coords);
        const guessedSpace = opponent.ownBoard[row][col];

        const missMsg = 'Drats, you missed!'
        const missMsgCpu = 'The computer missed. Hard to believe.'
        const boardUpdate = '\nHere\'s your hits and misses so far:\n';
        const lostTurnMsg = 'You already guessed that space!\nI have zero sympathy, and you lose a turn.';

        if (guessedSpace === '   ') {
            this.updateBoard(
                row, col, '🕳', opponent.ownBoard
            );
            return {
                shipHit: false,
                message: cpu
                    ? missMsgCpu + '\n'
                    : missMsg + boardUpdate
            }
        }

        else if (guessedSpace === ' 🕳 ' || guessedSpace === ' 💥 ') {
            return {
                shipHit: false,
                message: lostTurnMsg + boardUpdate
            }
        }

        else {
            this.updateBoard(
                row, col, '💥', opponent.ownBoard
            );

            var hitMsg = opponent.updateShips(guessedSpace.trim(), cpu);

            return {
                shipHit: true,
                message: cpu
                    ? hitMsg + '\n'
                    : hitMsg + boardUpdate
            }
        }
    }


    updateShips(abbreviation, cpu) {
        const sunkMsg = 'You bastard! You sunk the computer\'s ';
        const sunkMsgCpu = 'Ha ha! The computer sunk your ';
        const hitMsgCpu = 'Sweet. The computer hit your ';
        const dick = '!  Try not to be such a dick.';
        const losing = '! I think you\'re losing.';
        const hitMsg = 'You hit a CPU ship!';

        for (var key in this.shipKey) {
            if (this.shipKey[key].abbreviation === abbreviation) {
                for (var ship of this.ships) {
                    if (ship.type === key) {
                        ship.incrementHits();
                        var __ship = key.slice(0, 1).toUpperCase() + key.slice(1)
                        if (ship.sunk) {
                            return !cpu
                                ? sunkMsg + __ship + dick
                                : sunkMsgCpu + __ship + losing;
                        } else {
                            return !cpu
                                ? hitMsg
                                : hitMsgCpu + __ship + '.';
                        }
                    }
                }
            }
        }
    }


    updateBoard(row, col, marker, opponentOwnBoard) {
        // update board once per turn for both players
        this.opponentBoard[row][col] = this.renderMarker(marker);
        opponentOwnBoard[row][col] = this.renderMarker(marker);
    }


    parseCoordinates(coords) {
        const rowKey = '_abcdefghij';
        return {
            letter: coords[0].toLowerCase(),
            row: rowKey.indexOf(coords[0].toLowerCase()),
            col: coords.slice(1)
        }
    }


    renderMarker(str) {
        return ' ' + str + ' ';
    }


    isCoordinateValid(coords) {
        if (typeof coords !== 'string') {
            return false;
        }
        var { letter, col } = this.parseCoordinates(coords);
        letter = letter.charCodeAt(0);
        if (coords.length > 3 ||
            letter > 106 ||
            letter < 97 ||
            col  < 1 ||
            col > 10) {
            return false;
        }
        return true;
    }


    validateInstruction(ship, coords, direction) {
        // validate arguments types
        if (typeof direction !== 'string' ||
            typeof coords !== 'string' ||
            typeof ship !== 'string') {
            return {
                isValid: false,
                message: 'Please provide a ship, a starting coordinate, and a direction. e.g. \'Battleship, B5, Right\''
            };
        }
        // validate ship argument
        ship = ship.toLowerCase();
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
        const acceptedDirections = ['l', 'r', 'left', 'right', 'u', 'd', 'up', 'down'];
        direction = direction.toLowerCase();
        if (acceptedDirections.indexOf(direction) === -1) {
            return {
                isValid: false,
                message: 'Please enter a valid direction! e.g. \'Right\', \'Left\', \'Up\', \'Down\', or \'R\', \'L\', \'U\', \'D\'\n'
            };
        }
        // notify when placement complete
        var placed = 0;
        for (let sh of this.ships) {
            if (sh.placed) {
                placed++;
            }
            if (placed === 5) {
                return {
                    isValid: false,
                    message: 'You have placed all of your ships. Time to play!\n'
                };
            }
        }
         // prevent duplicate placement
        for (let sh of this.ships) {
            if (sh.type === ship && sh.placed) {
                return {
                    isValid: false,
                    message: `You have already placed your ${ship.slice(0, 1).toUpperCase() + ship.slice(1)}!\n`

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

        const rowKey = '0ABCDEFGHIJ';
        const prevBoardState = JSON.parse(JSON.stringify(this.ownBoard));

        ship = ship.toLowerCase();
        direction = direction.toLowerCase();
        var { row, col } = this.parseCoordinates(coords);
        const marker = this.shipKey[ship].abbreviation;
        var distance = this.shipKey[ship].size;


        if (direction === 'l' || direction === 'left') {
            while (distance > 0) {
                if (this.ownBoard[row][col] === '   ') {
                    this.ownBoard[row][col--] = marker;
                    distance--;
                } else {
                    return fail.apply(this);
                }
            }

        }

        else if (direction === 'r' || direction === 'right') {
            let i = 0;
            while (i < distance) {
                if (this.ownBoard[row][col] === '   ') {
                    this.ownBoard[row][col++] = marker;
                    i++;
                } else {
                    return fail.apply(this);
                }
            }
        }

        else if (direction == 'u' || direction === 'up') {
            while (distance > 0) {
                if (this.ownBoard[row] && this.ownBoard[row][col] === '   ') {
                    this.ownBoard[row--][col] = marker;
                    distance--;
                } else {
                    return fail.apply(this);
                }
            }

        }

        else if (direction == 'd' || direction === 'down') {
            let i = 0;
            while (i < distance) {
                if (this.ownBoard[row] && this.ownBoard[row][col] === '   ') {
                    this.ownBoard[row++][col] = marker;
                    i++;
                } else {
                    return fail.apply(this);
                }
            }
        }

        function fail() {
            this.ownBoard = prevBoardState;
            if (cpu) return false;

            var failureCoord = rowKey[row]+col;

            return `${failureCoord} is either occupied or out of bounds!\n` +
                   'Please enter valid, unoccupied coordinates, i.e. A1 - J10\n';

            // return this.showBoard;
        }

        // update placed ships
        for (var sh of this.ships) {
           if (sh.type === ship) {
               sh.placed = true;
           }
        }

        if (cpu) return true;
        return;

    }

}

module.exports = Player;
