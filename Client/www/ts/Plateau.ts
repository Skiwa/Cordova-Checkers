class Plateau{

    plateau: any[][];       //Grille de pions
    taille:number;          //Taille du plateau (fixée à 10)
    tour:number;            //Tour actuel
    jeu:Jeu;                //Instance du jeu

    constructor(jeu:Jeu){
        this.jeu = jeu;
        this.initialisePlateau();
    }

    /**
     * Crée le plateau
     */
    initialisePlateau(){    
        //Initialise la grille
        this.plateau = new Array(this.jeu.taillePlateau);
        for (var i = 0; i < this.jeu.taillePlateau; i++) {
            this.plateau[i] = new Array(this.jeu.taillePlateau);
        }
    
        //Remplie la grille
        for (var i = 0; i < this.jeu.taillePlateau; i++) {
            for (var j = 0; j < this.jeu.taillePlateau; j++) {
                this.plateau[i][j] = 0;
            }
        }

        //Ajoute les pions
        for(let i = 0; i < this.jeu.taillePlateau ; i++){            
            for(let j = 0; j < this.jeu.taillePlateau; j++){
                if((i < 2 || i > 7) && ((i+j)%2 === 0)){
                    if(i < 2){
                        this.plateau[j][i] = new Pion(this.jeu.couleurJoueur === "blanc" ? 'n' : 'b');
                    }else{
                        this.plateau[j][i] = new Pion(this.jeu.couleurJoueur === "blanc" ? 'b' : 'n');
                    }
                }
            }
        }
    }

    /**
     * Renvoie le plateau en string pour la console
     */
    toString():string{
        var res = "";
        for (var i = 0; i < this.jeu.taillePlateau; i++) {
            for (var j = 0; j < this.jeu.taillePlateau; j++) {
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
        let i,j;
        try{
            if(!pion.reine){
                for(let _i = 0; _i<2; _i++){
                    for(let _j = 0; _j<2; _j++){
                        
                        i = _i === 0 ? -1 : 1;
                        j = _j === 0 ? -1 : 1;

                        // - Si l'endroit visé existe
                        if(positionPion.x+(1*i) >= 0 && positionPion.x+(1*i) < this.jeu.taillePlateau && positionPion.y+(1*j) >= 0 && positionPion.y+(1*j) < this.jeu.taillePlateau){
                            // - Si personne dans l'endroit visé
                            if(this.plateau[positionPion.x+(1*i)][positionPion.y+(1*j)]===0){

                                // - Si le pion avance dans la bonne direction
                                if(this.jeu.modeSolo){
                                    if(pion.couleur === this.jeu.couleurJoueurEnCours){

                                        if(this.jeu.couleurJoueur === this.jeu.couleurJoueurEnCours){
                                            if(j===-1){
                                                res.push({x:positionPion.x+(1*i),y:positionPion.y+(1*j)})
                                            }
                                        }else{
                                            if(j===1){
                                                res.push({x:positionPion.x+(1*i),y:positionPion.y+(1*j)})
                                            }
                                        }
                                    }
                                }else{
                                    if((pion.couleur === this.jeu.couleurJoueur && j === -1) || (pion.couleur !== this.jeu.couleurJoueur && j === 1)){
                                        res.push({x:positionPion.x+(1*i),y:positionPion.y+(1*j)})
                                    }
                                }
                            }
                            // - Si un pion à l'endroit visé
                            else{
                                // - Si la case d'après existe
                                if(positionPion.x+(2*i) >= 0 && positionPion.x+(2*i) < this.jeu.taillePlateau && positionPion.y+(2*j) >= 0 && positionPion.y+(2*j) < this.jeu.taillePlateau){
                                    // - Si personne a la case d'après et si le pion visé est adverse, c'est bon
                                    if(this.plateau[positionPion.x+(2*i)][positionPion.y+(2*j)]===0 && this.plateau[positionPion.x+(1*i)][positionPion.y+(1*j)].couleur!==pion.couleur){
                                        res.push({x:positionPion.x+(2*i),y:positionPion.y+(2*j), mange:this.getPionFromPosition({x:positionPion.x+(1*i),y:positionPion.y+(1*j)})});
                                    }
                                }
                            }
                        }
                    }
                }
            }else{

                let aRencontrePion;

                for(let _i = 0; _i<2; _i++){
                    for(let _j = 0; _j<2; _j++){
                        
                        i = _i === 0 ? -1 : 1;
                        j = _j === 0 ? -1 : 1;

                        aRencontrePion = false;
                        for(let k = 1; k < 10; k++){
                             // - Si la case existe
                            if(positionPion.x+(k*i) >= 0 && positionPion.x+(k*i) < this.jeu.taillePlateau && positionPion.y+(k*j) >= 0 && positionPion.y+(k*j) < this.jeu.taillePlateau){

                                // - Si la case est vide 
                                if(this.plateau[positionPion.x+(k*i)][positionPion.y+(k*j)] === 0){
                                    res.push({x:positionPion.x+(k*i),y:positionPion.y+(k*j)});
                                }
                                // - Si la case contient un pion
                                else{
                                    aRencontrePion=true;
                                }

                                // - Si on a rencontré un pion avant et si la case actuelle est vide
                                if(aRencontrePion && this.plateau[positionPion.x+(k*i)][positionPion.y+(k*j)] === 0){
                                    // - Si c'était un pion ennemi
                                    if(this.plateau[positionPion.x+((k-1)*i)][positionPion.y+((k-1)*j)].couleur !== this.jeu.couleurJoueurEnCours){
                                        res.push({x:positionPion.x+(k*i),y:positionPion.y+(k*j), mange:this.getPionFromPosition({x:positionPion.x+((k-1)*i),y:positionPion.y+((k-1)*j)})});
                                    }

                                    break;
                                }

                        }
                        
                    }
                }
            }
        }}catch(error){
            //Dépassement d'index de tableau
            console.log("err",error);
        }
        return res;
    }

    //Renvoie vrai si l'un des 2 joueurs n'a plus de pions
    isFinPartie():Boolean {
        let foundNoir=false;
        let foundBlanc=false;
        for (let i = 0; i < this.plateau.length; i++){
            for (let j = 0; j < this.plateau.length; j++){
                let c = this.plateau[i][j];
                if (c instanceof Pion) {
                    if (c.couleur === "blanc"){
                        foundBlanc = true;
                    }
                    else {
                        foundNoir = true;
                    }
                } 
            }
        }
        return (!foundNoir || !foundBlanc)
    }
}