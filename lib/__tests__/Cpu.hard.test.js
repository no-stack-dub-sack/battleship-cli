const Cpu = require('../Cpu');
const cpu = new Cpu();

const TEST_BOARD = [
	[' - ', ' 1 ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 ', ' 10'],
	[' A ', '   ', '   ', 'BTL', '   ', '   ', '   ', ' 0 ', '   ', '   ', '   '],
	[' B ', '   ', '   ', 'BTL', '   ', '   ', '   ', ' X ', 'CRU', 'CRU', '   '],
	[' C ', '   ', '   ', 'BTL', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
	[' D ', '   ', '   ', ' X ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
	[' E ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', ' X ', '   '],
	[' F ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', ' X ', '   '],
	[' G ', '   ', '   ', '   ', 'SUB', ' X ', 'SUB', '   ', '   ', 'CAR', '   '],
	[' H ', '   ', ' X ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' I ', '   ', 'DST', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' J ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ']
];

const TEST_BOARD_2 = [
	[' - ', ' 1 ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 ', ' 10'],
	[' A ', '   ', '   ', 'BTL', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
	[' B ', '   ', '   ', 'BTL', 'DST', '   ', '   ', '   ', '   ', '   ', '   '],
	[' C ', '   ', '   ', ' X ', ' X ', '   ', '   ', '   ', '   ', '   ', '   '],
	[' D ', '   ', '   ', 'BTL', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
	[' E ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' F ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' G ', '   ', '   ', '   ', '   ', '   ', 'SUB', 'SUB', 'SUB', ' X ', '   '],
	[' H ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' I ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', 'CAR', '   '],
	[' J ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ', '   ']
];

describe('AI Logic Tests (sink ship / best guess fucntionality)', () => {

    beforeAll(() => {
        cpu.difficulty = 3;
        cpu.threshold = 10;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
        cpu.hits = [];
        cpu.nextGuesses = [];
        cpu.opponentBoard = TEST_BOARD;
    });

    it('sinks carrier, moving down correctly', () => {
        cpu.hits.unshift('F9', 'E9');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('D9');
        cpu.opponentBoard[4][9] = ' 0 ';

        var guess2 = cpu.generateGuess();
        expect(guess2).toBe('G9');
        cpu.opponentBoard[6][9] = ' X ';
        cpu.hits.unshift(guess2);

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('H9');
        cpu.opponentBoard[7][9] = ' X ';
        cpu.hits.unshift(guess3);

        var guess4 = cpu.generateGuess();
        expect(guess4).toBe('I9');
    });

    it('sinks submarine, moving left than right correctly', () => {
        cpu.hits.unshift('G5');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('G4');
        cpu.hits.unshift(guess1);

        var guess2 = cpu.generateGuess();
        expect(guess2).toBe('G3');
        cpu.opponentBoard[7][3] = ' 0 ';

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('G6');
    });

    it('sinks cruiser, moving right correctly', () => {
        cpu.hits.unshift('B7');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('B6');
        cpu.opponentBoard[2][6] = ' 0 ';

        var guess2 = cpu.generateGuess();
        expect(guess2).toBe('B8');
        cpu.hits.unshift('B8');

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('B9');
    });

    it('sinks battleship, moving up correctly', () => {
        cpu.hits.unshift('D3');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('D2');
        cpu.opponentBoard[4][2] = ' 0 ';

        var guess4 = cpu.generateGuess();
        expect(guess4).toBe('C3');
        cpu.hits.unshift('C3');
        cpu.opponentBoard[3][3] = ' X ';

        var guess5 = cpu.generateGuess();
        expect(guess5).toBe('B3');
        cpu.hits.unshift('B3');
        cpu.opponentBoard[2][3] = ' X ';

        var guess6 = cpu.generateGuess();
        expect(guess6).toBe('A3');
    });

    it('sinks destroyer, moving down correctly', () => {
        cpu.hits.unshift('H2');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('H1');
        cpu.opponentBoard[8][1] = ' 0 ';

        var guess2 = cpu.generateGuess();
        expect(guess2).toBe('G2');
        cpu.opponentBoard[7][2] = ' 0 ';

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('H3');
        cpu.opponentBoard[8][3] = ' 0 ';

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('I2');
    });
});

describe('AI Logic Tests (some edge cases)', () => {

    beforeAll(() => {
        cpu.difficulty = 3;
        cpu.threshold = 10;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
        cpu.hits = [];
        cpu.nextGuesses = [];
        cpu.opponentBoard = TEST_BOARD_2;
    });

    it('works with t-boned ships', () => {
        cpu.hits.unshift('G9');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('G8');
        cpu.hits.unshift(guess1);

        var guess2 = cpu.generateGuess();
        expect(guess2).toBe('G7');
        cpu.hits.unshift(guess2);

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('G6');
        cpu.hits.unshift(guess3);

        // sub sunk, start cycle over
        cpu.hits = [];

        var guess4 = cpu.generateGuess();
        expect(guess4).toBeTruthy();
    });

    it('works with adjacent ships', () => {
        cpu.hits.unshift('C3', 'C4');

        var guess1 = cpu.generateGuess();
        expect(guess1).toBe('C2');
        cpu.opponentBoard[3][2] = ' 0 ';

        var guess2 = cpu.generateGuess();
        expect(guess2).toBe('C5');
        cpu.opponentBoard[3][5] = ' 0 ';

        var guess3 = cpu.generateGuess();
        expect(guess3).toBe('B3');
        cpu.hits.unshift('B3');
        cpu.opponentBoard[2][3] = ' X ';

        var guess4 = cpu.generateGuess();
        expect(guess4).toBe('A3');
        cpu.hits.unshift('A3');
        cpu.opponentBoard[1][3] = ' X ';

        var guess5 = cpu.generateGuess();
        expect(guess5).toBe('D3');
        cpu.hits.unshift('D3');
    });
});
