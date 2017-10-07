# Battleship-Cli
A super cool, fun, and easy to play command line implementation of Battleship, the classic 2-player guessing game. Built in JavaScript, `battleship-cli` is a simple NodeJS program, with CLI interface enabled by __[InquirerJS](https://github.com/SBoudrias/Inquirer.js/)__, and colorized by __[chalk](https://github.com/chalk/chalk)__.

![image](http://res.cloudinary.com/dmvcjmjkn/image/upload/v1507261203/battleship_demo_o2qgml.gif)

## Requirements:
- Node

## Installation & Usage:
- __With NPM:__
  - `npm install -g battleship-cli`
- __With Yarn:__
  - `yarn global add battleship-cli`
- __Manually (for hacking):__
  - clone repo
  - run `npm install` or `yarn install` to install dependencies
  - run `npm i -g` to make the module available globally
- __To play:__
  - In your favorite terminal, simply run the `battleship` command from any directory
  - For the best experience use a terminal that has full color and emoji support

## Battleship-CLI Instructions

_Type `help` and hit return at any time during gameplay to show these instructions._

### Other helpful commands:
- Type `show score` at any time to check the status of the game.
- Type `quit` or `q` at any time to quit the game.

### Settings:
- __NOTE:__ If your terminal does not support Emojis, please disable Emojis in the settings menu.
- For a more challenging game, you can choose a larger board size.
- You can also adjust the computer's skill level.

### How to win:
- Each player has a battlefield represented by a 10x10 grid on which they place 5 ships, hidden to their opponent.
- The goal of the game is sink all of your opponents ships! A ship is sunk when it is hit once for each space it occupies.
- In other words, a submarine, which occupies 3 spaces, is sunk after being hit 3 times.
- The 5 ships occupy 17 total spaces, so the first player to register 17 hits wins!

### Gameplay:
- To play, follow the prompts to configure your five ships in any pattern you'd like (diagonal placements are not allowed).
- Valid configuration instructions include a ship name, a starting coordinate (A1-J10 for default 10x10 board), and a direction (right, left, up or down).
- For example: `submarine e3 up` or `carrier j7 left`. Ships cannot overlap, and you must stay within the bounds of the board.
- Once both players have configured their ships, the race is on to sink your opponent's ships before they sink yours!
- Fire torpedoes at your opponent's ships by guessing coordinates on the 10x10 board.
- Rows are represented by the letters A-J, and columns with the numbers 1-10 (10x10 board).
- Valid guesses include a row followed by a column, e.g. `A1`, `B7`, `J10`, etc.
- You will be informed if you've hit, missed, or sunk a ship.
- Sink all 5 of the computer's ships to win!

### Hint:
- When placing ships, you can also use abbreviations to make your life easier!
- Use the ship's abbreviations (see legend), and single letters for directions.
- e.g. `btl a9 r` or `cru i6 u`

### Legend:
- Battleship (BTL), 4 spaces
- Carrier (CAR), 5 spaces
- Cruiser (CRU), 3 spaces
- Destroyer (DST), 2 spaces
- Submarine (SUB), 3 spaces
- A hit looks like 💥 or ` X ` (depending on Emoji support)
- A miss looks like ❌ or ` 0 ` (depending on Emoji support)  

## Screenshots:
### Placing Ships
![image](https://user-images.githubusercontent.com/18563015/31310408-9a65e070-ab65-11e7-829f-c5cf1d37e9a2.png)

### Check Score
![image](https://user-images.githubusercontent.com/18563015/31310598-f4ed1650-ab68-11e7-977a-6c53dd4c7559.png)

### 20x20 Board
![image](https://user-images.githubusercontent.com/18563015/31310450-83c47e52-ab66-11e7-80cb-34666fd67117.png)

### Gameplay (10x10 Emoji Board)
![image](https://user-images.githubusercontent.com/18563015/31310508-3c14a612-ab67-11e7-8841-9779f360afa7.png)

### Gameplay (12x12 Plain Board)
![image](https://user-images.githubusercontent.com/18563015/31310549-df1bad4c-ab67-11e7-83b4-1520d35ae568.png)

### Helpful Validations
![image](https://user-images.githubusercontent.com/18563015/31261966-d2a2a252-aa25-11e7-8b35-31e89decf972.png)
![image](https://user-images.githubusercontent.com/18563015/31262035-3cd1d3b4-aa26-11e7-92b5-526acebaf46e.png)
![image](https://user-images.githubusercontent.com/18563015/31259657-6cbbbed8-aa16-11e7-9f30-085b48ad5ed9.png)
![image](https://user-images.githubusercontent.com/18563015/31310563-0e8155a0-ab68-11e7-8f35-70fce409ec19.png)

### In-Game Instructions
![image](https://user-images.githubusercontent.com/18563015/31310573-36a20250-ab68-11e7-8268-8e025669476c.png)
