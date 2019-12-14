let listJoueur = [
  { pseudo: "Jean", nbVictoire: 12 },
  { pseudo: "Ali", nbVictoire: 5 },
  { pseudo: "Julien", nbVictoire: 200 }
];

// Liste de joueurs connectés l'app
let joueursCo = [];

class Joueur {
  constructor(pseudo) {
    this.pseudo = pseudo;
    this.nbVictoire = 0;
  }
}

function PlayerConnected(id, pseudo) {
  //   console.log(
  //     "Add a new player in PlayerConnected list : " + id + " pseudo : " + pseudo
  //   );
  joueursCo.push({ id, pseudo });
}

// Future fonction de suppression d'un joueur dans liste joueursCo
function PlayerDisconnected(id, pseudo) {
  console.log("Remove the player X from PlayerConnected list : " + id);
}

module.exports = {
  addJoueur: function(pseudo, id) {
    // console.log("Pseudo envoyé : " + pseudo);
    // console.log(list.find(joueur => joueur.pseudo === pseudo));

    // Test de présence dans notre "BDD"
    if ((joueur = listJoueur.find(joueur => joueur.pseudo === pseudo))) {
      console.log(joueur.pseudo + " est présent.");
      var newJoueur = joueur;
    } else {
      // Création d'un nouveau joueur si non présent
      console.log("Non présent.");
      var newJoueur = new Joueur(pseudo);
    }
    //Ajoute le joueur à la liste + retourne un objet Joueur et l'état de la liste
    PlayerConnected(id, newJoueur.pseudo);
    return { newJoueur: newJoueur, joueurCo: joueursCo };
  }
};
