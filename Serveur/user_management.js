// <----------------- Importations pour la base de données ----------------->
var mongoose = require('mongoose');
var userModel = require('./models/user');

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
//TODO : Modifier pour incrémenter en bdd pour le joueur x
// !!! non testé !!! ///
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

//Fonction pour voir si le pseudo est présent dans la liste des joueurs et dans la bdd
function addJoueur(pseudo, password, id) {

  // Test de présence dans notre "BDD" sinon création d'un nouveau
  User.find({ name: pseudo }, function (err, data) {
    if (err) {
      console.log(err);
      return
    }
    // Si l'utilisateur n'est pas présent dans la bdd
    if (data.length == 0) {
      console.log(pseudo + " Non présent dans la bdd")
      // Création d'une instance du modèle Utilisateur avec le nouveau pseudo
      let nouveauJoueur = new User({
        name: pseudo,
        password: password,
        nbVictoire: 0
      });
      // Sauvegarde de cette instance dans mongoDb
      nouveauJoueur.save()
        // .then(doc => {
        //   console.log(doc) // affiche ce qui vient d'être ajouté
        // })
        .catch(err => {
          console.error(err) // affiche erreur si problème
        });
      return
    }
    // S'il est présent vérification du mot de passe
    User.find({ name: pseudo }).find({ password: password }, function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      // Si le mot de passe n'est pas valide
      if (data.length == 0) {
        // TODO : Bloquer accès ou retourner erreur au client
        console.log("Mot de passe invalide");
        return
      }
      console.log(data[0].name + " est présent dans 'bdd'. Son id est : " + data[0]._id);
    });
  });
  //Ajoute le joueur de type {socketId: id, nomJoueur: pseudo} à la liste d'attente
  PlayerConnected(id, pseudo);

  //Retourne l'état de la liste d'attente
  return {
    listeAttente: ListeAttentejoueurs
  };
}

// <----------------- Exports ----------------->
exports.addJoueur = addJoueur;
exports.PlayerDisconnected = PlayerDisconnected;
exports.getNbVictoires = getNbVictoires;
exports.addVictoire = addVictoire;
