import { makeElement } from "./DOM";

export class Ship {
  squareKeys = [];
  hits = 0;
  orient = "horizontal";

  constructor(length) {
    this.length = length;
    this.shipRef = this.#buildShip();
  }

  switchOrient() {
    this.orient = this.orient === "horizontal" ? "vertical" : "horizontal";
  }

  isPlaced() {
    return this.shipRef.classList.contains("placed");
  }

  unplace() {
    this.squareKeys = [];
  }

  receiveHit(key) {
    const idx = this.squareKeys.indexOf(key);
    this.shipRef.querySelector(`.num-${idx}`).classList.add("hit");
    return ++this.hits === this.length;
  }

  #buildShip() {
    const shipRef = makeElement("div", [
      ["class", "ship"],
      ["id", `ship-${this.length}`],
    ]);
    for (let i = 0; i < this.length; i++) {
      shipRef.appendChild(Ship.#makeSquare(i));
    }
    return shipRef;
  }

  static #makeSquare(i) {
    return makeElement("div", [["class", `square num-${i}`]]);
  }
}
