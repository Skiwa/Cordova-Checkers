//<============== Service pour la gestion Utilisateur ==============>

//<----------------- Dépendances Node/Locales & Modèle ----------------->
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const Utilisateur = UserModel.Utilisateur;

//<----------------- Fonctions ----------------->

/**
 * Fonction d'authentification d'un utilisateur
 * @param data Informations renseignées de l'utilisateur 
 */
async function authenticate(data) {

    const user = await Utilisateur.findOne({ name: data.name });
    if (!user) {
        console.log("Service : User unauthenticate")
        return await create(data);
    } else {
        if (await bcrypt.compare(data.password, user.password)) {
            console.log("Service : User authenticate success ");
            // Retourne un objet sans erreur et l'utilisateur authentifié
            return { error: "", profile: user }
        } else {
            console.log("Service : User authenticate error password");
            // Retourne un objet avec erreur et pas d'utilisateur
            return { error: "Mdp error", profile: {} }
        }
    }
}

/**
 * Fonction de création et sauvegarde d'un utilisateur
 * @param data Informations renseignées de l'utilisateur 
 */
async function create(data) {
    // Hash password un salt
    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = new Utilisateur({
        name: data.name,
        password: hashPassword,
        nbVictoire: 0
    })

    // console.log(user);

    //save user
    await user.save();
    console.log("Service : User unauthenticate add success");

    // Retourne un objet sans erreur et l'utilisateur crée
    return { error: "", profile: user }
}

/**
 * Fonction de récupération de tous les Utilisateurs
 */
async function getAllUserScore() {
    return await Utilisateur.find({}, ['name', 'nbVictoire']);
}

/**
 * Fonction de récupération du nb de victoires de l'utilisateur
 * @param name Nom de l'utilisateur
 */
async function getUserNbVictory(name) {
    return await Utilisateur.find({ name: name }, 'nbVictoire');
}

/**
 * Fonction de mise à jour du nb de victoires de l'utilisateur
 * @param name Nom de l'utilisateur
 */
async function updateNbVictory(name) {
    // Cherche le joueur et met à jour son compteur de victoire en l'incrémentant
    // options "upsert" créer le document s'il ne répond pas à la query sinon update normal
    await Utilisateur.findOneAndUpdate({ name: name }, { $inc: { nbVictoire: 1 } }, { upsert: true });
}

//<----------------- Exports ----------------->
exports.authenticate = authenticate;
exports.getAllUserScore = getAllUserScore;
exports.updateNbVictory = updateNbVictory;
exports.getUserNbVictory = getUserNbVictory