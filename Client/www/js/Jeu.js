class Jeu {
    /**
     * Crée un nouveau jeu
     * @param modeSolo
     * @param couleurJoueur Défini de manière random par defaut. Peut être renseignée
     */
    constructor(modeSolo, couleurJoueur = Math.random() >= 0.5 ? "noir" : "blanc") {
        this.taillePlateau = 10; //Taille fixée à 10
        this.tour = 1; //Tour%2=1 -> Noirs sinon Blancs
        this.pionsMangeables = []; //Pions mangeables pour un pion selectionné
        this.couleurJoueurEnCours = "noir"; //Couleur du joueur en cours, change à chaque tour
        this.eventTarget = new EventTarget(); //EventTarget qui envoie des évènements de type "Joueur a joué"
        this.isOver = false; //Définit si la partie est terminée
        //Fixe la couleur du joueur
        this.couleurJoueur = couleurJoueur;
        //Fixe le mode de jeu
        this.modeSolo = modeSolo;
        if (!this.modeSolo) {
            console.log("Vous jouez les " + couleurJoueur);
        }
        //Initialisation du plateau
        this.plateau = new Plateau(this);
        //Création graphique du plateau
        this.creerPlateauGraphiquement();
        //Capture les clics utilisateur
        this.setClickEventListener();
        console.log("Les noirs commencent");
    }
    /**
     * Ajoute un listener pour chaque clic sur le plateau
     */
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
        //Regarde si c'est bien le tour du joueur actuel
        if (this.peutJouer()) {
            //Regarde si on a bien cliqué sur une case
            if (position) {
                //Récupère le pion cliqué si il existe
                let pion = this.getPionFromPosition(position);
                //- Si il y a un pion à cet endroit
                if (pion !== 0) {
                    //- Si c'est un pion de la couleur du joueur en cours
                    if (pion.couleur === this.couleurJoueurEnCours) {
                        //Selectionne le pion
                        this.selectPion(pion);
                        //Affiche les déplacements possibles pour ce pion
                        this.afficheDeplacementsPossiblesFromPion(pion);
                    }
                }
                else {
                    //- Si un pion est selectionné et si le pion peut aller à cet endroit
                    if (this.pionSelectionne && e.target.classList.contains('plateau--case__possible')) {
                        //Récupère la position du pion selectionné
                        let anciennePosition = this.plateau.getPositionFromPion(this.pionSelectionne);
                        //Teste si on mange un pion
                        this.mangePion(this.pionSelectionne, position);
                        //Déplace le pion
                        this.deplacePionAtPosition(this.pionSelectionne, position);
                        //Le jeu envoie un event de type "Le joueur a joué".
                        //Il passe un objet contenant l'ancienne et la nouvelle position
                        let event = new CustomEvent("jeu--deplacement", { detail: { anciennePosition: { x: anciennePosition.x, y: anciennePosition.y }, nouvellePosition: { x: position.x, y: position.y } } });
                        this.eventTarget.dispatchEvent(event);
                        //Tour suivant
                        this.tourSuivant();
                    }
                }
            }
        }
    }
    /**
     * Renvoie la position x et y de la case cliquée
     * @param e Evènement du clic
     */
    getPositionFromEvent(e) {
        //- Si la cible est une balise <circle>, remonte chercher la case dans les parents
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
        if (this.couleurJoueur === this.couleurJoueurEnCours) {
            if (position.y === 0) {
                this.pionDevientReine(pion);
            }
        }
        else {
            if (position.y === this.taillePlateau - 1) {
                this.pionDevientReine(pion);
            }
        }
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
    mangePion(pion, positionPionMange) {
        let pionMange; //pionMangé*
        let i, j;
        let positionPionMangeur = this.plateau.getPositionFromPion(pion);
        //Vérifie si le pion mangé existe
        i = positionPionMangeur.x > positionPionMange.x ? 1 : -1;
        j = positionPionMangeur.y > positionPionMange.y ? 1 : -1;
        if (this.pionsMangeables.includes(this.plateau.getPionFromPosition({ x: positionPionMange.x + i, y: positionPionMange.y + j }))) {
            pionMange = this.plateau.getPionFromPosition({ x: positionPionMange.x + i, y: positionPionMange.y + j });
        }
        //Si il existe, supprime le pion
        if (pionMange) {
            let position = this.plateau.getPositionFromPion(pionMange);
            //Retire le pion graphiquement
            let pionElement = document.querySelector('.plateau tr:nth-child(' + (position.y + 1) + ') td:nth-child(' + (position.x + 1) + ') svg');
            pionElement.parentNode.removeChild(pionElement);
            //Retire le pion dans le jeu
            this.plateau.retirePion(pionMange);
            //Verifie s'il s'agissait du dernier pion du joueur
            this.isOver = this.plateau.isFinPartie();
        }
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
        this.couleurJoueurEnCours = this.couleurJoueurEnCours === "blanc" ? "noir" : "blanc";
        console.log("Tour du joueur", this.couleurJoueurEnCours);
    }
    /**
     * Génére les éléments du plateau et ajoute le tout à la page principale
     */
    creerPlateauGraphiquement() {
        let ligne;
        let carre;
        let pionSvg, pionCercle;
        let plateau = document.createElement("table");
        plateau.classList.add("plateau");
        let plateau_body = document.createElement("tbody");
        for (let i = 0; i < this.taillePlateau; i++) {
            ligne = document.createElement("tr");
            for (let j = 0; j < this.taillePlateau; j++) {
                //Crée les cases
                carre = document.createElement("td");
                carre.classList.add("plateau--case");
                carre.classList.add((i + j) % 2 == 0 ? "plateau--case__noire" : "plateau--case__blanche");
                //Crée les pions
                if ((i < 2 || i > 7) && ((i + j) % 2 === 0)) {
                    //Conteneur svg
                    pionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    pionSvg.classList.add("pion");
                    //Fixe les pions du joueur en bas
                    if (i < 2) {
                        pionSvg.classList.add((this.couleurJoueur === "blanc" ? "pion__noir" : "pion__blanc"));
                    }
                    else {
                        pionSvg.classList.add((this.couleurJoueur === "blanc" ? "pion__blanc" : "pion__noir"));
                    }
                    pionSvg.setAttribute("viewBox", "0 0 100 88");
                    pionSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    //Cercle svg
                    pionCercle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    pionCercle.setAttribute("cx", "50");
                    pionCercle.setAttribute("cy", "50");
                    pionCercle.setAttribute("r", "35");
                    pionSvg.appendChild(pionCercle);
                    carre.appendChild(pionSvg);
                }
                ligne.appendChild(carre);
            }
            plateau_body.appendChild(ligne);
        }
        plateau.appendChild(plateau_body);
        document.getElementById("main").innerHTML = "";
        document.getElementById("main").appendChild(plateau);
    }
    /**
     * Mouvement d'un ennemi.
     * Appelé lorsque le serveur envoie le mouvement de l'adversaire
     * @param anciennePosition
     * @param nouvellePosition
     */
    ennemiJoue(anciennePosition, nouvellePosition) {
        //Récupère le pion qui va se déplacer
        let pion = this.getPionFromPosition(anciennePosition);
        //Selectionne le pion
        this.selectPion(pion);
        //Affiche les déplacements possibles du pion
        this.afficheDeplacementsPossiblesFromPion(pion);
        //Teste si il peut manger un autre pion
        this.mangePion(this.pionSelectionne, nouvellePosition);
        //Déplace le pion
        this.deplacePionAtPosition(this.pionSelectionne, nouvellePosition);
        //Tour suivant
        this.tourSuivant();
    }
    /**
     * Vérifie si le joueur actuel peut jouer.
     */
    peutJouer() {
        if (this.modeSolo) {
            return (this.couleurJoueurEnCours === 'blanc' && (this.tour % 2 === 0) || this.couleurJoueurEnCours === 'noir' && (this.tour % 2 === 1));
        }
        else {
            return ((this.couleurJoueur === this.couleurJoueurEnCours) && (this.couleurJoueurEnCours === 'blanc' && (this.tour % 2 === 0) || this.couleurJoueurEnCours === 'noir' && (this.tour % 2 === 1)));
        }
    }
}
