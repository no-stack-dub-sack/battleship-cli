const chalk = require('chalk');

const INSTRUCTIONS = `
Type '${chalk.red.underline('help')}' at any time to show these instructions.

${chalk.bold('Other helpful commands:')}
- Type '${chalk.keyword('orange').underline('show board')}' at any time to see your own board including ship configuration, ships hit, and misses.
- Type '${chalk.keyword('orange').underline('show score')}' at any time to check the status of the game.
- Type '${chalk.keyword('orange').underline('quit')}' at any time to quit the game.

${chalk.bold('How to win:')}
- Each player has a battlefield represented by a 10x10 grid on which they place 5 ships, hidden to their opponent.
- The goal of the game is sink all of your opponents ships! A ship is sunk when it is hit once for each space it occupies.
- In other words, a submarine, which occupies 3 spaces, is sunk after being hit 3 times.
- The 5 ships occupy 17 total spaces, so the first player to register 17 hits wins!

${chalk.bold('Gameplay:')}
- To play, follow the prompts to configure your five ships in any pattern you'd like (diagonal placements are not allowed).
- Valid configuration instructions include a ship name, a starting coordinate (A1-J10), and a direction (right, left, up or down).
- For example: "submarine e3 up" or "carrier j10 left". Ships cannot overlap, and you must stay within the bounds of the board.
- Once both players have configured their ships, the race is on to sink your opponent's ships before they sink yours!
- Fire torpedoes at your opponent's ships by guessing coordinates on the 10x10 board.
- Rows are represented by the letters A-J, and columns with the numbers 1-10.
- Valid guesses include a row followed by a column, e.g. A1, B7, J10, etc.
- You will be informed if you've hit, missed, or sunk a ship.
- Sink all 5 of the computer's ships to win!

${chalk.bold('Legend:')}
- Battleship, 4 spaces
- Carrier, 5 spaces
- Cruiser, 3 spaces
- Destroyer, 2 spaces
- Submarine, 3 spaces
- A hit looks like this: ${chalk.bgKeyword('orange').red.bold(' X ')}
- A miss looks like this: ${chalk.bgKeyword('blue').cyan.bold(' O ')}
`;

module.exports = INSTRUCTIONS;
