// var http = require('http');
// var fs = require('fs');

// // Chargement du fichier index.html affiché au client
// var server = http.createServer(function(req, res) {
//     fs.readFile('../Client/index.html', 'UTF-8', function(error, content) {
//         res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
//         res.end(content);
//     });
// });

const http = require("http")
const finalhandler = require("finalhandler")
const serveStatic = require("serve-static")
 
// Crée une fonction middleware qui servira le contenu du dossier courant de façon statique
const serve = serveStatic("../Client")
 
// Création du serveur
const server = http.createServer(function(req, res) {
    serve(req, res, finalhandler(req, res)) // Traitement de la requête par le middleware
})
 
// Lancement
server.listen(8080, function() {
    console.log("Static server is up on http://localhost:8080")
})

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

// Quand un client se connecte, le serveur lui envoie un message 
io.sockets.on('connection', function (socket) {
    //permet l'envoie du message, 'message' = le type, 'Vous ...' = le contenu
    socket.emit('message', 'Vous êtes bien connecté !'); 
});

