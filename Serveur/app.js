//Dépendances Node/npm
var express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);
var os = require( 'os' );

//Dépendances locales
var user_management = require("./user_management");
var game_management = require("./game_management");


const portServeur = 3000;
var listeAttente = [];

//Lance le serveur
server.listen(portServeur);
console.log("Serveur lancé sur les addresses : " + getAddressesIp());

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
    // Appel game module pour inversion des déplacements
    var inverseMove = game_management.inverseDeplacement(move);
    socket.broadcast.emit("deplacement-joueur-reception", inverseMove);
  });

  // TODO: Fin de game Victoire / Défaite
  socket.on("finPartie", function(pseudo) {
    console.log("Le joueur " + pseudo + " a gagné -> son nbVictoire++");
  });

  socket.on("disconnect", function() {
    user_management.PlayerDisconnected(socket.id);
  });
});



/**
 * TODO : A isoler dans un fichier ? 
 * Récupère les addresses du serveur. 
 * Utile pour les logs et savoir à quelle addresse se connecter
 */
function getAddressesIp(){  
  var networkInterfaces = Object.values(os.networkInterfaces())
      .reduce((r,a)=>{
          r = r.concat(a)
          return r;
      }, [])
      .filter(({family, address}) => {
          return family.toLowerCase().indexOf('v4') >= 0 &&
              address !== '127.0.0.1'
      })
      .map(({address}) => (address+":"+portServeur));
  var ipAddresses = networkInterfaces.join(', ');
  return(ipAddresses);
}