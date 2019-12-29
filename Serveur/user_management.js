// <----------------- Importations pour la base de données ----------------->
var mongoose = require('mongoose');
var userModel = require('./models/user');

// <----------------- Variable Globales ----------------->

let listJoueur = [
  {id:0, pseudo: "Jean", nbVictoire: 12 },
  {id:1, pseudo: "Ali", nbVictoire: 5 },
  {id:2, pseudo: "Julien", nbVictoire: 200 }
];

// Liste de joueurs connectés l'app
let ListeAttentejoueurs = [];

// Modèle Utilisateur pour insérer les utilisateurs
var User = mongoose.model('Utilisateur');

// <----------------- Classes ----------------->

class Joueur {
  constructor(pseudo) {
    this.id = listJoueur.length;
    this.pseudo = pseudo;
    this.nbVictoire = 0;
  }
}

// <----------------- Fonctions ----------------->

//Retourne le nombre de victoires d'un joueur s'il est présent en "BDD", sinon undefined
function getNbVictoires(pseudo) {
  let joueur = listJoueur.find(joueur => joueur.pseudo === pseudo)
  if (joueur != undefined) {
    return joueur.nbVictoire;
  }
  return undefined;
}


//Incrémente le nombre de victoires du joueur de pseudo "pseudo" de nbVictoires
function addVictoires(pseudo, nbVictoires) {
  let joueur = listJoueur.find(joueur => joueur.pseudo === pseudo)
  if (joueur != undefined) {
    joueur.nbVictoire += nbVictoires;
    console.log("Nombre de victoire de " + joueur.pseudo + " augmenté de " + nbVictoires);
  } 
}


// Fonction d'ajout d'un joueur dans la liste d'attente
function PlayerConnected(id, joueur) {
  ListeAttentejoueurs.push({ id, joueur });
  console.log(ListeAttentejoueurs);
}

//Fonction de suppression d'un joueur dans liste d'attente
function PlayerDisconnected(id) {
  ListeAttentejoueurs = ListeAttentejoueurs.filter(function (el) {
    return el.id != id;
  });
  console.log(ListeAttentejoueurs);
}

//Fonction pour voir si le pseudo est présent dans la liste des joueurs et dans la bdd
function addJoueur(pseudo, password, id) {
  // Test de présence dans notre "BDD" sinon création d'un nouveau
  let nb; // Nombre d'utilisateurs dans la bdd
  User.countDocuments({}, function(err, count){
    nb = count;
  });
  User.find({name: pseudo}, function(err, data){
      if(err){
          console.log(err);
          return
      }
      // Si l'utilisateur n'est pas présent dans la bdd
      if(data.length == 0) {
          console.log(pseudo + " Non présent dans la bdd")
          // Création d'une instance du modèle Utilisateur avec le nouveau pseudo
          let nouveauJoueur = new User({
            id: nb,
            name: pseudo,
            password: password,
            nbVictoire: 0
          });
          // Sauvegarde de cette instance dans mongoDb
          nouveauJoueur.save()
            .then(doc => {
              console.log(doc) // affiche ce qui vient d'être ajouté
            })
            .catch(err => {
              console.error(err) // affiche erreur si problème
            });
          return
      }
      // S'il est présent vérification du mot de passe
      User.find({name: pseudo}).find({password: password}, function(err, data){
        if(err){
            console.log(err);
            return
        }
        // Si le mot de passe n'est pas valide
        if(data.length == 0) {
          console.log("Mot de passe invalide");
          return
        }
      console.log(data[0].name + " est présent dans 'bdd'. Son id est : " + data[0].id);
      });
  });

  // Test de présence dans notre "liste de joueurs" sinon création d'un nouveau
  if ((joueur = listJoueur.find(joueur => joueur.pseudo === pseudo))) {
    console.log(joueur.pseudo + " est présent dans la liste de joueurs.");
    var newJoueur = joueur;
  } else {
    console.log("Non présent dans la liste de joueurs.");
    var newJoueur = new Joueur(pseudo);
    listJoueur.push(newJoueur);
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
exports.getNbVictoires = getNbVictoires;
exports.addVictoires = addVictoires;
