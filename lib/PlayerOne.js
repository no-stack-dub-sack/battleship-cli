const Player        = require('./Player');
const chalk         = require('chalk');
const { replacify } = require('../utils/helpers');

class PlayerOne extends Player {
    get board() {
        return this.padHeader('YOUR BOARD:') + '\n' + replacify(this.ownBoard);
    }

    showBoards(msg) {
        console.log(
            chalk.red('>> ') + msg + '\n\n' +
            this.board + '\n\n' +
            this.padHeader('OPPONENT BOARD:') + '\n' + replacify(this.opponentBoard) + '\n'
        );
    }

    padHeader(str) {
        let pad;
        switch(this.threshold) {
            case 20:
                pad = 58;
                break;
            case 15:
                pad = 43;
                break;
            case 12:
                pad = 34;
                break;
            default:
                pad = 28;
        }

        if (str.startsWith('O')) {
            return '-'.repeat(pad-2) + str + '-'.repeat(pad-2);
        } else {
            return '-'.repeat(pad) + str + '-'.repeat(pad);
        }
    }
}

module.exports = PlayerOne;
