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
function PlayerConnected(id, joueur) {
  ListeAttentejoueurs.push({ id, joueur });
  console.log(ListeAttentejoueurs);
}

// Future fonction de suppression d'un joueur dans liste ListeAttentejoueurs
function PlayerDisconnected(id) {
  ListeAttentejoueurs = ListeAttentejoueurs.filter(function(el) {
    return el.id != id;
  });
  console.log(ListeAttentejoueurs);
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
  PlayerConnected(id, newJoueur);
  return {
    newJoueur: newJoueur,
    listeAttente: ListeAttentejoueurs
  };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
