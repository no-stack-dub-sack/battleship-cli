const Cpu                   = require('../Cpu');
const cpu                   = new Cpu();
const { isCoordinateValid } = require('../../utils/validateCoords');

const TEST_BOARD = [
	[' - ', ' 1 ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 ', ' 10'],
	[' A ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
	[' B ', 'BTL', 'BTL', 'BTL', 'BTL', '   ', '   ', 'CRU', '   ', '   ', '   '],
	[' C ', '   ', '   ', '   ', '   ', '   ', '   ', 'CRU', '   ', '   ', '   '],
	[' D ', '   ', '   ', '   ', '   ', '   ', '   ', 'CRU', '   ', '   ', '   '],
	[' E ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' F ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' G ', '   ', '   ', '   ', ' X ', ' X ', 'SUB', '   ', '   ', 'CAR', '   '],
	[' H ', '   ', 'DST', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' I ', '   ', 'DST', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' J ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ']
];

describe('Smart guess fucntionality', () => {
    beforeAll(() => {
        cpu.difficulty = 3;
        cpu.threshold = 10;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
        cpu.lastHit = null;
        cpu.prevHits = [];
        cpu.nextGuesses = [];
        cpu.opponentBoard = TEST_BOARD;
    });

    it('generates correct next guesses for last hit G5', () => {
        cpu.lastHit = 'G6';
        var guess1 = cpu.generateGuess();
        var guess2 = cpu.generateGuess();
        console.log(guess1, guess2);

        expect(guess1).toBeTruthy();
        expect(guess2).toBeTruthy();
    });
});
