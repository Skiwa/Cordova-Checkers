// Importation de mongoose
let mongoose = require('mongoose');

// Serveur de la bdd
const server = '127.0.0.1:27017';
// Nom de la bdd
const database = 'dame-db';

class Database {
  constructor() {
    this._connect()
  }

  // Connexion à la base de données 
  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('La connexion à la bdd a réussi.')
      })
      .catch(err => {
        console.error('La connexion à la bdd a échoué.')
      })
  }
}

module.exports = new Database()