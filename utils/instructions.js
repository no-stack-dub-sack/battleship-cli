const chalk = require('chalk');

const INSTRUCTIONS = `
Type ${chalk.red('help')} and hit return at any time to show these instructions.

${chalk.bold('Other helpful commands:')}
- Type ${chalk.keyword('orange')('show board')} at any time to see your own board including ship configuration, ships hit, and misses.
- Type ${chalk.keyword('orange')('show score')} at any time to check the status of the game.
- Type ${chalk.keyword('orange')('quit')} or ${chalk.keyword('orange')('q')} at any time to quit the game.

${chalk.bold('How to win:')}
- Each player has a battlefield represented by a 10x10 grid on which they place 5 ships, hidden to their opponent.
- The goal of the game is sink all of your opponents ships! A ship is sunk when it is hit once for each space it occupies.
- In other words, a submarine, which occupies 3 spaces, is sunk after being hit 3 times.
- The 5 ships occupy 17 total spaces, so the first player to register 17 hits wins!

${chalk.bold('Gameplay:')}
- To play, follow the prompts to configure your five ships in any pattern you'd like (diagonal placements are not allowed).
- Valid configuration instructions include a ship name, a starting coordinate (A1-J10 for default 10x10 board), and a direction (right, left, up or down).
- For example: ${chalk.keyword('orange')('submarine e3 up')} or ${chalk.keyword('orange')('carrier j7 left')}. Ships cannot overlap, and you must stay within the bounds of the board.
- Once both players have configured their ships, the race is on to sink your opponent's ships before they sink yours!
- Fire torpedoes at your opponent's ships by guessing coordinates on the 10x10 board.
- Rows are represented by the letters A-J, and columns with the numbers 1-10.
- Valid guesses include a row followed by a column, e.g. A1, B7, J10, etc.
- You will be informed if you've hit, missed, or sunk a ship.
- Sink all 5 of the computer's ships to win!

${chalk.bold('Legend:')}
- Battleship (BTL), 4 spaces
- Carrier (CAR), 5 spaces
- Cruiser (CRU), 3 spaces
- Destroyer (DST), 2 spaces
- Submarine (SUB), 3 spaces
- A hit looks like this: ${chalk.bgKeyword('orange').red.bold(' X ')}
- A miss looks like this: ${chalk.bgKeyword('blue').cyan.bold(' 0 ')}

${chalk.bold('Hint:')}
- When placing ships, you can also use abbreviations to make your life easier!
- Use the ship's abbreviations (above), and single letters for directions.
- e.g. ${chalk.keyword('orange')('btl a9 r')} or ${chalk.keyword('orange')('cru i6 u')}
`;

module.exports = {
    INSTRUCTIONS,
    HELPER: `\n\nType the command ${chalk.keyword('orange')('show board')} and press ${chalk.green('return')} at any time to see your baord!\n`
}
