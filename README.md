## **Battleships Project**

_Portfolio link: https://portfolio-sang-won-cho.netlify.app/_
_Deployed link: https://sang53.github.io/TheOdinProject/battleship/dist/index.html_

This project was made as part of The Odin Project online course to incorporate everything learned about THML, CSS & JavaScript.

In addition to the original specifications _(shown below)_, I have added more functionality to the game to properly recreate the board game experience to the browser.

Planning, code review (by friend) & reflection files are located in plan/

## **Functionality**

### Landing Page:

- Read instructions on how to play the game & explanation of the settings
- Choose between single player against the CPU or switch-screen multiplayer
- Customise settings: how many shots are available each turn

### Ship Placement:

- Place ships onto your board at desired location
- Ships can be rotated or reset back into the Harbour
- Confirm placements once finished

### Shot Selection:

- Alternate between players to select shots on opponents board
- Displays state of boards for both players
- After confirming shots, displays the result of the shots
- CPU has an algorithm to shoot adjacent squares of previous hits & follow orientation once a ship has been hit multiple times
- Displays overall statistics of the game, including hit% and remaining ships/squares

### End Screen:

- Once all of a players ships have been sunk, displays both players ships & shots
- Declares the winning player

## **Technologies Used**

- JavaScript, CSS, HTML

## **Project Specifications** _(from The Odin Project)_

- Begin your app by creating the Ship class/factory (your choice).

  - Your ‘ships’ will be objects that include their length, the number of times they’ve been hit and whether or not they’ve been sunk.
  - REMEMBER you only have to test your object’s public interface. Only methods or properties that are used outside of your ‘ship’ object need unit tests.
  - Ships should have a hit() function that increases the number of ‘hits’ in your ship.
  - isSunk() should be a function that calculates whether a ship is considered sunk based on its length and the number of hits it has received.

- Create a Gameboard class/factory.

  - Note that we have not yet created any User Interface. We should know our code is coming together by running the tests. You shouldn’t be relying on console.log or DOM methods to make sure your code is doing what you expect it to.
  - Gameboards should be able to place ships at specific coordinates by calling the ship factory or class.
  - Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
  - Gameboards should keep track of missed attacks so they can display them properly.
  - Gameboards should be able to report whether or not all of their ships have been sunk.

- Create a Player class/factory.

  - There will be two types of players in the game, ‘real’ players and ‘computer’ players.
  - Each player object should contain its own gameboard.

- Import your classes/factories into another file, and drive the game using event listeners to interact with your objects. Create a module that helps you manage actions that should happen in the DOM.

  - At this point it is appropriate to begin crafting your User Interface.
  - Set up a new game by creating Players. For now just populate each player’s Gameboard with predetermined coordinates. You are going to implement a system for allowing players to place their ships later.
  - We’ll leave the HTML implementation up to you for now, but you should display both the player’s boards and render them using information from the Gameboard class/factory.
  - You’ll need methods to render each player’s Gameboard, so put them in an appropriate module.
  - Your event listeners should step through the game turn by turn using only methods from other objects. If at any point you are tempted to write a new function, step back and figure out which class or module that function should belong to.
  - For attacks, let the user click on a coordinate in the enemy Gameboard. Send the user input to methods on your objects, and re-render the boards to display the new information.
  - Players should take turns playing the game by attacking the enemy Gameboard. If you feel the need to keep track of the current player’s turn, it’s appropriate to manage that in this module, instead of another mentioned object.
  - The game is played against the computer, so make the ‘computer’ players capable of making random plays. The computer does not have to be smart, but it should know whether or not a given move is legal (i.e. it shouldn’t shoot the same coordinate twice).
  - Create conditions so that the game ends once one player’s ships have all been sunk. This function is also appropriate for this module.

- Finish it up by implementing a system that allows players to place their ships. For example, you can let them type coordinates for each ship or have a button to cycle through random placements.

- Extra credit
  - Make your battleship project more impressive by introducing any of these modifications.
  - Implement drag and drop to allow players to place their ships.
  - Create a 2-player option that lets users take turns by passing the laptop back and forth, or by spinning the monitor around on a desktop. Implement a ‘pass device’ screen so that players don’t see each other’s boards!
  - Polish the intelligence of the computer player by having it try adjacent slots after getting a ‘hit’.
