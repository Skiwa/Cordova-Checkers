// <----------------- Dépendances Node/Locales ----------------->
var mongoose = require('mongoose');
var userModel = require('./models/user');
var userService = require('./service/user.service');

//<----------------- Modèles ----------------->

// Modèle Utilisateur pour insérer les utilisateurs
var User = userModel.Utilisateur;

//<----------------- Variable Globales ----------------->

//Liste de joueurs connectés l'app
let ListeAttentejoueurs = [];
var error;

//<----------------- Fonctions ----------------->

//Récupère le nb de victoire de l'utilisateur et affiche en console
function getNbVictoires(pseudo) {
  userService.getUserNbVictory(pseudo)
    .then(data => {
      console.log("Le joueur " + pseudo + " a gagné " + data[0].nbVictoire + " fois.");
    })
}

//Incrémente le nombre de victoires du joueur de pseudo "pseudo" de 1.
function addVictoire(pseudo) {
  userService.updateNbVictory(pseudo)
    .then(() => {
      console.log("Successfully Saved !")
    })
}

async function getAllUsersScore() {
  return await userService.getAllUserScore();
}

//Fonction d'ajout d'un joueur dans la liste d'attente
function PlayerConnected(socketId, joueur) {
  ListeAttentejoueurs.push({ socketId: socketId, nomJoueur: joueur });
  // console.log("Function Player List : " + JSON.stringify(ListeAttentejoueurs));
}

//Fonction de suppression d'un joueur dans liste d'attente
function PlayerDisconnected(socketId) {
  // console.log("liste attente entrée : " + JSON.stringify(ListeAttentejoueurs));
  ListeAttentejoueurs = ListeAttentejoueurs.filter(el => {
    return el.socketId != socketId;
  });
  console.log("liste attente en sortie : " + JSON.stringify(ListeAttentejoueurs));
}

//Fonction pour voir si le pseudo est présent dans la bdd
async function addJoueur(pseudo, password, socketId) {
  const userPromise = await userService.authenticate({ name: pseudo, password: password })
  if (userPromise.error != "") {
    // Si erreur retournée, on attribue le message à notre variable globale
    // console.log(userPromise.error);
    error = userPromise.error
  } else {
    //Ajoute le joueur de type {socketId: socketId, nomJoueur: pseudo} à la liste d'attente
    PlayerConnected(socketId, userPromise.profile.name)
    error = "";
  }
  //Retourne un objet avec erreur(string) + notre liste d'attente
  return { error: error, listeAttente: ListeAttentejoueurs };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
exports.getNbVictoires = getNbVictoires;
exports.addVictoire = addVictoire;
exports.getAllUsersScore = getAllUsersScore;