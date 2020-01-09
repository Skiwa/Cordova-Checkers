// <----------------- Dépendances Node/npm ----------------->
var os = require("os");

/**
 * Récupère les addresses du serveur.
 * Utile pour les logs et savoir à quelle addresse se connecter
 * @param portServeur Port du serveur à écouter
 * @return Adresses IP disponibles
 */
function getAddressesIp(portServeur) {
  var networkInterfaces = Object.values(os.networkInterfaces())
    .reduce((r, a) => {
      r = r.concat(a);
      return r;
    }, [])
    .filter(({ family, address }) => {
      return family.toLowerCase().indexOf("v4") >= 0 && address !== "127.0.0.1";
    })
    .map(({ address }) => address + ":" + portServeur);
  var ipAddresses = networkInterfaces.join(", ");
  return ipAddresses;
}

//<----------------- Exports ----------------->
exports.getAddressesIp = getAddressesIp;
