//Dépendances Node/npm
var server = require("http").createServer();
const io = require("socket.io")(server);

//Dépendances locales
var user_management = require("./user_management");
var game_management = require("./game_management");
var address_management = require("./address_management");
var bdd_connexion = require("./bdd_connexion");
var room = require("./room");

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
    // Promesse d'addJoueur de type : data = { error:string , listeAttente: any[] }
    var obj = user_management.addJoueur(pseudo, password, socket.id);
    obj.then(function (data) {
      // console.log("Index Object : " + JSON.stringify(data));
      if (data.error != "") {
        // Si erreur -> Bloque + envoie message vers client
        socket.emit("error_login", data.error);
      } else {
        // Si !erreur -> Déroulement normal Jeu
        listeAttente = data.listeAttente;
        room.addRoom(socket);

        if (listeAttente.length >= 2) {
          game_management.newPartie(listeAttente[0].nomJoueur, listeAttente[1].nomJoueur)
            .finally(() => {
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
            })
        } else {
          socket.emit("notReady", "Nous vous cherchons un adversaire, patientez..");
        }
      }
    })
  });


  socket.on("deplacement-joueur-envoi", function (move) {
    // Appel game module pour inversion des déplacements
    var inverseMove = game_management.inverseDeplacement(move);
    // Recupere la room qui contient les joueurs de la partie où le déplacement a eu lieu
    var currentRoom = Object.keys(socket.rooms).filter(item => item != socket.id);
    // Envoie du déplacement aux 2 joueurs
    socket.in(currentRoom).emit('deplacement-joueur-reception', inverseMove);

  });

  socket.on("finPartie", function (pseudo) {
    user_management.getNbVictoires(pseudo);
    user_management.addVictoire(pseudo);
    game_management.updateGagnant(pseudo);
  });

  socket.on("score", function () {
    user_management.getAllUsersScore()
      .then(dataU => {
        console.log('Index data : ' + JSON.stringify(dataU));
        socket.emit("score.result", dataU);
      });
  })

  socket.on("disconnect", function () {
    user_management.PlayerDisconnected(socket.id);
  });
});
