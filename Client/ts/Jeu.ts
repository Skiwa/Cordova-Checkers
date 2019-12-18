class Jeu{

    plateau: Plateau;
    taillePlateau:number = 10;
    tour:number = 1;
    pionSelectionne:Pion;
    pionsMangeables:Pion[] = [];
    couleurJoueur:String;

    /**
     * Crée un nouveau jeu
     * @param modeSolo 
     * @param couleurJoueur Défini de manière random par defaut. Peut être renseignée 
     */
    constructor(modeSolo:Boolean, couleurJoueur:String = Math.random() >= 0.5 ? "noir" : "blanc"){
        
        //Fixe la couleur du joueur
        this.couleurJoueur = couleurJoueur;
        console.log("Couleur joueur : ", this.couleurJoueur);
        console.log("Les noirs commencent");
        
        //Création graphique du plateau
        this.creerPlateauGraphiquement();

        //Initialisation du plateau
        this.plateau = new Plateau(10, this.couleurJoueur);

        //Capture les clics utilisateur
        this.setClickEventListener();
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

            //Récupère le pion cliqué si il existe
            let pion = this.getPionFromPosition(position);

            //-Si il y a un pion à cet endroit
            if(pion!==0){

                //- Si aucun pion n'est déjà selectionné ou si un pion de la couleur du joueur est déjà selectionné
                //- Et si le pion cible est de la couleur du joueur
                //TODO: supprimer les parenthèses compliquées en mode mult
                if((!this.pionSelectionne || (this.pionSelectionne && ((this.pionSelectionne.couleur === 'blanc' && (this.tour%2 === 0)) ||this.pionSelectionne.couleur === 'noir' && (this.tour%2 === 1))))&&((pion.couleur==='blanc' && (this.tour%2 === 0)) ||(pion.couleur==='noir' && (this.tour%2 === 1)))){
                    
                    console.log("select pion : ",pion);
                    //Selectionne le pion
                    this.selectPion(pion);

                    //Affiche les déplacements possibles
                    this.afficheDeplacementsPossiblesFromPion(pion);
                }

            }
            //-Si il n'y a pas de pion à cet endroit
            else{
                //-Si un pion est selectionné et si la case est possible
                if(this.pionSelectionne && e.target.classList.contains('plateau--case__possible')){
                    
                    //Mange un pion
                    this.mangePion(this.pionSelectionne,position);

                    //Déplace le pion
                    this.deplacePionAtPosition(this.pionSelectionne,position);

                    //Tour suivant
                    this.tourSuivant();
                }
            }
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

    /**
     * Selectionne un pion
     * @param pion
     */
    selectPion(pion:Pion){        
        //Enlève le style du dernier pion si il existe
        if(this.pionSelectionne){
            //Efface les styles des cases où il pouvait aller
            this.effaceDeplacementsPossibles();
        
            //Efface les pions qu'il pouvait manger
            this.effacePionsMangeables();

            //Retire son style de selection
            let positionAncienPion = this.plateau.getPositionFromPion(this.pionSelectionne);
            document.querySelector('.plateau tr:nth-child('+(positionAncienPion.y+1)+') td:nth-child('+(positionAncienPion.x+1)+') svg').classList.remove('pion__select');
        }

        //Sauvegarde le pion selectionné
        this.pionSelectionne=pion;

        let positionPion = this.plateau.getPositionFromPion(pion);

        //Met à jour le style du pion
        document.querySelector('.plateau tr:nth-child('+(positionPion.y+1)+') td:nth-child('+(positionPion.x+1)+') svg').classList.add('pion__select');
    }

    /**
     * Deselectionne un pion
     * @param pion
     */
    deselectPion(pion:Pion){        
        //Enlève le style du pion
        let positionPion = this.plateau.getPositionFromPion(pion);
        document.querySelector('.plateau tr:nth-child('+(positionPion.y+1)+') td:nth-child('+(positionPion.x+1)+') svg').classList.remove('pion__select');
        this.pionSelectionne = null;

        //Efface les styles des cases où le pion précedent pouvait aller
        this.effaceDeplacementsPossibles();

        //Efface les styles des pions qui pouvaient être mangés
        this.effacePionsMangeables();
    }

    /**
     * Déplace un pion
     * @param pion 
     * @param position 
     */
    deplacePionAtPosition(pion:Pion,position:{x:number,y:number}){
        let anciennePosition = this.plateau.getPositionFromPion(pion);
        
        //Déselectionne le pion actuel
        this.deselectPion(pion);

        //Clone le pion de son ancienne à sa nouvelle position
        let pionElement = document.querySelector('.plateau tr:nth-child('+(anciennePosition.y+1)+') td:nth-child('+(anciennePosition.x+1)+') svg');
        document.querySelector('.plateau tr:nth-child('+(position.y+1)+') td:nth-child('+(position.x+1)+')').appendChild(pionElement);
        
        //Déplace le pion dans le jeu
        this.plateau.deplacePionAtPosition(pion,position);

        //Teste si le pion devient une reine
        if((position.y === 0 && this.tour%2===1) || (position.y === this.taillePlateau-1 && this.tour%2===0)){
            this.pionDevientReine(pion);
        }
    }


    /**
     * Affiche les cases où le pion peut aller
     * @param pion 
     */
    afficheDeplacementsPossiblesFromPion(pion:Pion){
        //Récupère les déplacements possibles
        let deplacementsPossibles = this.plateau.getDeplacementsPossiblesFromPion(pion);

        //Ajoute du style aux éléments concernées
        deplacementsPossibles.forEach(deplacementPossible=>{
            //Style des cases où un déplacement est possible
            document.querySelector('.plateau tr:nth-child('+(deplacementPossible.y+1)+') td:nth-child('+(deplacementPossible.x+1)+')').classList.add('plateau--case__possible');
            
            //Style des pions ennemis pouvant être mangés
            if(deplacementPossible.mange){
                //Enregistre le pion dans le tableau des pions mangeables
                this.pionsMangeables.push(deplacementPossible.mange);
                //Efface le style
                let positionPionMangeable = this.plateau.getPositionFromPion(deplacementPossible.mange);
                document.querySelector('.plateau tr:nth-child('+(positionPionMangeable.y+1)+') td:nth-child('+(positionPionMangeable.x+1)+') svg').classList.add('pion__mangeable');
            }
        });
    }

    /**
     * Enleve les styles des cases où un déplacement était possible
     */
    effaceDeplacementsPossibles(){
        let caseElement;
        for(let i=0;i<this.taillePlateau;i++){
            for(let j=0;j<this.taillePlateau;j++){
                //Cases avec déplacement possible
                if(caseElement = document.querySelector('.plateau tr:nth-child('+(i+1)+') td:nth-child('+(j+1)+')')){
                    caseElement.classList.remove('plateau--case__possible');
                }
            }
        }
    }

    /**
     * Enleve les styles des pions qui pouvaient être mangés
     */
    effacePionsMangeables(){
        this.pionsMangeables=[];

        let pionElement;
        for(let i=0;i<this.taillePlateau;i++){
            for(let j=0;j<this.taillePlateau;j++){
                if(pionElement = document.querySelector('.plateau tr:nth-child('+(i+1)+') td:nth-child('+(j+1)+') svg')){
                    pionElement.classList.remove('pion__mangeable');
                }
            }
        }
    }

    /**
     * Teste si le pion peut manger un autre pion situé entre lui et sa nouvelle position
     * @param pion 
     * @param position 
     */
    mangePion(pion:Pion,position:{x:number,y:number}){
        let pionMange:Pion; //pionMangé*
        let i,j;

        //Vérifie si le pion mangé est compris dans la liste des pions mangeables
        for(let _i = 0; _i<2; _i++){
            for(let _j = 0; _j<2; _j++){
                
                i = _i === 0 ? -1 : 1;
                j = _j === 0 ? -1 : 1;

                if(this.pionsMangeables.includes(this.plateau.getPionFromPosition({x:position.x+(1*i),y:position.y+(1*j)}))){
                    pionMange = this.plateau.getPionFromPosition({x:position.x+(1*i),y:position.y+(1*j)});
                }
            }
        }

        //Si il existe, supprime le pion
        if(pionMange){
            let position = this.plateau.getPositionFromPion(pionMange);

            //Retire le pion graphiquement
            let pionElement = document.querySelector('.plateau tr:nth-child('+(position.y+1)+') td:nth-child('+(position.x+1)+') svg');
            pionElement.parentNode.removeChild(pionElement);
            
            //Retire le pion dans le jeu
            this.plateau.retirePion(pionMange);
        }

        //TODO: tester avec des reines
    }

    /**
     * Pion devient reine
     * @param pion 
     */
    pionDevientReine(pion:Pion){
        let position = this.plateau.getPositionFromPion(pion);

        //Mise à jour graphique
        document.querySelector('.plateau tr:nth-child('+(position.y+1)+') td:nth-child('+(position.x+1)+') svg').classList.add('pion__reine');
        
        //Mise à jour du jeu
        this.plateau.pionDevientReine(pion);
    }

    /**
     * Changement de tour
     */
    tourSuivant(){
        this.tour++;
    }


    /**
     * Génére les éléments du plateau et ajoute le tout à la page principale
     */
    creerPlateauGraphiquement(){
        let ligne;
        let carre;
        let pionSvg,pionCercle;
        let plateau = document.createElement("table");
        plateau.classList.add("plateau");
        let plateau_body = document.createElement("tbody");

        for(let i = 0; i < this.taillePlateau ; i++){
            ligne = document.createElement("tr");
            for(let j = 0; j < this.taillePlateau; j++){
                //Crée les cases
                carre = document.createElement("td");
                carre.classList.add("plateau--case");
                carre.classList.add((i+j)%2 == 0 ? "plateau--case__noire" : "plateau--case__blanche")

                //Crée les pions
                if((i < 2 || i > 7) && ((i+j)%2 === 0)){
                    //Conteneur svg
                    pionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    pionSvg.classList.add("pion");

                    //Fixe les pions du joueur en bas
                    if(i<2){
                        pionSvg.classList.add((this.couleurJoueur === "blanc" ? "pion__noir" : "pion__blanc"));
                    }else{
                        pionSvg.classList.add((this.couleurJoueur === "blanc" ? "pion__blanc" : "pion__noir"));
                    }

                    pionSvg.setAttribute("viewBox", "0 0 100 100"); 
                    pionSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg"); 

                    //Cercle svg
                    pionCercle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    pionCercle.setAttribute("cx", "50"); 
                    pionCercle.setAttribute("cy", "50"); 
                    pionCercle.setAttribute("r", "40"); 

                    pionSvg.appendChild(pionCercle);
                    carre.appendChild(pionSvg);
                }
                ligne.appendChild(carre);
            }
            plateau_body.appendChild(ligne);
        }
        plateau.appendChild(plateau_body);
        document.getElementById("main").appendChild(plateau);
    }

}