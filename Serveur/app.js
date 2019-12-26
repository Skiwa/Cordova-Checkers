// Imports modules
var user_management = require("./user_management");
var game_management = require("./game_management");

var path = require("path");
var express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);

var listeAttente = [];

server.listen(3000);

// Reconnaissance de la partie Client
app.use(express.static(path.join(__dirname, "../Client/www")));

//Lancement fichier index.html lors de l'arrivée sur localhost:3000
//../Client/www/vues
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../Client/www/", "index.html"));
});

// Quand un client se connecte au WebSocket, le serveur lui envoie un message
io.on("connection", function(socket) {
  console.log("un client s'est connecté");
  socket.emit("connection_ok", "Vous êtes bien connecté au serveur!");

  // Login du joueur entrant
  socket.on("login", function(pseudo) {
    var obj = user_management.addJoueur(pseudo, socket.id);

    listeAttente = obj.listeAttente;
  });

  setInterval(function() {
    if (listeAttente.length >= 2) {
      game_management.newPartie(listeAttente[0].joueur, listeAttente[1].joueur);
      var color = game_management.selectColor();

      io.to(`${listeAttente[0].id}`).emit(
        "ready",
        JSON.stringify({
          adversaire: listeAttente[1].joueur.pseudo,
          yourColor: color.color1
        })
      );
      io.to(`${listeAttente[1].id}`).emit(
        "ready",
        JSON.stringify({
          adversaire: listeAttente[0].joueur.pseudo,
          yourColor: color.color2
        })
      );
      listeAttente.splice(0, 2);
    } else {
      io.emit("notReady", "Nous vous cherchons un adversaire, patientez..");
    }
  }, 5000);

  socket.on("deplacement-joueur-envoi", function(move) {
    // console.log(socket.id + " move : " + JSON.stringify(move));

    // Appel game module pour inversion des déplacements
    var inverseMove = game_management.inverseDeplacement(move);
    socket.broadcast.emit("deplacement-joueur-reception", inverseMove);
  });

  // TODO: Fin de game Victoire / Défaite
  socket.on("finPartie", function(pseudo) {
    console.log("Le joueur " + pseudo + " a gagné -> son nbVictoire++");
  });

  socket.on("disconnect", function() {
    // console.log("user " + socket.id + " disconnected");
    user_management.PlayerDisconnected(socket.id);
  });
});
