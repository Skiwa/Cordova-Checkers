// <----------------- Variable Globales ----------------->

// <----------------- Classes ----------------->
class Partie {
  constructor(J1, J2) {
    this.J1 = J1;
    this.J2 = J2;
  }
}

// <----------------- Fonctions ----------------->

// Fonctions création d'une partie (futur ajout dans bdd)
function newPartie(Joueur1, Joueur2) {
  var newPartie = new Partie(Joueur1, Joueur2);
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

// <----------------- Exports ----------------->
exports.newPartie = newPartie;
exports.selectColor = selectColor;
exports.inverseDeplacement = inverseDeplacement;
