class fin_match {
    divBackground = document.createElement("div");      //Elelement contenant la popup de fin de match 
    pseudo:String;                                      //Pseudo du joueur qui a fini de jouer

    constructor(pseudo, isVictoire) {
        //Récupère le pseudo du joueur
        this.pseudo = pseudo;
        
        //Définit le style de l'élément racine de la popup
        this.divBackground.id = "popup-fond";

        //Génère et affiche la popup de fin de partie
        this.afficherPopupFinMatch(isVictoire);
    }


    //Génère et affiche la popup de fin de partie
    afficherPopupFinMatch(isVictoire) {
        this.divBackground.innerHTML = `
        <div class="popup-conteneur">
        <h1>Partie terminée </h1>
        <h3>` + this.messageFinal(isVictoire) + `</h3>
        <div class="btns-menu">
        <button type="button" class="btn-menu" id="btn-jouer">REJOUER</button>
        <button type="button" class="btn-menu" id="btn-scores">SCORES</button>
        </div>
        `;
        document.getElementById("main").appendChild(this.divBackground);
    }

    //Un message de fin customisé
    messageFinal(isVictoire) {
        return isVictoire ? "Vous avez gagné! :)" : "Vous avez perdu... :'(";
    }
}