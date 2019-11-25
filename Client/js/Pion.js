var Pion = /** @class */ (function () {
    /**
     * Crée un pion en fonction de son charactère
     * @param char b|B|n|N
     */
    function Pion(char) {
        this.reine = false;
        if (char === char.toUpperCase()) {
            this.reine = true;
        }
        if (char.toLowerCase() === 'b') {
            this.couleur = "blanc";
        }
        else {
            this.couleur = "noir";
        }
    }
    /**
     * Renvoie la couleur du pion comme un char. En majuscule si c'est une reine
     * @returns string b|B|n|N
     */
    Pion.prototype.getChar = function () {
        var char = this.couleur === 'blanc' ? 'b' : 'n';
        return (this.reine ? char.toUpperCase() : char);
    };
    /**
     * Transforme le pion en dame
     */
    Pion.prototype.devientDame = function () {
        this.reine = true;
    };
    Pion.prototype.toString = function () {
        return ('Pion ' + this.couleur + (this.reine ? ' reine' : ''));
    };
    return Pion;
}());
