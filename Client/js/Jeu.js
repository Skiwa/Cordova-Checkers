var Jeu = (function () {
    function Jeu() {
        this.taillePlateau = 10;
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
            //Récupère le pion actuel si il existe
            var pion = this.getPionFromPosition(position);
            //-Si il y a un pion à cet endroit
            if (pion !== 0) {
            }
            else {
            }
            console.log(pion.toString());
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
    return Jeu;
}());
