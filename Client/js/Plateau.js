var Plateau = (function () {
    function Plateau(taille) {
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
     * Déplace un pion
     * @param pion
     * @param position
     */
    Plateau.prototype.deplacePionAtPosition = function (pion, nouvellePosition) {
        var anciennePosition = this.getPositionFromPion(pion);
        this.plateau[anciennePosition.x][anciennePosition.y] = 0;
        this.plateau[nouvellePosition.x][nouvellePosition.y] = pion;
    };
    /**
     * Retourne le pion situé à une position x et y
     * @param position
     */
    Plateau.prototype.getPionFromPosition = function (position) {
        return this.plateau[position.x][position.y];
    };
    /**
     * Retourne la position x et y d'un pion
     * @param position
     */
    Plateau.prototype.getPositionFromPion = function (pion) {
        for (var i = 0; i < this.plateau.length; i++) {
            for (var j = 0; j < this.plateau.length; j++) {
                if (this.plateau[i][j] === pion) {
                    return { x: i, y: j };
                }
            }
        }
        return null;
    };
    /**
     * Transforme un pion en reine
     * @param pion
     */
    Plateau.prototype.pionDevientReine = function (pion) {
        var position = this.getPositionFromPion(pion);
        this.plateau[position.x][position.y].devientReine();
    };
    /**
     * Retourne les positions possibles pour un pion
     * @param  {Pion} pion
     * @returns {x:number,y:number}[]
     */
    Plateau.prototype.getDeplacementsPossiblesFromPion = function (pion) {
        var positionPion = this.getPositionFromPion(pion);
        var res = [];
        try {
            if (pion.couleur === 'noir') {
                //Check haut gauche
                if (this.plateau[positionPion.x + 1][positionPion.y - 1] === 0) {
                    res.push({ x: positionPion.x + 1, y: positionPion.y - 1 });
                }
                else {
                    if (this.plateau[positionPion.x + 2][positionPion.y - 2] === 0) {
                        res.push({ x: positionPion.x + 2, y: positionPion.y - 2 });
                    }
                }
                //Check haut droite
                if (this.plateau[positionPion.x - 1][positionPion.y - 1] === 0) {
                    res.push({ x: positionPion.x - 1, y: positionPion.y - 1 });
                }
                else {
                    if (this.plateau[positionPion.x - 2][positionPion.y - 2] === 0) {
                        res.push({ x: positionPion.x - 2, y: positionPion.y - 2 });
                    }
                }
            }
            if (pion.couleur === 'blanc') {
                //Check bas gauche
                if (this.plateau[positionPion.x + 1][positionPion.y + 1] === 0) {
                    res.push({ x: positionPion.x + 1, y: positionPion.y + 1 });
                }
                else {
                    if (this.plateau[positionPion.x + 2][positionPion.y + 2] === 0) {
                        res.push({ x: positionPion.x + 2, y: positionPion.y + 2 });
                    }
                }
                //Check bas droite
                if (this.plateau[positionPion.x - 1][positionPion.y + 1] === 0) {
                    res.push({ x: positionPion.x - 1, y: positionPion.y + 1 });
                }
                else {
                    if (this.plateau[positionPion.x - 2][positionPion.y + 2] === 0) {
                        res.push({ x: positionPion.x - 2, y: positionPion.y + 2 });
                    }
                }
            }
        }
        catch (error) {
        }
        return res;
    };
    return Plateau;
}());
