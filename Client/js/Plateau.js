var Plateau = /** @class */ (function () {
    function Plateau(taille) {
        console.log("Nouveau plateau: " + taille + "*" + taille);
        this.taille = taille;
        this.initialisePlateau();
    }
    Plateau.prototype.initialisePlateau = function () {
        //Initialise la grille
        this.plateau = new Array(this.taille);
        for (var i = 0; i < this.taille; i++) {
            this.plateau[i] = new Array(this.taille);
        }
        //Remplie la grille
        for (var i = 0; i < this.taille; i++) {
            for (var j = 0; j < this.taille; j++) {
                this.plateau[i][j] = 0;
            }
        }
        /* -- Rempli la grille avec les pions par défaut -- */
        //blancs
        for (var i_1 = 0; i_1 < 2; i_1++) {
            //décale d'une position aux lignes paires
            if (i_1 % 2 == 0) {
                j = 0;
            }
            else {
                j = 1;
            }
            for (j; j < this.taille; j += 2) {
                this.plateau[j][i_1] = new Pion('b'); //pose un pion blanc
            }
        }
        //noirs
        for (var i_2 = this.taille - 1; i_2 > this.taille - 3; i_2--) {
            //décale d'une position aux lignes paires
            if (i_2 % 2 == 0)
                j = 0;
            else
                j = 1;
            for (j; j < this.taille; j += 2) {
                this.plateau[j][i_2] = new Pion('n'); //pose un pion noir
            }
        }
    };
    /**
     * Renvoie le plateau en string pour la console
     */
    Plateau.prototype.toString = function () {
        var res = "";
        for (var i = 0; i < this.taille; i++) {
            for (var j = 0; j < this.taille; j++) {
                if (this.plateau[j][i] instanceof Pion) {
                    res += this.plateau[j][i].getChar() + " ";
                }
                else {
                    res += "- ";
                }
            }
            res += "\n";
        }
        return res;
    };
    /**
     * Retourne le pion situé à une position x et y
     * @param position
     */
    Plateau.prototype.getPionFromPosition = function (position) {
        return this.plateau[position.x][position.y];
    };
    return Plateau;
}());
