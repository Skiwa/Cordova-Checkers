// <----------------- Variable Globales ----------------->

// <----------------- Classes ----------------->
class Partie {
  constructor(J1, J2) {
    this.J1 = J1;
    this.J2 = J2;
  }
}

// <----------------- Fonctions ----------------->
function newPartie(Joueur1, Joueur2) {
  var newPartie = new Partie(Joueur1, Joueur2);
}

exports.newPartie = newPartie;
