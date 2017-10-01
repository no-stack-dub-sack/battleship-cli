const Cpu                   = require('../Cpu');
const cpu                   = new Cpu();
const { isCoordinateValid } = require('../../utils/validateCoords');

describe('Smart guess fucntionality', () => {
    beforeAll(() => {
        cpu.difficulty = 2;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
        cpu.lastHit = null;
        cpu.prevHit = null;
        cpu.nextGuesses = [];
    });

    it('generates correct next guesses for last hit E7, when E6 was already guessed', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'E7';
        cpu.allGuesses.add('E6');
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(3);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['E8', 'F7', 'D7']));
    });

    it('generates correct next guesses for last hit E7, when E8 & E6 were already guessed', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'E7';
        cpu.allGuesses.add('E6').add('E8');
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(2);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['F7', 'D7']));
    });

    it('generates correct next guesses for last hit E7, when E8, E6 & D7 were already guessed', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'E7';
        cpu.allGuesses.add('E6').add('E8').add('D7');
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(1);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['F7']));
    });

    it('generates correct next guesses for last hit E7, when E8, E6, F7 & D7 were already guessed', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'E7';
        cpu.allGuesses.add('E6').add('E8').add('D7').add('F7');
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(0);
    });

    it('generates correct next guesses for last hit A3', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'A3';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(3);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['A4', 'A2', 'B3']));
    });

    it('generates correct next guesses for last hit J10', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'J10';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(2);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['J9', 'I10']));
    });

    it('generates correct next guesses for last hit H1', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'H1';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(3);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['G1', 'I1', 'H2']));
    });

    it('generates correct next guesses for last hit D8', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'D8';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(4);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['D7', 'D9', 'C8', 'E8']));
    });
});

describe('AI Logic Tests (medium, default setting)', () => {
    beforeAll(() => {
        cpu.difficulty = 2;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
        cpu.lastHit = null;
        cpu.prevHit = null;
        cpu.nextGuesses = [];
    });

    it('generates correct next guess for last hit E7', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'E7';

        expect(cpu.generateGuess()).toBe('E8');
    });
});
