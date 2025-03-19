export const SETTINGS = (function () {
  let sides = 10;
  let ships = 5;
  let shotType = "Cluster";
  let opp = "CPU";

  function changeSettings(inputObj) {
    ships = inputObj.ships || ships;
    sides = inputObj.sides || sides;
    shotType = inputObj.shot;
    opp = inputObj.opp;
  }

  return {
    get sides() {
      return sides;
    },
    get ships() {
      return ships;
    },
    get shotType() {
      return shotType;
    },
    get opp() {
      return opp;
    },
    changeSettings,
  };
})();
