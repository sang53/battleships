import { Board } from "./Board";
import { randomShipPlace } from "./cpu";
import {
  addListener,
  addToMain,
  afterSwitch,
  makeElement,
  removeListeners,
  resetDOM,
  toggleClass,
  appendRelative,
  placeShipElement,
} from "./DOM";
import { PLAYERS } from "./Player";
import { shotSelect } from "./shot-select";

let currShipRef; // stores currently selected ship || null
let lastPlaced; // stores last placed [keys] of selected ship || null; needed to allow ship movement to adj squares

// setup ship placement DOM elements
export function shipPlace() {
  const board = PLAYERS.currPlayer.board;

  document.querySelector("#main").classList.add("ship-select");
  addToMain(makeElement("h1", [], "Place Your Ships"));
  addToMain(
    makeElement(
      "p",
      [["class", "instructions"]],
      "Click ship to select\nClick square to place\nRotate ships in hangar",
    ),
  );
  addBoardHangar(board);
}

function selectShip(event) {
  event.stopPropagation();
  if (!event.currentTarget.classList.contains("ship")) return;

  // deselect currently selected ship
  if (deselect(getShipObj(currShipRef))) lastPlaced = null;
  // case: click selected ship => deselect only
  if (event.currentTarget === currShipRef) currShipRef = null;
  else {
    // select newly selected ship
    currShipRef = event.currentTarget;
    const shipObj = getShipObj(currShipRef);
    currShipRef.classList.add("selected");

    // save last placed & remove ship from board
    lastPlaced = getLastPlaced(shipObj);
    shipObj.unplace();
  }

  toggleConfirmBtn(
    PLAYERS.currPlayer.board.getShipsByPlaced(false).length === 0,
  );
}

function selectSquare(event) {
  const board = PLAYERS.currPlayer.board;
  if (event.target === board.boardRef) return;
  if (!currShipRef) return;

  const shipObj = getShipObj(currShipRef);
  const coords = Board.getCoordsFromId(event.target.id);
  // if possible: place selected ship on clicked square
  if (board.placeShip(shipObj, coords)) {
    placeShipElement(shipObj, board);
    lastPlaced = null;
    // allow confirm if all ships placed
    toggleConfirmBtn(!board.getShipsByPlaced(false).length);
  }

  // deselect ship
  if (deselect(shipObj)) lastPlaced = null;
  currShipRef = null;
}

function returnShip() {
  if (!currShipRef) return;
  const shipObj = getShipObj(currShipRef);
  // case: selected ship was not placed => return
  if (!shipObj.isPlaced()) return;

  // rotate ship to match hangar ships
  matchHangarOrient(shipObj);

  // unplace ship
  shipObj.unplace();
  resetShipElement(currShipRef);

  // deselect ship
  lastPlaced = null;
  deselect(shipObj);
  currShipRef = null;

  toggleConfirmBtn(false);
}

function rotateHangarShips(event) {
  event.stopPropagation();
  PLAYERS.currPlayer.board.getShipsByPlaced(false).forEach((shipObj) => {
    if (shipObj.shipRef !== currShipRef) rotateShip(shipObj);
  });
}

function confirmShips(event) {
  event.stopPropagation();

  resetShipPlace();
  PLAYERS.switchTurn();

  // case: second player is CPU => random place ships => next stage
  if (PLAYERS.isCPU()) {
    const board = PLAYERS.currPlayer.board;
    randomShipPlace(board);
    board.shipArr.forEach((ship) => placeShipElement(ship, board));
    PLAYERS.switchTurn();
  }
  // case: second controlled player turn => back to shipPlace()
  else if (PLAYERS.currTurn === 1) return afterSwitch(shipPlace, 1);

  // next stage
  document.querySelector("#main").classList.remove("ship-select");
  afterSwitch(shotSelect, 0);
}

function addBoardHangar(board) {
  const container = makeElement("div", [["id", "board-hangar-container"]]);
  addToMain(container);

  container.appendChild(board.boardRef);
  addListener(board.boardRef, "click", selectSquare);

  container.appendChild(getHangar());
  addShipsHangar(board.shipArr);
}

function getHangar() {
  const hangar = makeElement("div", [["class", "ship-container"]]);
  addListener(hangar, "click", returnShip);

  hangar.appendChild(getRotateBtn());
  hangar.appendChild(getConfirmBtn());
  return hangar;
}

function getRotateBtn() {
  const rotateButton = makeElement(
    "button",
    [["id", "rotate-button"]],
    "Rotate Ships",
  );
  addListener(rotateButton, "click", rotateHangarShips);
  return rotateButton;
}

function getConfirmBtn() {
  const confirmButton = makeElement(
    "button",
    [
      ["id", "confirm-button"],
      ["disabled", "true"],
    ],
    "Confirm Placement",
  );
  addListener(confirmButton, "click", confirmShips, true);
  return confirmButton;
}

function addShipsHangar(ships, selectShipFx = selectShip) {
  const hangar = document.querySelector(".ship-container");
  ships.forEach((shipObj) => {
    addListener(shipObj.shipRef, "click", selectShipFx);
    appendRelative(shipObj.shipRef, hangar.lastElementChild);
  });
}

// returns true if lastPlaced was used on the ship
function deselect(shipObj) {
  if (!shipObj) return false;
  shipObj.shipRef.classList.remove("selected");

  // case: ship was placed prior to selection => return ship to previous location
  if (lastPlaced) {
    shipObj.squareKeys = lastPlaced;
    return true;
  }
  return false;
}

// true/false => enable/disable confirm button
function toggleConfirmBtn(bool) {
  document.querySelector("#confirm-button").disabled = !bool;
}

// helper fx: ship DOM element ref => ship obj
function getShipObj(shipRef) {
  for (const shipObj of PLAYERS.currPlayer.board.shipArr) {
    if (shipObj.shipRef === shipRef) return shipObj;
  }
}

// returns last placed keys if ship was previously placed
function getLastPlaced(shipObj) {
  return shipObj.isPlaced() ? shipObj.squareKeys : null;
}

function resetShipElement(currShipRef) {
  appendRelative(
    currShipRef,
    document.querySelector(".ship-container").lastElementChild,
  );
  currShipRef.classList.remove("placed");
}

function matchHangarOrient(ship) {
  const hangarShip = document.querySelector(".ship-container .ship");
  if (!hangarShip) return;
  if (
    hangarShip.classList.contains("rotated") !==
    ship.shipRef.classList.contains("rotated")
  )
    rotateShip(ship);
}

function rotateShip(shipObj) {
  toggleClass(shipObj.shipRef, "rotated");
  shipObj.switchOrient();
}

function resetShipPlace() {
  // remove all elements from #main
  removeListeners();
  resetDOM();

  // reset variables for gc
  currShipRef = null;
  lastPlaced = null;
}
