//<============== Collection contenant les utilisateurs ==============>

//<----------------- Dépendances Node/Locales ----------------->

//Connexion à la base de données
var bdd_connexion = require("../bdd_connexion");

//Require Mongoose
var mongoose = require('mongoose');

//<----------------- Variable Globales ----------------->

let Schema = mongoose.Schema;

//<----------------- Schéma & Modèle ----------------->

//Definition d'un schéma pour modéliser les données (<=> à une collection)
var userSchema = new Schema({
    name: { type: String, required: true },
    password: String,
    nbVictoire: Number,
    nbPartie: Number
});

// Création d'un modèle qui respecte le schéma définit précédemment 
// Permettra d'insérer dans la base de données
let Utilisateur = mongoose.model('Utilisateur', userSchema);

//<----------------- Exports ----------------->
exports.Utilisateur = Utilisateur;