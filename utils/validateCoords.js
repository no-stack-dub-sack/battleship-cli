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
    var threshold = Number(process.env.BOARD_SIZE);
    const { row, col } = parseCoordinates(coords);
    if (coords.length > 3   ||
        !/[1-9]+/.test(col) ||
        row > threshold     ||
        col > threshold     ||
        row < 1             ||
        col < 1 ) {
        return false;
    }
    return true;
}

module.exports = {
    parseCoordinates,
    isCoordinateValid
};
