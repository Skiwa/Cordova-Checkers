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

        //Ajoute les pions
        for(let i = 0; i < this.taille ; i++){            
            for(let j = 0; j < this.taille; j++){
                if((i < 2 || i > 7) && ((i+j)%2 === 0)){
                    this.plateau[j][i] = new Pion(i < 2 ? 'b' : 'n');
                }
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
        let i,j;

        try{
            if(!pion.reine){
                for(let _i = 0; _i<2; _i++){
                    for(let _j = 0; _j<2; _j++){
                        
                        i = _i === 0 ? -1 : 1;
                        j = _j === 0 ? -1 : 1;

                        // - Si l'endroit visé existe
                        if(positionPion.x+(1*i) >= 0 && positionPion.x+(1*i) < this.taille && positionPion.y+(1*j) >= 0 && positionPion.y+(1*j) < this.taille){
                            // - Si personne dans l'endroit visé
                            if(this.plateau[positionPion.x+(1*i)][positionPion.y+(1*j)]===0){
                                // - Si le pion avance dans la bonne direction
                                if((pion.couleur === "noir" && j === -1) ||(pion.couleur === "blanc" && j === 1))
                                    res.push({x:positionPion.x+(1*i),y:positionPion.y+(1*j)})
                            }
                            // - Si un pion à l'endroit visé
                            else{
                                // - Si la case d'après existe
                                if(positionPion.x+(2*i) >= 0 && positionPion.x+(2*i) < this.taille && positionPion.y+(2*j) >= 0 && positionPion.y+(2*j) < this.taille){
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
                //TODO: Mouvement des dames
                // let peutContinuer;
                // let decalage;
                // //Si c'est une dame : 
                
                // // - Check haut gauche
                // peutContinuer = true;
                // decalage = 1;
                // while(false){
                //     console.log("check haut gauche",decalage);
                //     //Si la case existe
                //     // //TODO: check si sorti du tableau (exception)
                //     // if(this.plateau[positionPion.x - decalage][positionPion.y - decalage]){
                //     //     res.push({x:positionPion.x - decalage, y: positionPion.y - decalage});
                //     //     decalage++;
                //     // }else{
                //     //     peutContinuer = false;
                //     // }
                // }
            }
        }catch(error){
            //Dépassement d'index de tableau
            console.log("err",error);
        }
        return res;
    }
}