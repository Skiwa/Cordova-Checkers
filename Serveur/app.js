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
      io.to(`${listeAttente[0].id}`).emit(
        "ready",
        JSON.stringify({
          pseudo: listeAttente[1].joueur.pseudo,
          color: color1
        })
      );
      io.to(`${listeAttente[1].id}`).emit(
        "ready",
        JSON.stringify({
          pseudo: listeAttente[0].joueur.pseudo,
          color: color2
        })
      );
      listeAttente.splice(0, 2);
    }
  }, 5000);

  socket.on("message", function(message) {
    // On récupère le pseudo de celui qui a cliqué dans les variables de session
    console.log(socket.id + " me parle ! Il me dit : " + message);
  });
  socket.on("disconnect", function() {
    // console.log("user " + socket.id + " disconnected");
    user_management.PlayerDisconnected(socket.id);
  });
});
