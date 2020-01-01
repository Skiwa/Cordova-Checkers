//<============== Service pour la gestion Utilisateur ==============>

//<----------------- Dépendances Node/Locales ----------------->
const UserModel = require('../models/user');
const Utilisateur = UserModel.Utilisateur;

//<----------------- Fonctions ----------------->

/**
 * Fonction d'authentification d'un utilisateur
 * @param data Informations renseignées de l'utilisateur 
 */
async function authenticate(data) {

    // Futur hash password

    const user = await Utilisateur.findOne({ name: data.name });
    if (!user) {
        console.log("Service : User unauthenticate")
        return await create(data);
    } else {
        const user = await Utilisateur.findOne({ name: data.name, password: data.password });
        if (!user) {
            console.log("Service : User authenticate error password");
            // Retourne un objet avec erreur et pas d'utilisateur
            return { error: "Mdp error", profile: {} }
        } else {
            console.log("Service : User authenticate success ");
            // Retourne un objet sans erreur et l'utilisateur authentifié
            return { error: "", profile: user }
        }
    }
}

/**
 * Fonction de création d'un utilisateur
 * @param data Informations renseignées de l'utilisateur 
 */
async function create(data) {

    const user = new Utilisateur({
        name: data.name,
        password: data.password,
        nbVictoire: 0
    })

    // Futur hash password

    //save user
    await user.save();
    console.log("Service : User unauthenticate add success");

    // Retourne un objet sans erreur et l'utilisateur crée
    return { error: "", profile: user }
}

/**
 * Fonction de récupération de tous les Utilisateurs
 */
async function getAllUser() {
    return await Utilisateur.find({});
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
exports.getAllUser = getAllUser;
exports.updateNbVictory = updateNbVictory;
exports.getUserNbVictory = getUserNbVictory