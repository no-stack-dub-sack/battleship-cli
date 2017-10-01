const Cpu                   = require('../Cpu');
const cpu                   = new Cpu();
const { isCoordinateValid } = require('../../utils/validateCoords');

function generateGuesses(num) {
    while (num > 0) {
        cpu.allGuesses.add(cpu.generateGuess());
        num--;
    }
}

describe('AI Logic Tests (easy & super easy settings, 10x10 board)', () => {
    beforeAll(() => {
        cpu.threshold = 10;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
    });

    it('generates correct guesses for super easy setting', () => {
        cpu.difficulty = 0;
        generateGuesses(100);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 10)).toBe(true);
        });
    });

    it('generates correct guesses for easy setting', () => {
        cpu.difficulty = 1;
        generateGuesses(100);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 10)).toBe(true);
        });
    });
});

describe('AI Logic Tests (easy & super easy settings, 12x12 board)', () => {
    beforeAll(() => {
        cpu.threshold = 12;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
    });

    it('generates correct guesses for super easy setting', () => {
        cpu.difficulty = 0;
        generateGuesses(100);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 12)).toBe(true);
        });
    });

    it('generates correct guesses for easy setting', () => {
        cpu.difficulty = 1;
        generateGuesses(100);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 12)).toBe(true);
        });
    });
});

describe('AI Logic Tests (easy & super easy settings, 15x15 board)', () => {
    beforeAll(() => {
        cpu.threshold = 15;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
    });

    it('generates correct guesses for super easy setting', () => {
        cpu.difficulty = 0;
        generateGuesses(225);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 15)).toBe(true);
        });
    });

    it('generates correct guesses for easy setting', () => {
        cpu.difficulty = 1;
        generateGuesses(225);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 15)).toBe(true);
        });
    });
});

describe('AI Logic Tests (easy & super easy settings, 20x20 board)', () => {
    beforeAll(() => {
        cpu.threshold = 20;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
    });

    it('generates correct guesses for super easy setting', () => {
        cpu.difficulty = 0;
        generateGuesses(400);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 20)).toBe(true);
        });
    });

    it('generates correct guesses for easy setting', () => {
        cpu.difficulty = 1;
        generateGuesses(400);
        cpu.allGuesses.forEach((coord) => {
            expect(isCoordinateValid(coord, 20)).toBe(true);
        });
    });
});
