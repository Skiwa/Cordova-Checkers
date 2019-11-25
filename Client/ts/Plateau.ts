class Plateau{

    plateau: any[][];
    taille:number;

    constructor(taille:number){
        console.log("Nouveau plateau: "+taille+"*"+taille);
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
     * Retourne le pion situé à une position x et y
     * @param position 
     */
    getPionFromPosition(position:{x:number,y:number}){
        return this.plateau[position.x][position.y];
    }
}