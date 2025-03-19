import { showShips } from "./DOM";
import { PLAYERS } from "./Player";

export function victoryScreen() {
  showShips(PLAYERS.currPlayer.board);
  showShips(PLAYERS.oppPlayer.board);
}
