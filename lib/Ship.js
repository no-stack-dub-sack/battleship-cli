class Ship {
    constructor(type, size, abbreviation) {
        this.hits = 0;
        this.type = type;
        this.size = size;
        this.sunk = false;
        this.placed = false;
        this.abbreviation = abbreviation;
    }

    incrementHits() {
        this.hits++;
        this.sinkShip();
    }

    sinkShip() {
        if (this.hits === this.size) {
            this.sunk = true;
        }
    }

}

module.exports = Ship;
