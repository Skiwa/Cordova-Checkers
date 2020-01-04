class leaderboard {
    constructor(result) {
        this.divBackground = document.createElement("div"); //Element contenant la popup de tableau des scores
        this.onInit(result);
    }
    //Gère l'instanciation du leaderboard
    onInit(result) {
        //Définit le style de l'élément racine de la popup
        this.divBackground.id = "popup-fond";
        //Génère et affiche le tableau des scores dans le DOM de la page
        this.afficherLeaderboard(result);
    }
    //Génère et affiche le tableau des scores dans le DOM
    afficherLeaderboard(result) {
        let divConteneur;
        let closeBtn;
        //Trie les joueurs par nombre de victoires pondéré par taux de victoire. Ordre décroissant.
        const resultTrie = result.sort(function (b, a) {
            //Contrôle la division par 0
            if (b.nbPartie == 0) {
                return 1;
            }
            if (a.nbPartie == 0) {
                return -1;
            }
            return a.nbVictoire * (a.nbVictoire / a.nbPartie) - b.nbVictoire * (b.nbVictoire / b.nbPartie);
        });
        //Le div englobant le tableau
        divConteneur = document.createElement("div");
        divConteneur.classList.add("popup-conteneur");
        this.divBackground.appendChild(divConteneur);
        //Le titre de la fenêtre 
        let titleScores = document.createElement("h1");
        titleScores.innerText = "Tableau des scores";
        divConteneur.appendChild(titleScores);
        //Le bouton de fermeture de la fenêtre
        closeBtn = document.createElement("button");
        closeBtn.classList.add("close-btn");
        closeBtn.id = "close-leaderboard-btn";
        closeBtn.type = "button";
        divConteneur.appendChild(closeBtn);
        //Le tableau des scores
        let scoreTab = document.createElement("table");
        scoreTab.id = "score-tab";
        divConteneur.appendChild(scoreTab);
        //La 1ère ligne du tableau contenant les titres des colonnes
        let firstRow = scoreTab.insertRow(0);
        let rankTitle = firstRow.insertCell(0);
        rankTitle.classList.add("littleCell");
        rankTitle.innerText = "Rang";
        let nameTitle = firstRow.insertCell(1);
        nameTitle.classList.add("bigCell");
        nameTitle.innerText = "Nom";
        let winTitle = firstRow.insertCell(2);
        winTitle.classList.add("littleCell");
        winTitle.innerText = "Victoires";
        let partiesTitle = firstRow.insertCell(3);
        partiesTitle.classList.add("littleCell");
        partiesTitle.innerText = "Taux";
        //Remplissage des cases du tableau avec resultTrie
        for (let i = 0; i < resultTrie.length && i < 15; i++) {
            let row = scoreTab.insertRow(i + 1);
            let tdRank = row.insertCell(0);
            tdRank.classList.add("littleCell");
            tdRank.innerText = (i + 1).toString();
            let tdName = row.insertCell(1);
            tdName.classList.add("bigCell");
            tdName.innerText = resultTrie[i].name;
            let tdWins = row.insertCell(2);
            tdWins.classList.add("littleCell");
            tdWins.innerText = resultTrie[i].nbVictoire;
            let tdParties = row.insertCell(3);
            tdParties.classList.add("littleCell");
            tdParties.innerHTML = resultTrie[i].nbPartie != 0 ? Math.round((resultTrie[i].nbVictoire / resultTrie[i].nbPartie) * 100) + "%" : "0%";
        }
        //Ajout de la fenêtre au DOM de la apge
        document.getElementById("main").appendChild(this.divBackground);
        let self = this;
        //Event de fermeture du tableau des scores
        document.getElementById("close-leaderboard-btn").onclick = function () {
            let main = document.getElementById("main");
            main.removeChild(self.divBackground);
        };
    }
}
