var Jeu = (function () {
    function Jeu() {
        this.taillePlateau = 10;
        this.tour = 1;
        //Initialisation du plateau
        this.plateau = new Plateau(10);
        //Capture les clics utilisateur
        this.setClickEventListener();
        //Affiche le plateau dans la console
        console.log(this.plateau.toString());
    }
    Jeu.prototype.setClickEventListener = function () {
        var _this = this;
        document.querySelector('.plateau').addEventListener('click', function (event) {
            _this.onClickPlateau(event);
        });
    };
    /**
     * Gère le clic utilisateur sur le terrain
     * @param e Evènement du clic
     */
    Jeu.prototype.onClickPlateau = function (e) {
        //Récupère la position de la case cliquée
        var position = this.getPositionFromEvent(e);
        if (position) {
            //Récupère le pion cliqué si il existe
            var pion = this.getPionFromPosition(position);
            //-Si il y a un pion à cet endroit
            if (pion !== 0) {
                //- Si aucun pion n'est déjà selectionné ou si un pion de la couleur du joueur est déjà selectionné
                //- Et si le pion cible est de la couleur du joueur
                if ((!this.pionSelectionne || (this.pionSelectionne && ((this.pionSelectionne.couleur === 'blanc' && (this.tour % 2 === 0)) || this.pionSelectionne.couleur === 'noir' && (this.tour % 2 === 1)))) && ((pion.couleur === 'blanc' && (this.tour % 2 === 0)) || (pion.couleur === 'noir' && (this.tour % 2 === 1)))) {
                    this.selectPion(pion);
                }
            }
            else {
                //-Si un pion est selectionné et si la case est noire
                if (this.pionSelectionne && e.target.classList.contains('plateau--case__noire')) {
                    //Déplace le pion
                    this.deplacePionAtPosition(this.pionSelectionne, position);
                    //Tour suivant
                    this.tourSuivant();
                }
            }
        }
    };
    /**
     * Renvoie la position x et y de la case cliquée
     * @param e Evènement du clic
     */
    Jeu.prototype.getPositionFromEvent = function (e) {
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
    };
    /**
     * Récupère un pion à une position x et y
     * @param position
     */
    Jeu.prototype.getPionFromPosition = function (position) {
        return this.plateau.getPionFromPosition(position);
    };
    /**
     * Selectionne un pion
     * @param pion
     */
    Jeu.prototype.selectPion = function (pion) {
        //Enlève le style du dernier pion si il existe
        if (this.pionSelectionne) {
            var positionAncienPion = this.plateau.getPositionFromPion(this.pionSelectionne);
            document.querySelector('.plateau tr:nth-child(' + (positionAncienPion.y + 1) + ') td:nth-child(' + (positionAncienPion.x + 1) + ') svg').classList.remove('pion__select');
        }
        //Sauvegarde le pion selectionné
        this.pionSelectionne = pion;
        var positionPion = this.plateau.getPositionFromPion(pion);
        //Met à jour le style du pion
        document.querySelector('.plateau tr:nth-child(' + (positionPion.y + 1) + ') td:nth-child(' + (positionPion.x + 1) + ') svg').classList.add('pion__select');
    };
    /**
     * Deselectionne un pion
     * @param pion
     */
    Jeu.prototype.deselectPion = function (pion) {
        //Enlève le style du pion
        var positionPion = this.plateau.getPositionFromPion(pion);
        document.querySelector('.plateau tr:nth-child(' + (positionPion.y + 1) + ') td:nth-child(' + (positionPion.x + 1) + ') svg').classList.remove('pion__select');
        this.pionSelectionne = null;
    };
    /**
     * Déplace un pion
     * @param pion
     * @param position
     */
    Jeu.prototype.deplacePionAtPosition = function (pion, position) {
        var anciennePosition = this.plateau.getPositionFromPion(pion);
        //Déselectionne le pion actuel
        this.deselectPion(pion);
        //Clone le pion de son ancienne à sa nouvelle position
        var pionElement = document.querySelector('.plateau tr:nth-child(' + (anciennePosition.y + 1) + ') td:nth-child(' + (anciennePosition.x + 1) + ') svg');
        document.querySelector('.plateau tr:nth-child(' + (position.y + 1) + ') td:nth-child(' + (position.x + 1) + ')').appendChild(pionElement);
        //Déplace le pion dans le jeu
        this.plateau.deplacePionAtPosition(pion, position);
        //Teste si le pion devient une reine
        if ((position.y === 0 && this.tour % 2 === 1) || (position.y === this.taillePlateau - 1 && this.tour % 2 === 0)) {
            this.pionDevientReine(pion);
        }
        //log
        console.log(this.plateau.toString());
    };
    /**
     * Pion devient reine
     * @param pion
     */
    Jeu.prototype.pionDevientReine = function (pion) {
        var position = this.plateau.getPositionFromPion(pion);
        //Mise à jour graphique
        document.querySelector('.plateau tr:nth-child(' + (position.y + 1) + ') td:nth-child(' + (position.x + 1) + ') svg').classList.add('pion__reine');
        //Mise à jour du jeu
        this.plateau.pionDevientReine(pion);
    };
    /**
     * Changement de tour
     */
    Jeu.prototype.tourSuivant = function () {
        this.tour++;
    };
    return Jeu;
}());
