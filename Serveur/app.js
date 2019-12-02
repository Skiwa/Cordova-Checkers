// Chargement de socket.io
var io = require("socket.io");
const server = io.listen(3000);

// // Lancement
// server.listen(8080, function() {
//     console.log("Static server is up on http://localhost:8080")
// })
console.log("hey");
// Quand un client se connecte, le serveur lui envoie un message
// Quand un client se connecte, on le note dans la console
server.on("connection", function(socket) {
  console.log("un client s'est connecté");
  //permet l'envoie du message, 'message' = le type, 'Vous ...' = le contenu
  socket.emit("connection_ok", "Vous êtes bien connecté !");
  socket.on("login", function(pseudo) {
    // console.log(pseudo);
    socket.emit("ready", pseudo + " ready pour attendre !");
  });
});
