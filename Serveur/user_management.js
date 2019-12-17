// <----------------- Variable Globales ----------------->

let listJoueur = [
  { pseudo: "Jean", nbVictoire: 12 },
  { pseudo: "Ali", nbVictoire: 5 },
  { pseudo: "Julien", nbVictoire: 200 }
];

// Liste de joueurs connectés l'app
let ListeAttentejoueurs = [];

// <----------------- Classes ----------------->

class Joueur {
  constructor(pseudo) {
    this.pseudo = pseudo;
    this.nbVictoire = 0;
  }
}

// <----------------- Fonctions ----------------->
function PlayerConnected(id, pseudo) {
  ListeAttentejoueurs.push({ id, pseudo });
}

// Future fonction de suppression d'un joueur dans liste ListeAttentejoueurs
function PlayerDisconnected(id) {
  ListeAttentejoueurs = ListeAttentejoueurs.filter(function(el) {
    return el.id != id;
  });

  console.log(ListeAttentejoueurs);
}

// Fonction aléatoire de choix de couleur pour le joueur
// 0 = Noir | 1 = Blanc
function ChooseColorGame() {
  return Math.floor(Math.random() * Math.floor(2));
}

function addJoueur(pseudo, id) {
  // Test de présence dans notre "BDD"
  if ((joueur = listJoueur.find(joueur => joueur.pseudo === pseudo))) {
    console.log(joueur.pseudo + " est présent dans 'bdd'.");
    var newJoueur = joueur;
  } else {
    // Création d'un nouveau joueur si non présent
    console.log("Non présent dans 'bdd'.");
    var newJoueur = new Joueur(pseudo);
  }
  //Ajoute le joueur à la liste + retourne un objet Joueur et l'état de la liste
  PlayerConnected(id, newJoueur.pseudo);
  let hisColor = ChooseColorGame();
  return {
    newJoueur: newJoueur,
    listeAttente: ListeAttentejoueurs,
    color: hisColor
  };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
