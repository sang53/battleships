import { Board } from "./Board";
import { SETTINGS } from "./gameSettings";

export function randomShipPlace(board) {
  board.shipArr.forEach((ship) => randomPlace(board, ship));
}

function randomPlace(board, ship) {
  let randCoords;
  do {
    randCoords = getRandomCoords();
    if (Math.random() < 0.5) ship.switchOrient();
  } while (!board.placeShip(ship, randCoords));
}

function getRandomCoords(sides = SETTINGS.sides) {
  return [Math.floor(Math.random() * sides), Math.floor(Math.random() * sides)];
}

export function getCPUShots(oppBoard, numShots) {
  const [multiHits, singleHit] = getHits(oppBoard);
  const shots = new Set();

  multiHits.forEach((keyArray, orient) => {
    keyArray.forEach((key) => {
      getAdjShots(key, orient).forEach((adjkey) => {
        if (!oppBoard.shotSquares.has(adjkey)) shots.add(adjkey);
      });
    });
  });

  singleHit.forEach((key) => {
    getAdjShots(key).forEach((adjkey) => {
      if (!oppBoard.shotSquares.has(adjkey)) shots.add(adjkey);
    });
  });

  while (shots.size < numShots) {
    const randkey = Board.getKey(getRandomCoords());
    if (!oppBoard.shotSquares.has(randkey)) shots.add(randkey);
  }

  return trimShots(shots, numShots);
}

function getHits(oppBoard) {
  const hits = new Map();

  // get map of every shot that hit ship:[keys of hits]
  oppBoard.shipArr.forEach((ship) => {
    const keyArray = [];
    ship.squareKeys.forEach((key) => {
      if (oppBoard.shotSquares.has(key)) keyArray.push(key);
    });
    if (keyArray.length) hits.set(ship, keyArray);
  });

  // rearrange into shots that hit ships multiple times & single time
  const multiHits = new Map([
    ["vertical", []],
    ["horizontal", []],
  ]);
  const singleHit = new Set();

  hits.forEach((keyArray, ship) => {
    if (keyArray.length === 1) singleHit.add(keyArray[0]);
    else multiHits.get(ship.orient).push(...keyArray);
  });

  return [multiHits, singleHit];
}

function getAdjShots(key, orient = "both") {
  const shotArray = [];
  const [x, y] = Board.getCoordsFromKey(key);
  if (orient === "horizontal" || orient === "both") {
    for (const newX of [x + 1, x - 1]) {
      if (newX >= 0 && newX < SETTINGS.sides)
        shotArray.push(Board.getKey([newX, y]));
    }
  }
  if (orient === "vertical" || orient === "both") {
    for (const newY of [y + 1, y - 1]) {
      if (newY >= 0 && newY < SETTINGS.sides)
        shotArray.push(Board.getKey([x, newY]));
    }
  }
  return shotArray;
}

function trimShots(shots, numShots) {
  const shotIterator = shots.keys();
  while (shots.size > numShots) {
    shots.delete(shotIterator.next().value);
  }
  return shots;
}
