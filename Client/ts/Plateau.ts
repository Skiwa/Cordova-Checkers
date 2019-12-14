class Plateau{

    plateau: any[][];
    taille:number;

    constructor(taille:number){
        this.taille = taille;
        this.initialisePlateau();
    }


    initialisePlateau(){    

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
            if (i % 2 == 0){
                j = 0;   
            }else{
                j = 1;
            }
    
            for (j; j < this.taille; j += 2) {
                this.plateau[j][i] = new Pion('b'); //pose un pion blanc
            }
        }
    
        //noirs
        for (let i = this.taille -1; i > this.taille - 3; i--) {
            //décale d'une position aux lignes paires
            if (i % 2 == 0) j = 0;
            else j = 1;
    
            for (j; j < this.taille; j += 2) {
                this.plateau[j][i] = new Pion('n'); //pose un pion noir
            }
        }

    }

    /**
     * Renvoie le plateau en string pour la console
     */
    toString():string{
        var res = "";
        for (var i = 0; i < this.taille; i++) {
            for (var j = 0; j < this.taille; j++) {
                if(this.plateau[j][i] instanceof Pion){
                    res += this.plateau[j][i].getChar() + " ";
                }else{
                    res+= "- ";
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
    deplacePionAtPosition(pion:Pion,nouvellePosition:{x:number,y:number}){
        let anciennePosition = this.getPositionFromPion(pion);

        this.plateau[anciennePosition.x][anciennePosition.y] = 0;
        this.plateau[nouvellePosition.x][nouvellePosition.y] = pion;
    }

    /**
     * Retourne le pion situé à une position x et y
     * @param position 
     */
    getPionFromPosition(position:{x:number,y:number}){
        try{
            return this.plateau[position.x][position.y];
        }catch(e){
            return null;
        }
    }

    /**
     * Retourne la position x et y d'un pion
     * @param position 
     */
    getPositionFromPion(pion:Pion):{x:number,y:number}{
        for (let i = 0; i < this.plateau.length; i++) {
            for(let j = 0; j < this.plateau.length; j++){
                if(this.plateau[i][j]===pion){
                    return {x:i,y:j}
                }
            }
        }
        return null;
    }

    /**
     * Retire un pion
     * @param pion 
     */
    retirePion(pion:Pion){
        let position = this.getPositionFromPion(pion);
        this.plateau[position.x][position.y] = 0;
    }

    /**
     * Transforme un pion en reine
     * @param pion 
     */
    pionDevientReine(pion:Pion){
        let position = this.getPositionFromPion(pion);
        this.plateau[position.x][position.y].devientReine();
    }

    
    /**
     * Retourne les positions possibles pour un pion
     * @param  {Pion} pion
     * @returns {x:number,y:number,mange:Pion}[]
     */
    getDeplacementsPossiblesFromPion(pion:Pion):{x:number,y:number, mange?:Pion}[]{

        let positionPion = this.getPositionFromPion(pion);
        let res = [];

        try{
            if(pion.couleur === 'noir'){
                // Déplacement haut gauche
                // - Si aucun pion à l'endroit visé, c'est bon
                if(this.plateau[positionPion.x+1][positionPion.y-1]===0){
                    res.push({x:positionPion.x+1,y:positionPion.y-1})
                }
                // - Si un pion à l'endroit visé
                else{
                    // - Si personne a la case d'après et si le pion visé est adverse, c'est bon
                    if(this.plateau[positionPion.x+2][positionPion.y-2]===0 && this.plateau[positionPion.x+1][positionPion.y-1].couleur!==pion.couleur){
                        res.push({x:positionPion.x+2,y:positionPion.y-2, mange:this.getPionFromPosition({x:positionPion.x+1,y:positionPion.y-1})});
                    }
                }

                // Déplacement haut droite
                // - Si aucun pion à l'endroit visé, c'est bon
                if(this.plateau[positionPion.x-1][positionPion.y-1]===0){
                    res.push({x:positionPion.x-1,y:positionPion.y-1})
                }
                // - Si un pion à l'endroit visé
                else{
                    // - Si personne a la case d'après et si le pion visé est adverse, c'est bon
                    if(this.plateau[positionPion.x-2][positionPion.y-2]===0 && this.plateau[positionPion.x-1][positionPion.y-1].couleur !== pion.couleur){
                        res.push({x:positionPion.x-2,y:positionPion.y-2,mange:this.getPionFromPosition({x:positionPion.x-1,y:positionPion.y-1})});
                    }
                }

                // Déplacement bas gauche
                // - Si pion adverse en bas gauche 
                if(this.plateau[positionPion.x+1][positionPion.y+1] !== 0 && this.plateau[positionPion.x+1][positionPion.y+1].couleur !== pion.couleur){
                    // - Si case d'après libre
                    if(this.plateau[positionPion.x+2][positionPion.y+2] === 0){
                        res.push({x:positionPion.x+2,y:positionPion.y+2,mange:this.getPionFromPosition({x:positionPion.x+1,y:positionPion.y+1})});
                    }
                }

                // Déplacement bas droite
                // - Si pion adverse en bas droite 
                if(this.plateau[positionPion.x-1][positionPion.y+1] !== 0 && this.plateau[positionPion.x-1][positionPion.y+1].couleur !== pion.couleur){
                    // - Si case d'après libre
                    if(this.plateau[positionPion.x-2][positionPion.y+2] === 0){
                        res.push({x:positionPion.x-2,y:positionPion.y+2,mange:this.getPionFromPosition({x:positionPion.x-1,y:positionPion.y+1})});
                    }
                }


            }else{
                // Déplacement bas gauche
                // - Si aucun pion à l'endroit visé, c'est bon
                if(this.plateau[positionPion.x+1][positionPion.y+1]===0){
                    res.push({x:positionPion.x+1,y:positionPion.y+1})
                }
                // - Si un pion à l'endroit visé
                else{
                    // - Si personne a la case d'après et si le pion visé est adverse, c'est bon
                    if(this.plateau[positionPion.x+2][positionPion.y+2]===0 && this.plateau[positionPion.x+1][positionPion.y+1].couleur!==pion.couleur){
                        res.push({x:positionPion.x+2,y:positionPion.y+2, mange:this.getPionFromPosition({x:positionPion.x+1,y:positionPion.y+1})});
                    }
                }

                // Déplacement bas droite
                // - Si aucun pion à l'endroit visé, c'est bon
                if(this.plateau[positionPion.x-1][positionPion.y+1]===0){
                    res.push({x:positionPion.x-1,y:positionPion.y+1})
                }
                // - Si un pion à l'endroit visé
                else{
                    // - Si personne a la case d'après et si le pion visé est adverse, c'est bon
                    if(this.plateau[positionPion.x-2][positionPion.y+2]===0 && this.plateau[positionPion.x-1][positionPion.y+1].couleur !== pion.couleur){
                        res.push({x:positionPion.x-2,y:positionPion.y+2,mange:this.getPionFromPosition({x:positionPion.x-1,y:positionPion.y+1})});
                    }
                }

                // Déplacement haut gauche
                // - Si pion adverse en bas gauche 
                if(this.plateau[positionPion.x+1][positionPion.y-1] !== 0 && this.plateau[positionPion.x+1][positionPion.y-1].couleur !== pion.couleur){
                    // - Si case d'après libre
                    if(this.plateau[positionPion.x+2][positionPion.y-2] === 0){
                        res.push({x:positionPion.x+2,y:positionPion.y-2,mange:this.getPionFromPosition({x:positionPion.x+1,y:positionPion.y-1})});
                    }
                }

                // Déplacement haut droite
                // - Si pion adverse en bas droite 
                if(this.plateau[positionPion.x-1][positionPion.y-1] !== 0 && this.plateau[positionPion.x-1][positionPion.y-1].couleur !== pion.couleur){
                    // - Si case d'après libre
                    if(this.plateau[positionPion.x-2][positionPion.y-2] === 0){
                        res.push({x:positionPion.x-2,y:positionPion.y-2,mange:this.getPionFromPosition({x:positionPion.x-1,y:positionPion.y-1})});
                    }
                }
            }

            //TODO:déplacement bords
            //TODO:déplacement reines

        }catch(error){
            //On a dépasse les index des tableaux en faisant les tests (évite de planter)
        }
        return res;
    }
}