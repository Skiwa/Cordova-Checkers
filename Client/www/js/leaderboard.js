class leaderboard {
    constructor() {
        this.divBackground = document.createElement("div"); //Element contenant la popup de tableau des scores
        this.onInit();
    }
    //Gère l'instanciation du leaderboard
    onInit() {
        //Définit le style de l'élément racine de la popup
        this.divBackground.id = "popup-fond";
        //Génère et affiche le tableau des scores dans le DOM de la page
        this.afficherLeaderboard();
    }
    //Génère et affiche le tableau des scores dans le DOM
    afficherLeaderboard() {
        this.divBackground.innerHTML = `
        <div class="popup-conteneur">
        <h1>tableau des scores</h1>
        <button type="button" class="close-btn" id="close-leaderboard-btn"></button>
        </div>
        `;
        document.getElementById("main").appendChild(this.divBackground);
        document.getElementById("close-leaderboard-btn").onclick = function () {
            let main = document.getElementById("main");
            main.removeChild(main.lastChild);
        };
    }
}
