// <----------------- Dépendances Node/Locales ----------------->
var userService = require('../service/user.service');

//<----------------- Variable Globales ----------------->

//Liste de joueurs connectés l'app
let ListeAttentejoueurs = [];
var error;

//<----------------- Fonctions ----------------->

/**
 * Fonction qui récupère le nb de victoire de l'utilisateur et affiche en console
 * @param pseudo Nom de l'utilisateur
 */
function getNbVictoires(pseudo) {
  userService.getUserNbVictory(pseudo)
    .then(data => {
      console.log("Le joueur " + pseudo + " a gagné " + data[0].nbVictoire + " fois.");
    })
}

/**
 * Fonction qui incrémente le nombre de victoires de l'utilisateur
 * @param pseudo Nom de l'utilisateur
 */
function addVictoire(pseudo) {
  userService.updateNbVictory(pseudo)
    .then(() => {
      console.log("User's victory Successfully Updated")
    })
}

/**
 * Fonction qui incrémente le nombre de parties de l'utilisateur
 * @param pseudo Nom de l'utilisateur
 */
function addPartie(pseudo) {
  userService.updateNbGame(pseudo)
    .then(() => {
      console.log("User's games Successfully Updated");
    })
}

/**
 * Fonction qui récupère la liste de tous les utilisateur avec leur score (nbVictoire)
 * @return Une promesse de liste de Documents
 */
async function getAllUsersScore() {
  return await userService.getAllUserScore();
}

/**
 * Fonction d'ajout d'un joueur dans la liste d'attente
 * @param socket Socket de l'utilisateur
 * @param pseudo Nom de l'utilisateur
 */
function PlayerConnected(socket, pseudo) {
  ListeAttentejoueurs.push({ socket: socket, nomJoueur: pseudo });
}

/**
 * Fonction de suppression d'un joueur dans liste d'attente
 * @param socket Socket de l'utilisateur
 */
function PlayerDisconnected(socket) {
  ListeAttentejoueurs = ListeAttentejoueurs.filter(el => {
    return el.socket.id != socket.id;
  });
}

/**
 * Fonction authentification/ajout d'utilisateur dans la bdd et la liste d'attente
 * @param data Données de l'utilisateur de type { name , password } ou { name }
 * @param socket Socket de l'utilisateur
 * @param etat Etat de l'utilisateur 0 = pas authentifié, 1 = déjà authentifié
 * @return Une promesse d'un objet { error , listeAttente }
 */
async function addJoueur(data, socket, etat) {
  if (etat == 0) {
    const userPromise = await userService.authenticate(data)
    if (userPromise.error != "") {
      // Si erreur retournée, on attribue le message à notre variable globale
      error = userPromise.error
    } else {
      //Ajoute le joueur de type {socketId: socketId, nomJoueur: pseudo} à la liste d'attente
      PlayerConnected(socket, userPromise.profile.name)
      error = "";
    }
  } else if (etat == 1) {
    PlayerConnected(socket, data.name)
    error = "";
  }
  //Retourne un objet de type { erreur(string) , notre liste d'attente }
  return { error: error, listeAttente: ListeAttentejoueurs };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.addPartie = addPartie;
exports.PlayerDisconnected = PlayerDisconnected;
exports.getNbVictoires = getNbVictoires;
exports.addVictoire = addVictoire;
exports.getAllUsersScore = getAllUsersScore;