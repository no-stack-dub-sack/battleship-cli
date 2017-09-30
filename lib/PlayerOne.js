const Player    = require('./Player');
const replacify = require('../utils/helpers/replacify');
const chalk     = require('chalk');

class PlayerOne extends Player {
    get board() {
        return 'Your board looks like this:\n' + replacify(JSON.stringify(this.ownBoard));
    }

    showOpponentBoard(msg) {
        console.log(chalk.red('\n>> ') + msg + '\n\nHere\'s your hits and misses so far:');
        console.log(replacify(JSON.stringify(this.opponentBoard)) + '\n');
    }
}

module.exports = PlayerOne;
