//<============== Service pour la gestion Partie ==============>

//<----------------- Dépendances Node/Locales & Modèle ----------------->
var partieModel = require('../models/partie');
var Partie = partieModel.Partie;

//<----------------- Fonctions ----------------->

/**
 * Fonction de mise à jour du gagnant de la partie
 * @param name Nom de l'utilisateur gagnant
 */
async function updateGagnant(name) {
    await Partie.findOneAndUpdate({
        $and: [
            { $or: [{ J1: name }, { J2: name }] },
            { gagnant: "" }
        ]
    }, { gagnant: name });
}

/**
 * Fonction de création et sauvegarde de Partie
 * @param data Informations renseignées de la partie
 */
async function create(data) {

    let nouvellePartie = new Partie({
        J1: data.J1,
        J2: data.J2,
        gagnant: ""
    });

    // Sauvegarde de cette instance dans mongoDb
    await nouvellePartie.save()
        // .then(doc => {
        //   console.log(doc) // affiche ce qui vient d'être ajouté
        // })
        .catch(err => {
            console.error(err) // affiche erreur si problème
        });
}

//<----------------- Exports ----------------->
exports.create = create;
exports.updateGagnant = updateGagnant;