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

// Fonction d'ajout d'un joueur dans la liste d'attente
function PlayerConnected(id, joueur) {
  ListeAttentejoueurs.push({ id, joueur });
  console.log(ListeAttentejoueurs);
}

//Fonction de suppression d'un joueur dans liste d'attente
function PlayerDisconnected(id) {
  ListeAttentejoueurs = ListeAttentejoueurs.filter(function(el) {
    return el.id != id;
  });
  console.log(ListeAttentejoueurs);
}

function addJoueur(pseudo, id) {
  // Test de présence dans notre "BDD" sinon création d'un nouveau
  if ((joueur = listJoueur.find(joueur => joueur.pseudo === pseudo))) {
    console.log(joueur.pseudo + " est présent dans 'bdd'.");
    var newJoueur = joueur;
  } else {
    console.log("Non présent dans 'bdd'.");
    var newJoueur = new Joueur(pseudo);
  }
  //Ajoute le joueur à la liste + retourne l'état de la liste
  PlayerConnected(id, newJoueur);
  return {
    listeAttente: ListeAttentejoueurs
  };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
