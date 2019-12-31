//Dépendances Node/npm
var server = require("http").createServer();
const io = require("socket.io")(server);

//Dépendances locales
var user_management = require("./user_management");
var game_management = require("./game_management");
var address_management = require("./address_management");
var bdd_connexion = require("./bdd_connexion");

const portServeur = 3000;
var listeAttente = [];

//Lance le serveur
server.listen(portServeur);
console.log(
  "Serveur lancé sur les addresses : " + address_management.getAddressesIp(portServeur)
);

// Quand un client se connecte au WebSocket, le serveur lui envoie un message
io.on("connection", function (socket) {
  console.log("un client s'est connecté");
  socket.emit("connection_ok");
  // Login du joueur entrant
  socket.on("login", function (pseudo, password) {
    var obj = user_management.addJoueur(pseudo, password, socket.id);

    listeAttente = obj.listeAttente;

    if (listeAttente.length >= 2) {
      game_management.newPartie(listeAttente[0].nomJoueur, listeAttente[1].nomJoueur);
      var color = game_management.selectColor();

      io.to(`${listeAttente[0].socketId}`).emit(
        "ready",
        JSON.stringify({
          adversaire: listeAttente[1].nomJoueur,
          yourColor: color.color1
        })
      );
      io.to(`${listeAttente[1].socketId}`).emit(
        "ready",
        JSON.stringify({
          adversaire: listeAttente[0].nomJoueur,
          yourColor: color.color2
        })
      );
      listeAttente.splice(0, 2);
    } else {
      socket.emit("notReady", "Nous vous cherchons un adversaire, patientez..");
    }
  });

  socket.on("deplacement-joueur-envoi", function (move) {
    // Appel game module pour inversion des déplacements
    var inverseMove = game_management.inverseDeplacement(move);
    // TODO : retravailler pour eviter le broadcast
    socket.broadcast.emit("deplacement-joueur-reception", inverseMove);
  });

  socket.on("finPartie", function (pseudo) {
    // Récupère la promesse et travaille sur les données récoltés (ici _id et nbVictoire)
    let promiseNbWin = user_management.getNbVictoires(pseudo);
    promiseNbWin.then(function (data) {
      console.log("Le joueur " + pseudo + " a gagné " + data[0].nbVictoire + " fois");
    })
    user_management.addVictoire(pseudo);
  });

  socket.on("disconnect", function () {
    user_management.PlayerDisconnected(socket.id);
  });
});
