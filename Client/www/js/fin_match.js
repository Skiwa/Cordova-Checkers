class fin_match {
    constructor(isAbandon, isVictoire) {
        this.divBackground = document.createElement("div"); //Element contenant la popup de fin de match 
        //Définit le style de l'élément racine de la popup
        this.divBackground.id = "popup-fond";
        //Génère et affiche la popup de fin de partie
        this.afficherPopupFinMatch(isAbandon, isVictoire);
    }
    //Génère et affiche la popup de fin de partie
    afficherPopupFinMatch(isAbandon, isVictoire) {
        this.divBackground.innerHTML = `
        <div class="popup-conteneur">
        <h1>Partie terminée </h1>
        <h3>` + this.messageFinal(isAbandon, isVictoire) + `</h3>
        <div class="btns-menu">
        <button type="button" class="btn-menu" id="btn-jouer">REJOUER</button>
        <button type="button" class="btn-menu" id="btn-scores">SCORES</button>
        </div>
        `;
        document.getElementById("main").appendChild(this.divBackground);
    }
    //Un message de fin customisé
    messageFinal(isAbandon, isVictoire) {
        if (isAbandon) {
            return "Vous avez gagné par abandon de votre adversaire ! :o <br> (ou déconnexion...)";
        }
        return isVictoire ? "Vous avez gagné! :)" : "Vous avez perdu... :'(";
    }
}
