// Chargement de socket.io
var io = require("socket.io");
var user_management = require("./user_management");
const server = io.listen(3000);

// Quand un client se connecte, le serveur lui envoie un message
// Quand un client se connecte, on le note dans la console
server.on("connection", function(socket) {
  console.log("un client s'est connecté");
  //permet l'envoie du message, 'message' = le type, 'Vous ...' = le contenu
  socket.emit("connection_ok", "Vous êtes bien connecté !");
  socket.on("login", function(pseudo) {
    // Lors du login, ajoute le pseudo du joueur + socketId
    var joueur = user_management.addJoueur(pseudo, socket.id);

    // Test affichage
    console.log("Joueur 1 :" + JSON.stringify(joueur.newJoueur));
    console.log("Liste Joueur Connectés :" + JSON.stringify(joueur.joueurCo));

    socket.emit("ready", pseudo + " ready pour attendre !");
  });
  socket.on("disconnect", function() {
    console.log("user " + socket.id + " disconnected");
  });
});
