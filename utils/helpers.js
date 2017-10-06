const chalk = require('chalk');

module.exports = {
    drawBoard: function(size) {
        var board = [];
        var i = 0;
        while (i <= size) {
            if (i === 0) {
                board.push([' - ']);
            } else {
                board.push([String.fromCharCode(32, i+64, 32)]);
            }
            i++;
        }

        for (let row = 0; row < board.length; row++) {
            let i = 0;
            while (i < size) {
                if (row === 0) {
                    var col = String(i+1);
                    switch (col.length) {
                        case 1:
                            board[row].push(' ' + (i+1) + ' ');
                            break;
                        default:
                            board[row].push(' ' + (i+1));
                    }
                } else {
                    board[row].push('   ');
                }
                i++;
            }
        }

        return board;
    },
    replacify: function(board) {
        if (require('../index').emojiBoard) {
            return board
                .slice(1, -1)
                .replace(/\],/g, ']\n')
                .replace(/"/g, '\'')
                .replace(/\s\s\s/g, ' 🌊 ')
                .replace(/\sX\s/g, ' 💥 ')
                .replace(/\s0\s/g, ' ❌ ')
                .replace(/BTL|CAR|SUB|CRU|DST/g, ' 🚤 ');
        }

        return board
            .slice(1, -1)
            .replace(/\],/g, ']\n')
            .replace(/"/g, '\'')
            .replace(/\sX\s/g, chalk.bgKeyword('orange').red.bold(' X '))
            .replace(/\s0\s/g, chalk.bgKeyword('blue').cyan.bold(' 0 '));
    },
    salmon: function (str) {
        return chalk.keyword('salmon')(str);
    }
}
