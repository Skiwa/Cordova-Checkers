class Jeu {
    constructor() {
        this.taillePlateau = 10;
        this.tour = 1;
        this.pionsMangeables = [];
        //Initialisation du plateau
        this.plateau = new Plateau(10);
        //Capture les clics utilisateur
        this.setClickEventListener();
        //Affiche le plateau dans la console
        console.log(this.plateau.toString());
    }
    setClickEventListener() {
        document.querySelector('.plateau').addEventListener('click', (event) => {
            this.onClickPlateau(event);
        });
    }
    /**
     * Gère le clic utilisateur sur le terrain
     * @param e Evènement du clic
     */
    onClickPlateau(e) {
        //Récupère la position de la case cliquée
        let position = this.getPositionFromEvent(e);
        if (position) {
            //Récupère le pion cliqué si il existe
            let pion = this.getPionFromPosition(position);
            //-Si il y a un pion à cet endroit
            if (pion !== 0) {
                //- Si aucun pion n'est déjà selectionné ou si un pion de la couleur du joueur est déjà selectionné
                //- Et si le pion cible est de la couleur du joueur
                if ((!this.pionSelectionne || (this.pionSelectionne && ((this.pionSelectionne.couleur === 'blanc' && (this.tour % 2 === 0)) || this.pionSelectionne.couleur === 'noir' && (this.tour % 2 === 1)))) && ((pion.couleur === 'blanc' && (this.tour % 2 === 0)) || (pion.couleur === 'noir' && (this.tour % 2 === 1)))) {
                    //Selectionne le pion
                    this.selectPion(pion);
                    //Affiche les déplacements possibles
                    this.afficheDeplacementsPossiblesFromPion(pion);
                }
            }
            else {
                //-Si un pion est selectionné et si la case est possible
                if (this.pionSelectionne && e.target.classList.contains('plateau--case__possible')) {
                    //Mange un pion
                    this.mangePion(this.pionSelectionne, position);
                    //Déplace le pion
                    this.deplacePionAtPosition(this.pionSelectionne, position);
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
    getPositionFromEvent(e) {
        //-Si la cible est une balise <circle>, remonte chercher la case dans les parents
        if (e.target.tagName === 'circle') {
            var caseCible = e.target.parentElement.parentElement;
        }
        else {
            var caseCible = e.target;
        }
        //Vérifie si la case est une case noire
        if (caseCible.classList.contains('plateau--case__noire')) {
            var ligneCible = caseCible.parentNode;
            var caseX = Array.prototype.indexOf.call(ligneCible.children, caseCible);
            var plateau = ligneCible.parentNode;
            var caseY = Array.prototype.indexOf.call(plateau.children, ligneCible);
            return ({ x: caseX, y: caseY });
        }
        else {
            return null;
        }
    }
    /**
     * Récupère un pion à une position x et y
     * @param position
     */
    getPionFromPosition(position) {
        return this.plateau.getPionFromPosition(position);
    }
    /**
     * Selectionne un pion
     * @param pion
     */
    selectPion(pion) {
        //Enlève le style du dernier pion si il existe
        if (this.pionSelectionne) {
            //Efface les styles des cases où il pouvait aller
            this.effaceDeplacementsPossibles();
            //Efface les pions qu'il pouvait manger
            this.effacePionsMangeables();
            //Retire son style de selection
            let positionAncienPion = this.plateau.getPositionFromPion(this.pionSelectionne);
            document.querySelector('.plateau tr:nth-child(' + (positionAncienPion.y + 1) + ') td:nth-child(' + (positionAncienPion.x + 1) + ') svg').classList.remove('pion__select');
        }
        //Sauvegarde le pion selectionné
        this.pionSelectionne = pion;
        let positionPion = this.plateau.getPositionFromPion(pion);
        //Met à jour le style du pion
        document.querySelector('.plateau tr:nth-child(' + (positionPion.y + 1) + ') td:nth-child(' + (positionPion.x + 1) + ') svg').classList.add('pion__select');
    }
    /**
     * Deselectionne un pion
     * @param pion
     */
    deselectPion(pion) {
        //Enlève le style du pion
        let positionPion = this.plateau.getPositionFromPion(pion);
        document.querySelector('.plateau tr:nth-child(' + (positionPion.y + 1) + ') td:nth-child(' + (positionPion.x + 1) + ') svg').classList.remove('pion__select');
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
    deplacePionAtPosition(pion, position) {
        let anciennePosition = this.plateau.getPositionFromPion(pion);
        //Déselectionne le pion actuel
        this.deselectPion(pion);
        //Clone le pion de son ancienne à sa nouvelle position
        let pionElement = document.querySelector('.plateau tr:nth-child(' + (anciennePosition.y + 1) + ') td:nth-child(' + (anciennePosition.x + 1) + ') svg');
        document.querySelector('.plateau tr:nth-child(' + (position.y + 1) + ') td:nth-child(' + (position.x + 1) + ')').appendChild(pionElement);
        //Déplace le pion dans le jeu
        this.plateau.deplacePionAtPosition(pion, position);
        //Teste si le pion devient une reine
        if ((position.y === 0 && this.tour % 2 === 1) || (position.y === this.taillePlateau - 1 && this.tour % 2 === 0)) {
            this.pionDevientReine(pion);
        }
        //log
        console.log(this.plateau.toString());
    }
    /**
     * Affiche les cases où le pion peut aller
     * @param pion
     */
    afficheDeplacementsPossiblesFromPion(pion) {
        //Récupère les déplacements possibles
        let deplacementsPossibles = this.plateau.getDeplacementsPossiblesFromPion(pion);
        //Ajoute du style aux éléments concernées
        deplacementsPossibles.forEach(deplacementPossible => {
            //Style des cases où un déplacement est possible
            document.querySelector('.plateau tr:nth-child(' + (deplacementPossible.y + 1) + ') td:nth-child(' + (deplacementPossible.x + 1) + ')').classList.add('plateau--case__possible');
            //Style des pions ennemis pouvant être mangés
            if (deplacementPossible.mange) {
                //Enregistre le pion dans le tableau des pions mangeables
                this.pionsMangeables.push(deplacementPossible.mange);
                //Efface le style
                let positionPionMangeable = this.plateau.getPositionFromPion(deplacementPossible.mange);
                document.querySelector('.plateau tr:nth-child(' + (positionPionMangeable.y + 1) + ') td:nth-child(' + (positionPionMangeable.x + 1) + ') svg').classList.add('pion__mangeable');
            }
        });
    }
    /**
     * Enleve les styles des cases où un déplacement était possible
     */
    effaceDeplacementsPossibles() {
        let caseElement;
        for (let i = 0; i < this.taillePlateau; i++) {
            for (let j = 0; j < this.taillePlateau; j++) {
                //Cases avec déplacement possible
                if (caseElement = document.querySelector('.plateau tr:nth-child(' + (i + 1) + ') td:nth-child(' + (j + 1) + ')')) {
                    caseElement.classList.remove('plateau--case__possible');
                }
            }
        }
    }
    /**
     * Enleve les styles des pions qui pouvaient être mangés
     */
    effacePionsMangeables() {
        this.pionsMangeables = [];
        let pionElement;
        for (let i = 0; i < this.taillePlateau; i++) {
            for (let j = 0; j < this.taillePlateau; j++) {
                if (pionElement = document.querySelector('.plateau tr:nth-child(' + (i + 1) + ') td:nth-child(' + (j + 1) + ') svg')) {
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
    mangePion(pion, position) {
        let pionMange; //pionMangé*
        if (pion.couleur === 'blanc') {
            if (this.pionsMangeables.includes(this.plateau.getPionFromPosition({ x: position.x + 1, y: position.y - 1 }))) {
                pionMange = this.plateau.getPionFromPosition({ x: position.x + 1, y: position.y - 1 });
            }
            if (this.pionsMangeables.includes(this.plateau.getPionFromPosition({ x: position.x - 1, y: position.y - 1 }))) {
                pionMange = this.plateau.getPionFromPosition({ x: position.x - 1, y: position.y - 1 });
            }
        }
        else if (pion.couleur === 'noir') {
            if (this.pionsMangeables.includes(this.plateau.getPionFromPosition({ x: position.x + 1, y: position.y + 1 }))) {
                pionMange = this.plateau.getPionFromPosition({ x: position.x + 1, y: position.y + 1 });
            }
            if (this.pionsMangeables.includes(this.plateau.getPionFromPosition({ x: position.x - 1, y: position.y + 1 }))) {
                pionMange = this.plateau.getPionFromPosition({ x: position.x - 1, y: position.y + 1 });
            }
        }
        if (pionMange) {
            let position = this.plateau.getPositionFromPion(pionMange);
            //Retire le pion graphiquement
            let pionElement = document.querySelector('.plateau tr:nth-child(' + (position.y + 1) + ') td:nth-child(' + (position.x + 1) + ') svg');
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
    pionDevientReine(pion) {
        let position = this.plateau.getPositionFromPion(pion);
        //Mise à jour graphique
        document.querySelector('.plateau tr:nth-child(' + (position.y + 1) + ') td:nth-child(' + (position.x + 1) + ') svg').classList.add('pion__reine');
        //Mise à jour du jeu
        this.plateau.pionDevientReine(pion);
    }
    /**
     * Changement de tour
     */
    tourSuivant() {
        this.tour++;
    }
}