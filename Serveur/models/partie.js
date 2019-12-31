//<----------- Collection contenant les parties ----------->

//Connexion à la base de données
var bdd_connexion = require("../bdd_connexion");

//Require Mongoose
var mongoose = require('mongoose');

let Schema = mongoose.Schema;

//Definition d'un schéma pour modéliser les données (<=> à une collection)
var partieSchema = new Schema({
    J1: { type: String, required: true },
    J2: { type: String, required: true },
    gagnant: String,
    duree: Number
});

// Création d'un modèle qui respecte le schéma définit précédemment 
// Permettra d'insérer dans la base de données
let Partie = mongoose.model('Partie', partieSchema);

//<----------- Exports ----------->
exports.Partie = Partie;