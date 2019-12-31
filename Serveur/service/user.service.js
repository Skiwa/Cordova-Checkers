const UserModel = require('../models/user');
const Utilisateur = UserModel.Utilisateur;

async function authenticate(name, password) {
    const user = await Utilisateur.findOne({ name: name });
    if (!user) {
        user = await create({ name: name, password: password });
    } else if (user && user.password != password) {
        throw new Error('Password "' + password + '" is invalid for pseudo "' + user.name + '" ! Try again');
    }
    // console.log(user.name + " est présent dans la bdd. Son id est : " + user._id);
    return user
}

async function create(userParam) {

    const user = new Utilisateur({
        name: userParam.name,
        password: userParam.password,
        nbVictoire: 0
    })

    // Futur hash password

    //save user
    await user.save();
}

async function getAllUser() {
    return await Utilisateur.find({});
}

// <----------------- Exports ----------------->
exports.authenticate = authenticate;
exports.getAllUser = getAllUser;