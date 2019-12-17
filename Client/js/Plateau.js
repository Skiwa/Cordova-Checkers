class Plateau {
    constructor(taille) {
        this.taille = taille;
        this.initialisePlateau();
    }
    initialisePlateau() {
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
        for (let i = 0; i < 2; i++) {
            //décale d'une position aux lignes paires
            if (i % 2 == 0) {
                j = 0;
            }
            else {
                j = 1;
            }
            for (j; j < this.taille; j += 2) {
                this.plateau[j][i] = new Pion('b'); //pose un pion blanc
            }
        }
        //noirs
        for (let i = this.taille - 1; i > this.taille - 3; i--) {
            //décale d'une position aux lignes paires
            if (i % 2 == 0)
                j = 0;
            else
                j = 1;
            for (j; j < this.taille; j += 2) {
                this.plateau[j][i] = new Pion('n'); //pose un pion noir
            }
        }
    }
    /**
     * Renvoie le plateau en string pour la console
     */
    toString() {
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
    }
    /**
     * Déplace un pion
     * @param pion
     * @param position
     */
    deplacePionAtPosition(pion, nouvellePosition) {
        let anciennePosition = this.getPositionFromPion(pion);
        this.plateau[anciennePosition.x][anciennePosition.y] = 0;
        this.plateau[nouvellePosition.x][nouvellePosition.y] = pion;
    }
    /**
     * Retourne le pion situé à une position x et y
     * @param position
     */
    getPionFromPosition(position) {
        try {
            return this.plateau[position.x][position.y];
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Retourne la position x et y d'un pion
     * @param position
     */
    getPositionFromPion(pion) {
        for (let i = 0; i < this.plateau.length; i++) {
            for (let j = 0; j < this.plateau.length; j++) {
                if (this.plateau[i][j] === pion) {
                    return { x: i, y: j };
                }
            }
        }
        return null;
    }
    /**
     * Retire un pion
     * @param pion
     */
    retirePion(pion) {
        let position = this.getPositionFromPion(pion);
        this.plateau[position.x][position.y] = 0;
    }
    /**
     * Transforme un pion en reine
     * @param pion
     */
    pionDevientReine(pion) {
        let position = this.getPositionFromPion(pion);
        this.plateau[position.x][position.y].devientReine();
    }
    /**
     * Retourne les positions possibles pour un pion
     * @param  {Pion} pion
     * @returns {x:number,y:number,mange:Pion}[]
     */
    getDeplacementsPossiblesFromPion(pion) {
        let positionPion = this.getPositionFromPion(pion);
        let res = [];
        let i, j;
        try {
            if (!pion.reine) {
                for (let _i = 0; _i < 2; _i++) {
                    for (let _j = 0; _j < 2; _j++) {
                        i = _i === 0 ? -1 : 1;
                        j = _j === 0 ? -1 : 1;
                        // - Si l'endroit visé existe
                        if (positionPion.x + (1 * i) >= 0 && positionPion.x + (1 * i) < this.taille - 1 && positionPion.y + (1 * j) >= 0 && positionPion.y + (1 * j) < this.taille - 1) {
                            // - Si personne dans l'endroit visé
                            if (this.plateau[positionPion.x + (1 * i)][positionPion.y + (1 * j)] === 0) {
                                // - Si le pion avance dans la bonne direction
                                if ((pion.couleur === "noir" && j === -1) || (pion.couleur === "blanc" && j === 1))
                                    res.push({ x: positionPion.x + (1 * i), y: positionPion.y + (1 * j) });
                            }
                            else {
                                // - Si la case d'après existe
                                if (positionPion.x + (2 * i) >= 0 && positionPion.x + (2 * i) < this.taille - 1 && positionPion.y + (2 * j) >= 0 && positionPion.y + (2 * j) < this.taille - 1) {
                                    // - Si personne a la case d'après et si le pion visé est adverse, c'est bon
                                    if (this.plateau[positionPion.x + (2 * i)][positionPion.y + (2 * j)] === 0 && this.plateau[positionPion.x + (1 * i)][positionPion.y + (1 * j)].couleur !== pion.couleur) {
                                        res.push({ x: positionPion.x + (2 * i), y: positionPion.y + (2 * j), mange: this.getPionFromPosition({ x: positionPion.x + (1 * i), y: positionPion.y + (1 * j) }) });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
            }
        }
        catch (error) {
            //Dépassement d'index de tableau
            console.log("err", error);
        }
        return res;
    }
}
