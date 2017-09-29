const chalk = require('chalk');

function parseCoordinates(coords) {
    return {
        row: coords[0].toUpperCase().charCodeAt(0) - 64,
        col: coords.slice(1)
    }
}

function isCoordinateValid(coords) {
    if (!coords) {
        return false;
    }
    const { row, col } = parseCoordinates(coords);
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

function replacify(board) {
    return board
        .slice(1, -1)
        .replace(/\],/g, ']\n')
        .replace(/"/g, '\'')
        .replace(/X/g, chalk.bgKeyword('orange').red.bold(' X '))
        .replace(/O/g, chalk.bgKeyword('blue').cyan.bold(' O '))
}

const SHIP_KEY = {
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

const ACCEPTED_DIRECTIONS = ['l', 'r', 'left', 'right', 'u', 'd', 'up', 'down'];

module.exports = {
    ACCEPTED_DIRECTIONS,
    isCoordinateValid,
    parseCoordinates,
    replacify,
    SHIP_KEY
}
