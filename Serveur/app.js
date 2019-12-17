// Imports modules
var user_management = require("./user_management");

var path = require("path");
var express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(3000);

// Reconnaissance de la partie Client
app.use(express.static(path.join(__dirname, "../Client")));

//Lancement fichier index.html lors de l'arrivée sur localhost:3000
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../Client", "index.html"));
});

// Quand un client se connecte, le serveur lui envoie un message
// Quand un client se connecte, on le note dans la console
io.on("connection", function(socket) {
  console.log("un client s'est connecté");
  socket.emit("connection_ok", "Vous êtes bien connecté !");
  socket.on("login", function(pseudo) {
    // Lors du login, ajoute le pseudo du joueur + socketId
    var joueur = user_management.addJoueur(pseudo, socket.id);
    // console.log(joueur.listeAttente);

    if (joueur.listeAttente.length < 2) {
      // Peut pas jouer car solo, donc il doit attendre
      socket.emit("not ready", "on attend un 2ème joueur");
    } else {
      socket.emit("ready", pseudo + " ready pour jouer !");
    }
  });
  socket.on("disconnect", function() {
    // console.log("user " + socket.id + " disconnected");
    user_management.PlayerDisconnected(socket.id);
  });
});
