// <----------------- Importations pour la base de données ----------------->
var gameService = require('../service/game.service');

// <----------------- Variable Globales ----------------->
// Liste des parties en cours 
let ListGame = [];

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

/**
 * Fonction qui ajoute le nouvelle partie à ListGame
 * @param socketId1 socket id du joueur 1
 * @param Joueur1 Nom du joueur 1
 * @param socketId2 socket id du joueur 2
 * @param Joueur2 Nom du joueur 2
 */
function addList(socketId1, Joueur1,socketId2, Joueur2){
  var game = {idJ1: socketId1, J1: Joueur1, idJ2:socketId2, J2: Joueur2};
  var obj = Object.create(game);
  ListGame.push(obj); 
}

/**
 * Fonction qui retrouve la partie dans laquelle se trouve le joueur qui s'est déconnecté
 * @param socketId socket id du joueur qui s'est déconnecté
 */
function findGame(socketId){
  find1 = ListGame.find(joueur => joueur.idJ1 === socketId);
  find2 = ListGame.find(joueur => joueur.idJ2 === socketId);
  if (find1 == undefined){
     return find2;
  }
  return find1;
}

// <----------------- Exports ----------------->
exports.newPartie = newPartie;
exports.selectColor = selectColor;
exports.inverseDeplacement = inverseDeplacement;
exports.updateGagnant = updateGagnant;
exports.addList = addList;
exports.findGame = findGame;
