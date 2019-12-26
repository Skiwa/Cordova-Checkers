class Pion{
    
    couleur:string;
    reine:boolean = false;

    /**
     * Crée un pion en fonction de son charactère
     * @param char b|B|n|N
     */
    constructor(char:string){
        if(char === char.toUpperCase()){
            this.reine = true;
        }
        if(char.toLowerCase()==='b'){
            this.couleur = "blanc";
        }else{
            this.couleur = "noir";
        }
    }

    /**
     * Renvoie la couleur du pion comme un char. En majuscule si c'est une reine
     * @returns string b|B|n|N
     */
    getChar():string{
        let char = this.couleur === 'blanc' ? 'b' : 'n';
        return (this.reine ? char.toUpperCase() : char);
    }
    
    /**
     * Transforme le pion en reine
     */
    devientReine(){
        this.reine = true;
    }
    
    toString():string{
        return ('Pion '+this.couleur + (this.reine ? ' reine':''));
    }
}
