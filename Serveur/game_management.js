// <----------------- Importations pour la base de données ----------------->
var mongoose = require('mongoose');
var partieModel = require('./models/partie');

// <----------------- Variable Globales ----------------->

// <----------------- Modèles ----------------->

// Modèle Utilisateur pour insérer les utilisateurs
var Partie = partieModel.Partie;

// <----------------- Fonctions ----------------->

// Fonctions création d'une partie (futur ajout dans bdd)
function newPartie(Joueur1, Joueur2) {
  let nouvellePartie = new Partie({
    J1: Joueur1,
    J2: Joueur2
  });
  
  // Sauvegarde de cette instance dans mongoDb
  nouvellePartie.save()
    // .then(doc => {
    //   console.log(doc) // affiche ce qui vient d'être ajouté
    // })
    .catch(err => {
      console.error(err) // affiche erreur si problème
    });
  
}

function selectColor() {
  var color1 = Math.random() >= 0.5 ? "noir" : "blanc";
  var color2 = color1 === "noir" ? "blanc" : "noir";

  return { color1: color1, color2: color2 };
}

// Fonction d'inversion des déplacements
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

async function updateGagnant(pseudo){
  await Partie.findOneAndUpdate(
    { $or: [
      { J1: pseudo },
      { J2: pseudo }
    ] }, 
    { gagnant: pseudo },    
    { sort: {'_id' : -1 }}
  );
}

// <----------------- Exports ----------------->
exports.newPartie = newPartie;
exports.selectColor = selectColor;
exports.inverseDeplacement = inverseDeplacement;
exports.updateGagnant = updateGagnant;
