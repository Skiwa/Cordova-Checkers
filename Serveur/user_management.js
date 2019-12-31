// <----------------- Importations pour la base de données ----------------->
var mongoose = require('mongoose');
var userModel = require('./models/user');
var userService = require('./service/user.service');

// <----------------- Variable Globales ----------------->

// Liste de joueurs connectés l'app
let ListeAttentejoueurs = [];

// <----------------- Modèles ----------------->

// Modèle Utilisateur pour insérer les utilisateurs
var User = userModel.Utilisateur;

// <----------------- Fonctions ----------------->

//Retourne le nombre de victoires d'un joueur s'il est présent en "BDD", sinon undefined
function getNbVictoires(pseudo) {
  // Promesse d'éxécution de la requête
  var promise = User.find({ name: pseudo }, 'nbVictoire').exec();

  return promise;
}

//Incrémente le nombre de victoires du joueur de pseudo "pseudo" de nbVictoires
function addVictoire(pseudo) {
  // Cherche le joueur et met à jour son compteur de victoire en l'incrémentant
  // options "upsert" créer le document s'il ne répond pas à la query sinon update normal
  User.findOneAndUpdate({ name: pseudo }, { $inc: { nbVictoire: 1 } }, { upsert: true }, function (err, doc) {
    if (err) {
      console.log(err)
    }
    console.log("Sucessfully saved");
  })
}

// Fonction d'ajout d'un joueur dans la liste d'attente
function PlayerConnected(id, joueur) {
  ListeAttentejoueurs.push({ socketId: id, nomJoueur: joueur });
  console.log(ListeAttentejoueurs);
}

//Fonction de suppression d'un joueur dans liste d'attente
function PlayerDisconnected(id) {
  // console.log("liste attente entrée : " + JSON.stringify(ListeAttentejoueurs));
  ListeAttentejoueurs = ListeAttentejoueurs.filter(el => {
    return el.socketId != id;
  });
  console.log("liste attente sortie : " + JSON.stringify(ListeAttentejoueurs));
}

//Fonction pour voir si le pseudo est présent dans la bdd
function addJoueur(pseudo, password, id) {
  userService.authenticate(pseudo, password)
    .catch((err) => { console.error(err.message) })
    .then(user => user ? PlayerConnected(id, pseudo) : console.log("erreur.."));
  //Ajoute le joueur de type {socketId: id, nomJoueur: pseudo} à la liste d'attente

  return { listeAttente: ListeAttentejoueurs };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
exports.getNbVictoires = getNbVictoires;
exports.addVictoire = addVictoire;