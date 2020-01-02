// <----------------- Dépendances Node/Locales ----------------->
var userService = require('./service/user.service');

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
      console.log("Victory Successfully Updated !")
    })
}

/**
 * Fonction qui récupère la liste de tous les utilisateur avec leur score (nbVictoire)
 */
async function getAllUsersScore() {
  return await userService.getAllUserScore();
}

/**
 * Fonction d'ajout d'un joueur dans la liste d'attente
 * @param socketId Id socket de l'utilisateur
 * @param pseudo Nom de l'utilisateur
 */
function PlayerConnected(socketId, pseudo) {
  ListeAttentejoueurs.push({ socketId: socketId, nomJoueur: pseudo });
  // console.log("Function Player List : " + JSON.stringify(ListeAttentejoueurs));
}

/**
 * Fonction de suppression d'un joueur dans liste d'attente
 * @param socketId Id socket de l'utilisateur
 */
function PlayerDisconnected(socketId) {
  // console.log("liste attente entrée : " + JSON.stringify(ListeAttentejoueurs));
  ListeAttentejoueurs = ListeAttentejoueurs.filter(el => {
    return el.socketId != socketId;
  });
  console.log("liste attente en sortie : " + JSON.stringify(ListeAttentejoueurs));
}

/**
 * Fonction authentification/ajout d'utilisateur dans la bdd et la liste d'attente
 * @param data Données de l'utilisateur de type { name , password } ou { name }
 * @param socketId Id socket de l'utilisateur
 * @param etat Etat de l'utilisateur 0 = pas authentifié, 1 = déjà authentifié
 */
async function addJoueur(data, socketId, etat) {
  if (etat == 0) {
    const userPromise = await userService.authenticate(data)
    if (userPromise.error != "") {
      // Si erreur retournée, on attribue le message à notre variable globale
      // console.log(userPromise.error);
      error = userPromise.error
    } else {
      //Ajoute le joueur de type {socketId: socketId, nomJoueur: pseudo} à la liste d'attente
      PlayerConnected(socketId, userPromise.profile.name)
      error = "";
    }
  } else if (etat == 1) {
    PlayerConnected(socketId, data.name)
    error = "";
  }
  //Retourne un objet de type { erreur(string) , notre liste d'attente }
  return { error: error, listeAttente: ListeAttentejoueurs };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
exports.getNbVictoires = getNbVictoires;
exports.addVictoire = addVictoire;
exports.getAllUsersScore = getAllUsersScore;