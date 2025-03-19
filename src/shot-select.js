import { getCPUShots } from "./cpu";
import {
  addListener,
  addToMain,
  afterSwitch,
  makeElement,
  removeListeners,
  hideShips,
  showShips,
} from "./DOM";
import { SETTINGS } from "./gameSettings";
import { PLAYERS } from "./Player";
import { Board } from "./Board";
import { victoryScreen } from "./victory";

let shots; // stores square Refs
let shotNum;

export function shotSelect() {
  document.querySelector("#main").classList.toggle("shot-select");
  addToMain(makeElement("h1", [], "Battle Phase"));
  addToMain(getBoardsDiv());
  addToMain(getStatsDiv());

  hideShips(PLAYERS.currPlayer.board);
  hideShips(PLAYERS.oppPlayer.board);

  setupTurn();
}

function setupTurn() {
  shots = new Set();
  shotNum = SETTINGS.shotType === "Single" ? 1 : PLAYERS.currPlayer.aliveShips;

  showShips(PLAYERS.currPlayer.board);
  addListener(PLAYERS.oppPlayer.board.boardRef, "click", selectShot);
  addListener(document.querySelector("#control-button"), "click", confirmShots);

  updateCtrlMsg(`Player ${PLAYERS.currTurn + 1}:\nSelect ${shotNum} Shots`);
  toggleCtrlBtn(false);
}

function selectShot(event) {
  if (!event.target.classList.contains("square")) return;
  const squareKey = Board.getKey(Board.getCoordsFromId(event.target.id));
  const oppBoard = PLAYERS.oppPlayer.board;
  if (oppBoard.shotSquares.has(squareKey)) return;

  if (shots.has(squareKey)) removeShot(event.target);
  else if (shotNum > shots.size) addShot(event.target);
  else if (shots.size === 1) {
    const prevShotSquare = oppBoard.getSquareRef(
      Board.getCoordsFromKey(Array.from(shots)[0]),
    );
    removeShot(prevShotSquare);
    addShot(event.target);
  }

  toggleCtrlBtn(shotNum === shots.size);
}

function confirmShots() {
  const hits = registerShots(PLAYERS.oppPlayer.board);

  updateCtrlMsg(
    `Player ${PLAYERS.currTurn + 1}:\nHits: ${hits}\nMisses: ${shots.size - hits}`,
  );
  updateStats(PLAYERS.oppPlayer.board);
  removeListeners();

  addListener(
    document.querySelector("#control-button"),
    "click",
    nextTurn,
    true,
  );
}

function registerShots(board) {
  let hits = 0;
  shots.forEach((key) => {
    const coords = Board.getCoordsFromKey(key);
    const ship = board.receiveShot(coords);
    const squareRef = board.getSquareRef(coords);

    squareRef.classList.remove("selected");
    if (ship) {
      hits++;
      squareRef.classList.add("hit");
      if (ship.receiveHit(key)) PLAYERS.oppPlayer.aliveShips--;
    } else squareRef.classList.add("shot");
  });
  return hits;
}

function updateStats(oppBoard) {
  const statDiv = document.querySelector(`#stats-player${PLAYERS.currTurn}`);
  let hitsTotal = 0;
  let shotsTotal = oppBoard.shotSquares.size;

  oppBoard.shipArr.forEach((ship) => {
    ship.squareKeys.forEach((key) => {
      if (oppBoard.shotSquares.has(key)) hitsTotal++;
    });
  });

  statDiv.innerText = getStatStr(hitsTotal, shotsTotal);
}

function nextTurn() {
  if (!PLAYERS.oppPlayer.aliveShips) {
    updateCtrlMsg(`Player ${PLAYERS.currTurn + 1} Wins!`);
    victoryScreen();
    return;
  }
  PLAYERS.switchTurn();

  if (PLAYERS.isCPU()) afterSwitch(cpuTurn, PLAYERS.currTurn);
  else {
    hideShips(PLAYERS.oppPlayer.board);
    afterSwitch(setupTurn, PLAYERS.currTurn);
  }
}

function cpuTurn() {
  shotNum = SETTINGS.shotType === "Single" ? 1 : PLAYERS.currPlayer.aliveShips;

  shots = getCPUShots(PLAYERS.oppPlayer.board, shotNum);
  confirmShots();
}

function getBoardsDiv() {
  const containerDiv = makeElement("div", [["id", "boards"]]);
  containerDiv.appendChild(PLAYERS.currPlayer.board.boardRef);
  containerDiv.appendChild(getController());
  containerDiv.appendChild(PLAYERS.oppPlayer.board.boardRef);
  return containerDiv;
}

function getController() {
  const container = makeElement("div", [["id", "control-container"]]);
  container.appendChild(makeElement("div", [["id", "control-msg"]]));
  container.appendChild(
    makeElement("button", [["id", "control-button"]], "Confirm"),
  );
  return container;
}

function getStatsDiv() {
  const container = makeElement("div", [
    ["id", "stats"],
    ["class", "box"],
  ]);
  container.appendChild(getPlayerStatDiv(0));
  container.appendChild(getPlayerStatDiv(1));
  return container;
}

function getPlayerStatDiv(num) {
  const statDiv = makeElement("div", [["class", "box"]]);
  statDiv.appendChild(makeElement("h4", [], `Player ${num + 1}:`));
  statDiv.appendChild(
    makeElement("div", [["id", `stats-player${num}`]], getStatStr(0, 0)),
  );

  return statDiv;
}

function getStatStr(hits, shots) {
  const acc = shots === 0 ? 0 : Math.round((hits / shots) * 100);
  return `Hits: ${hits} / ${(SETTINGS.ships * (SETTINGS.ships + 1)) / 2}\nShots: ${shots}\nAcc: ${acc}%`;
}

function updateCtrlMsg(str) {
  document.querySelector("#control-msg").innerText = str;
}

function toggleCtrlBtn(bool) {
  document.querySelector("#control-button").disabled = !bool;
}

function addShot(square) {
  const squareKey = Board.getKey(Board.getCoordsFromId(square.id));
  shots.add(squareKey);
  square.classList.add("selected");
}

function removeShot(square) {
  const squareKey = Board.getKey(Board.getCoordsFromId(square.id));
  shots.delete(squareKey);
  square.classList.remove("selected");
}
