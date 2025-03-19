import { makeElement } from "./DOM";
import { SETTINGS } from "./gameSettings";
import { Ship } from "./Ship";

export class Board {
  boardRef = makeElement("div", [["class", "board"]]);
  shotSquares = new Set();
  shipArr = Board.#makeShips();

  constructor(sides = SETTINGS.sides) {
    this.#makeSquares(sides);
  }

  // returns set of coords a ship will occupy
  #getSquares([x, y], length, orient) {
    const coordsSet = new Set();

    if (orient === "horizontal") {
      const x_max = x + length;
      if (x_max > SETTINGS.sides) return false;
      for (; x < x_max; x++) coordsSet.add(Board.getKey([x, y]));
    } else {
      const y_max = y + length;
      if (y_max > SETTINGS.sides) return false;
      for (; y < y_max; y++) coordsSet.add(Board.getKey([x, y]));
    }
    return coordsSet;
  }

  // returns squareKeys array if placement possible
  #checkShipSquare(shipObj, coords) {
    const squaresSet = this.#getSquares(coords, shipObj.length, shipObj.orient);
    // case: out of bounds
    if (!squaresSet.size) return [];

    for (const shipObj of this.shipArr) {
      // case: overlap with placed ship
      if (shipObj.squareKeys.some((key) => squaresSet.has(key))) return [];
    }
    return Array.from(squaresSet);
  }

  // returns true/false if placed/not placed
  placeShip(shipObj, coords) {
    shipObj.squareKeys = this.#checkShipSquare(shipObj, coords);
    return shipObj.squareKeys.length !== 0;
  }

  checkShot(coords) {
    return !this.shotSquares.has(Board.getKey(coords));
  }

  // returns ship if hit
  receiveShot([x, y]) {
    const squareKey = Board.getKey([x, y]);
    this.shotSquares.add(squareKey);

    // register hit on ship
    for (const shipObj of this.shipArr) {
      if (shipObj.squareKeys.some((key) => key === squareKey)) {
        return shipObj;
      }
    }
  }

  // returns placed/unplaced ships if placed == true/false
  getShipsByPlaced(placed) {
    const ships = [];
    this.shipArr.forEach((ship) => {
      if ((ship.squareKeys.length !== 0) === placed) ships.push(ship);
    });
    return ships;
  }

  getSquareRef(coords) {
    return this.boardRef.querySelector(`#${Board.getId(coords)}`);
  }

  static getId([x, y]) {
    return `square-${x}-${y}`;
  }

  static getCoordsFromId(squareId) {
    return squareId
      .slice(7)
      .split("-")
      .map((coord) => +coord);
  }

  static getCoordsFromKey(key) {
    return key.split("-").map((coord) => +coord);
  }

  static getKey([x, y]) {
    return `${x}-${y}`;
  }

  #makeSquares(sides) {
    for (let y = 0; y < sides; y++) {
      for (let x = 0; x < sides; x++) {
        const square = makeElement("div", [
          ["class", "square"],
          ["id", Board.getId([x, y])],
        ]);
        this.boardRef.appendChild(square);
      }
    }
  }

  static #makeShips(num = SETTINGS.ships) {
    const shipArr = [];
    for (let length = 1; length <= num; length++)
      shipArr.push(new Ship(length));
    return shipArr;
  }
}
