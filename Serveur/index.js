var express = require('express')
var app = express();
var http = require('http').createServer(app);

app.use(express.static(__dirname + '/../Client'));

app.get('/', function (req, res) {

  // Affichage de l'index du Client lors de l'appel de base
  res.sendFile(__dirname + '/Client/index.html');
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});