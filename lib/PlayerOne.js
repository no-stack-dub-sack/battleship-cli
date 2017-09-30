const Player        = require('./Player');
const chalk         = require('chalk');
const { replacify } = require('../utils/helpers');

class PlayerOne extends Player {
    get board() {
        return 'Your board looks like this:\n' + replacify(JSON.stringify(this.ownBoard));
    }

    showOpponentBoard(msg) {
        console.log(chalk.red('\n>> ') + msg + '\n\nHere\'s your hits and misses so far:');
        console.log(replacify(JSON.stringify(this.opponentBoard)));
    }
}

module.exports = PlayerOne;
