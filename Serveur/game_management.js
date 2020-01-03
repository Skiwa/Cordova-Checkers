// <----------------- Importations pour la base de données ----------------->
var gameService = require('./service/game.service');

// <----------------- Variable Globales ----------------->

// <----------------- Fonctions ----------------->

/**
 * Fonction de choix random des couleurs de jeu
 */
function selectColor() {
  var color1 = Math.random() >= 0.5 ? "noir" : "blanc";
  var color2 = color1 === "noir" ? "blanc" : "noir";

  return { color1: color1, color2: color2 };
}

/**
 * Fonction d'inversion des déplacements
 * @param deplacement Un objet de type {anciennePosition:{x,y},nouvellePosition:{x,y}}
 */
function inverseDeplacement(deplacement) {
  // console.log("inverse old x = ", 9 - deplacement.anciennePosition.x);
  // console.log("inverse old y = ", 9 - deplacement.anciennePosition.y);
  // console.log("inverse new x = ", 9 - deplacement.nouvellePosition.x);
  // console.log("inverse new y = ", 9 - deplacement.nouvellePosition.y);

  var inverseMove = {
    anciennePosition: {
      x: 9 - deplacement.anciennePosition.x,
      y: 9 - deplacement.anciennePosition.y
    },
    nouvellePosition: {
      x: 9 - deplacement.nouvellePosition.x,
      y: 9 - deplacement.nouvellePosition.y
    }
  };

  return inverseMove;
}

/**
 * Fonction création d'une nouvelle partie
 * @param Joueur1 Nom du Joueur1
 * @param Joueur2 Nom du Joueur2
 */
async function newPartie(Joueur1, Joueur2) {
  await gameService.create({ J1: Joueur1, J2: Joueur2 });
}

/**
 * Fonction de mise à jour du gagnant
 * @param pseudo Nom du gagnant
 */
async function updateGagnant(pseudo) {
  await gameService.updateGagnant(pseudo);
}

// <----------------- Exports ----------------->
exports.newPartie = newPartie;
exports.selectColor = selectColor;
exports.inverseDeplacement = inverseDeplacement;
exports.updateGagnant = updateGagnant;
