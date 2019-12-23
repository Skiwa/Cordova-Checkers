// Imports modules
var user_management = require("./user_management");
var game_management = require("./game_management");

var path = require("path");
var express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);

var joueur;
var listeAttente = [];
var listeJeu = [];

server.listen(3000);

// Reconnaissance de la partie Client
app.use(express.static(path.join(__dirname, "../Client")));

//Lancement fichier index.html lors de l'arrivée sur localhost:3000
//../Client/vues
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../Client/", "index.html"));
});

// Quand un client se connecte, le serveur lui envoie un message
io.on("connection", function(socket) {
  console.log("un client s'est connecté");
  socket.emit("connection_ok", "Vous êtes bien connecté !");
  socket.on("login", function(pseudo) {
    // Lors du login, ajoute le pseudo du joueur + socketId
    var obj = user_management.addJoueur(pseudo, socket.id);

    joueur = obj.newJoueur;
    listeAttente = obj.listeAttente;
    // console.log(joueur.listeAttente);
  });

  setTimeout(function() {
    if (listeAttente.length >= 2) {
      game_management.newPartie(listeAttente[0].joueur, listeAttente[1].joueur);
      var color1 = Math.random() >= 0.5 ? "noir" : "blanc";
      var color2 = color1 === "noir" ? "blanc" : "noir";
      // listeJeu.push({JSockId:listeAttente[0].id, J:listeAttente[0].joueur},{JSockId:listeAttente[1].id, J:listeAttente[1].joueur});
      io.to(`${listeAttente[0].id}`).emit(
        "ready",
        JSON.stringify({
          adversaire: listeAttente[1].joueur.pseudo,
          yourColor: color1
        })
      );
      io.to(`${listeAttente[1].id}`).emit(
        "ready",
        JSON.stringify({
          adversaire: listeAttente[0].joueur.pseudo,
          yourColor: color2
        })
      );
      listeAttente.splice(0, 2);
    }
  }, 5000);

  socket.on("deplacement-joueur-envoi", function(move) {
    console.log(socket.id + " move : " + JSON.stringify(move));
    // console.log("inverse old x = ", 9 - move.anciennePosition.x);
    // console.log("inverse old y = ", 9 - move.anciennePosition.y);
    // console.log("inverse new x = ", 9 - move.nouvellePosition.x);
    // console.log("inverse new y = ", 9 - move.nouvellePosition.y);
    var inverseMove = {
      anciennePosition: {
        x: 9 - move.anciennePosition.x,
        y: 9 - move.anciennePosition.y
      },
      nouvellePosition: {
        x: 9 - move.nouvellePosition.x,
        y: 9 - move.nouvellePosition.y
      }
    };
    socket.broadcast.emit("deplacement-joueur-reception", inverseMove);
  });

  // socket.on("message", function(message) {
  //   // On récupère le pseudo de celui qui a cliqué dans les variables de session
  //   console.log(socket.id + " me parle ! Il me dit : " + message);
  // });
  socket.on("disconnect", function() {
    // console.log("user " + socket.id + " disconnected");
    user_management.PlayerDisconnected(socket.id);
  });
});
