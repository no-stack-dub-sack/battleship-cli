class Ship {
    constructor(type, size) {
        this.type = type;
        this.size = size;
        this.hits = 0;
        this.sunk = false;
        this.placed = false;
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
