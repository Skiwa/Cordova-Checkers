//<----------- Collection contenant les utilisateurs ----------->

//Connexion à la base de données
var bdd_connexion = require("../bdd_connexion");

//Require Mongoose
var mongoose = require('mongoose');

let Schema = mongoose.Schema;

//Definition d'un schéma pour modéliser les données (<=> à une collection)
var userSchema = new Schema({
    name: { type: String, required: true },
    password: String,
    nbVictoire: Number
});

// Création d'un modèle qui respecte le schéma définit précédemment 
// Permettra d'insérer dans la base de données
let Utilisateur = mongoose.model('Utilisateur', userSchema);

//<----------- Exports ----------->
exports.Utilisateur = Utilisateur;