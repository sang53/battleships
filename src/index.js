import "./style.css";
import {
  makeElement,
  addToMain,
  resetDOM,
  removeListeners,
  addListener,
  afterSwitch,
  placeShipElement,
} from "./DOM";
import { Board } from "./Board";
import { SETTINGS } from "./gameSettings";
import { shipPlace } from "./ship-placement";
import { randomShipPlace } from "./cpu";

startScreen();

function startScreen() {
  document.querySelector("#main").classList.add("start-screen");
  addToMain(makeElement("h1", [], "Play BattleShip!"));
  addToMain(getBoardsDiv());
  addToMain(getFooter());
  updateSettingsDiv();
}

function getBoardsDiv() {
  const contentDiv = makeElement("div", [["id", "boards"]]);

  const board1 = new Board(10, 5);
  contentDiv.appendChild(board1.boardRef);
  contentDiv.appendChild(getPlayButton(nextStage));
  const board2 = new Board(10, 5);
  contentDiv.appendChild(board2.boardRef);

  [board1, board2].forEach((board) => {
    randomShipPlace(board);
    board.shipArr.forEach((ship) => placeShipElement(ship, board));
  });

  return contentDiv;
}

function getPlayButton(nextStage) {
  const playButton = makeElement("button", [["id", "start-button"]], "Start!");
  addListener(playButton, "click", nextStage, true);
  return playButton;
}

function getFooter() {
  const footerDiv = makeElement("div", [["id", "footer"]]);

  footerDiv.appendChild(getRulesButton(openRules));
  footerDiv.appendChild(makeElement("div", [["id", "settings"]]));
  footerDiv.appendChild(getSettingsButton(openSettings));

  return footerDiv;
}

function getRulesButton(openRules) {
  const rulesButton = makeElement(
    "button",
    [["id", "rules-button"]],
    "How To Play",
  );
  addListener(rulesButton, "click", openRules);
  return rulesButton;
}

function getSettingsButton(openSettings) {
  const settingsButton = makeElement(
    "button",
    [["id", "settings-button"]],
    "Change Settings",
  );
  addListener(settingsButton, "click", openSettings);
  return settingsButton;
}

function nextStage() {
  removeListeners();
  resetDOM();
  document.querySelector("#main").classList.remove("start-screen");

  afterSwitch(shipPlace, 0);
}

function openRules() {
  const rulesModal = document.querySelector("#rules-modal");
  rulesModal.showModal();
  addListener(rulesModal.querySelector("button"), "click", closeRules, true);
}

function closeRules() {
  document.querySelector("#rules-modal").close();
}

function openSettings() {
  const settingsModal = document.querySelector("#settings-modal");
  settingsModal.showModal();
  addListener(
    settingsModal.querySelector("button"),
    "click",
    closeSettings,
    true,
  );
}

function closeSettings(event) {
  const settingsModal = document.querySelector("#settings-modal");
  const formElements = settingsModal.querySelector(
    "#settings-modal form",
  ).elements;

  SETTINGS.changeSettings({
    shot: formElements["cluster"].checked ? "Cluster" : "Single",
    opp: formElements["computer"].checked ? "CPU" : "Player",
  });

  updateSettingsDiv();
  event.preventDefault();
  settingsModal.close();
}

function updateSettingsDiv() {
  const settingsDiv = document.querySelector("#settings");
  const outputStr = [
    "Sides: " + SETTINGS.sides,
    "Ships: " + SETTINGS.ships,
    "Shots: " + SETTINGS.shotType,
    "Opp: " + SETTINGS.opp,
  ].join("\n");
  settingsDiv.innerText = outputStr;
}
