import { Board } from "./Board";
import { SETTINGS } from "./gameSettings";

class Player {
  board = new Board();
  constructor(playerNum) {
    this.playerNum = playerNum;
    this.aliveShips = SETTINGS.ships;
  }
}

export const PLAYERS = (function () {
  const players = [new Player(0), new Player(1)];
  let currTurn = 0;

  function nextTurn() {
    return currTurn === 0 ? 1 : 0;
  }

  function switchTurn() {
    currTurn = nextTurn();
  }

  function isCPU() {
    return SETTINGS.opp === "CPU" && currTurn === 1;
  }

  return {
    switchTurn,
    get currPlayer() {
      return players[currTurn];
    },
    get oppPlayer() {
      return players[nextTurn()];
    },
    get currTurn() {
      return currTurn;
    },
    isCPU,
  };
})();
