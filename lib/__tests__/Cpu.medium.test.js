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
        cpu.prevHits = [];
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

    it('generates correct next guesses for last hit P17', () => {
        cpu.threshold = 20;
        cpu.lastHit = 'P17';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(4);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['P18', 'P16', 'O17', 'Q17']));
    });

    it('generates correct next guesses for last hit M13', () => {
        cpu.threshold = 15;
        cpu.lastHit = 'M13';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(4);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['M14', 'M12', 'L13', 'N13']));
    });

    it('generates correct next guesses for last hit J12', () => {
        cpu.threshold = 12;
        cpu.lastHit = 'J12';
        cpu.smartGuess();

        expect(cpu.nextGuesses).toHaveLength(3);
        expect(cpu.nextGuesses)
            .toEqual(expect.arrayContaining(['J11', 'I12', 'K12']));
    });
});

describe('AI Logic Tests (medium, default setting)', () => {
    beforeAll(() => {
        cpu.difficulty = 2;
    });

    beforeEach(() => {
        cpu.allGuesses = new Set();
        cpu.lastHit = null;
        cpu.prevHits = [];
        cpu.nextGuesses = [];
    });

    it('generates correct series of guesses for last hit E7, then reverts to correct wild guess', () => {
        cpu.threshold = 10;
        cpu.lastHit = 'E7';
        cpu.allGuesses.add('E7');
        expect(cpu.generateGuess()).toBe('E8');
        cpu.allGuesses.add('E8');
        expect(cpu.generateGuess()).toBe('E6');
        cpu.allGuesses.add('E6');
        expect(cpu.generateGuess()).toBe('F7');
        cpu.allGuesses.add('F7');
        expect(cpu.generateGuess()).toBe('D7');
        cpu.allGuesses.add('D7');

        const lastGuess = cpu.generateGuess();
        expect(cpu.nextGuesses).toHaveLength(0);
        expect(isCoordinateValid(lastGuess)).toBe(true);
        expect(cpu.allGuesses.has(lastGuess) === false);
    });

    it('generates correct series of guesses to sink horizontal ship when first hit is left-most space', () => {
        // ship occupies E17-E20
        cpu.threshold = 20;
        cpu.lastHit = 'E17';
        cpu.allGuesses.add('E17');
        expect(cpu.generateGuess()).toBe('E18');
        cpu.lastHit = 'E18';
        cpu.allGuesses.add('E18');
        expect(cpu.generateGuess()).toBe('E19');
        cpu.lastHit = 'E19';
        cpu.allGuesses.add('E19');
        expect(cpu.generateGuess()).toBe('E20');
        cpu.lastHit = null;
        cpu.nextGuesses = [];
        cpu.allGuesses.add('E20');

        const lastGuess = cpu.generateGuess();
        expect(isCoordinateValid(lastGuess)).toBe(true);
        expect(cpu.allGuesses.has(lastGuess) === false);
    });

    it('generates correct series of guesses to sink horizontal ship when first hit is right-most space', () => {
        // ship occupies E12-E14
        cpu.threshold = 15;
        cpu.lastHit = 'E14';
        cpu.allGuesses.add('E14');
        expect(cpu.generateGuess()).toBe('E15');
        cpu.allGuesses.add('E15');
        expect(cpu.generateGuess()).toBe('E13');
        cpu.lastHit = 'E13';
        cpu.allGuesses.add('E13');
        expect(cpu.generateGuess()).toBe('E12');
        cpu.lastHit = null;
        cpu.nextGuesses = [];
        cpu.allGuesses.add('E12');

        const lastGuess = cpu.generateGuess();
        expect(isCoordinateValid(lastGuess)).toBe(true);
        expect(cpu.allGuesses.has(lastGuess) === false);
    });

    it('generates correct series of guesses to sink vertical ship when first hit is top-most space', () => {
        // ship occupies E8-H8
        cpu.threshold = 12;
        cpu.lastHit = 'E8';
        cpu.allGuesses.add('E8');
        expect(cpu.generateGuess()).toBe('E9');
        cpu.allGuesses.add('E9');
        expect(cpu.generateGuess()).toBe('E7');
        cpu.allGuesses.add('E7');
        expect(cpu.generateGuess()).toBe('F8');
        cpu.lastHit = 'F8';
        cpu.allGuesses.add('F8');
        expect(cpu.generateGuess()).toBe('F9');
        cpu.allGuesses.add('F9');
        expect(cpu.generateGuess()).toBe('F7');
        cpu.allGuesses.add('F7');
        expect(cpu.generateGuess()).toBe('G8');
        cpu.lastHit = 'G8';
        cpu.allGuesses.add('G8');
        expect(cpu.generateGuess()).toBe('G9');
        cpu.allGuesses.add('G9');
        expect(cpu.generateGuess()).toBe('G7');
        cpu.allGuesses.add('G7');
        expect(cpu.generateGuess()).toBe('H8');
        cpu.lastHit = null;
        cpu.nextGuesses = [];
        cpu.allGuesses.add('H8');

        const lastGuess = cpu.generateGuess();
        expect(isCoordinateValid(lastGuess)).toBe(true);
        expect(cpu.allGuesses.has(lastGuess) === false);
    });
});
