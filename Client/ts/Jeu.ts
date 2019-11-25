class Jeu{

    plateau: Plateau;
    taillePlateau:number = 10;

    constructor(){
        //Initialisation du plateau
        this.plateau = new Plateau(10);

        //Capture les clics utilisateur
        this.setClickEventListener();
        
        //Affiche le plateau dans la console
        console.log(this.plateau.toString());
    }

    setClickEventListener(){
        document.querySelector('.plateau').addEventListener('click', (event)=>{
            this.onClickPlateau(event);
        });
    }


    /**
     * Gère le clic utilisateur sur le terrain
     * @param e Evènement du clic
     */
    onClickPlateau(e):any{

        //Récupère la position de la case cliquée
        let position = this.getPositionFromEvent(e);

        if(position){

            //Récupère le pion actuel si il existe
            let pion = this.getPionFromPosition(position);
            
            //TODO: -Si il y a un pion à cet endroit
            if(pion!==0){

            }
            //TODO: -Si il n'y a pas de pion à cet endroit
            else{

            }
            
            console.log(pion.toString());
        }
    }


    /**
     * Renvoie la position x et y de la case cliquée
     * @param e Evènement du clic
     */
    getPositionFromEvent(e){
        //-Si la cible est une balise <circle>, remonte chercher la case dans les parents
        if(e.target.tagName==='circle'){
            var caseCible = e.target.parentElement.parentElement;
        }
        //-Si la cible est une case
        else{
            var caseCible = e.target;
        }
        
        //Vérifie si la case est une case noire
        if(caseCible.classList.contains('plateau--case__noire')){
            var ligneCible = caseCible.parentNode;
            var caseX = Array.prototype.indexOf.call(ligneCible.children, caseCible);
            var plateau = ligneCible.parentNode;
            var caseY = Array.prototype.indexOf.call(plateau.children, ligneCible);
            return({x:caseX, y:caseY})
        }else{
            return null;
        }
    }

    /**
     * Récupère un pion à une position x et y
     * @param position 
     */
    getPionFromPosition(position:{x:number,y:number}):any{
        return this.plateau.getPionFromPosition(position);
    }

    
}