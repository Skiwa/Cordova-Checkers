//Dépendances Node/npm
var server = require("http").createServer();
const io = require("socket.io")(server);

//Dépendances locales
var user_management = require("./management/user_management");
var game_management = require("./management/game_management");
var address_management = require("./management/address_management");
var bdd_connexion = require("./bdd_connexion");
var room = require("./room");

const portServeur = 3000;
var listeAttente = [];

//Lance le serveur
server.listen(portServeur);
console.log(
  "Serveur lancé sur les addresses : " + address_management.getAddressesIp(portServeur)
);

//Quand un client se connecte au WebSocket, le serveur lui envoie un message
io.on("connection", function (socket) {
  console.log("un client s'est connecté");
  socket.emit("connection_ok");

  //Login du joueur entrant
  socket.on("login", async function (userData, etat) {

    //Vérifie les rooms du socket
    var currentRoom = Object.keys(socket.rooms).filter(item => item != socket.id);

    //Check si le socket est dans une room en arrivant
    if (socket.adapter.rooms[currentRoom]) {
      //Quitte la room 
      socket.leave(currentRoom);
    }

    //Promesse d'addJoueur de type : data = { error:string , listeAttente: any[] }
    var obj = await user_management.addJoueur(userData, socket, etat);

    //Si erreur -> Bloque + envoie message vers client
    if (obj.error != "") {
      socket.emit("error_login", obj.error);
    } else {
      //Si !erreur -> Déroulement normal du jeu
      listeAttente = obj.listeAttente;

      if (listeAttente.length >= 2) {

        //Ajoute les joueurs et leurs id à la liste de jeu
        game_management.addList(listeAttente[0].socket.id, listeAttente[0].nomJoueur, listeAttente[1].socket.id, listeAttente[1].nomJoueur);

        //Création d'une nouvelle partie en bdd
        await game_management.newPartie(listeAttente[0].nomJoueur, listeAttente[1].nomJoueur);

        //Attribution aléatoire des couleurs
        var color = game_management.selectColor();

        //Incrémente le nb de partie des joueurs
        user_management.addPartie(listeAttente[0].nomJoueur);
        user_management.addPartie(listeAttente[1].nomJoueur);

        //Ajoute les joueurs dans une room
        await room.addRoom(listeAttente[0].socket)
        await room.addRoom(listeAttente[1].socket)

        //Envoie à chaque joueur sa couleur et le nom de l'adversaire
        io.to(`${listeAttente[0].socket.id}`).emit(
          "ready",
          JSON.stringify({
            adversaire: listeAttente[1].nomJoueur,
            yourColor: color.color1
          })
        );
        io.to(`${listeAttente[1].socket.id}`).emit(
          "ready",
          JSON.stringify({
            adversaire: listeAttente[0].nomJoueur,
            yourColor: color.color2
          })
        );

        //Supprime les 2 joueurs de la liste d'attente
        listeAttente.splice(0, 2);
      } else {
        socket.emit("notReady", "Nous vous cherchons un adversaire, patientez..");
      }
    }
  });


  socket.on("deplacement-joueur-envoi", function (move) {
    //Appel game module pour inversion des déplacements
    var inverseMove = game_management.inverseDeplacement(move);
    //Recupere la room qui contient les joueurs de la partie où le déplacement a eu lieu
    var currentRoom = Object.keys(socket.rooms).filter(item => item != socket.id);
    //Envoie du déplacement aux 2 joueurs
    socket.in(currentRoom).emit('deplacement-joueur-reception', inverseMove);

  });

  socket.on("finPartie", async function (pseudo) {
    user_management.addVictoire(pseudo);
    await game_management.updateGagnant(pseudo);
    user_management.getNbVictoires(pseudo);
  });

  socket.on("score", function () {
    user_management.getAllUsersScore()
      .then(dataU => {
        socket.emit("score.result", dataU);
      });
  })

  socket.on("disconnect", function () {
    user_management.PlayerDisconnected(socket);
    // On cherche la partie qui contient le socket id du joueur déconnecté
    game = game_management.findGame(socket.id);
    // Si on trouve une partie
    if (game != undefined) {
      // Si le socket id du joueur déconnecté correspond au joueur 2
      if (socket.id == game.idJ2) {
        // On envoie un message au joueur 1 avec la page de fin de partie
        socket.to(game.idJ1).emit("decoAutreJ", "L'autre joueur s'est déconnecté vous avez donc gagné la partie", game.J1);
      }
      // Sinon on envoie un message au joueur 2 avec la page de fin de partie
      socket.to(game.idJ2).emit("decoAutreJ", "L'autre joueur s'est déconnecté vous avez donc gagné la partie", game.J2);
    };
  });
});
