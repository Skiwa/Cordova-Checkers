var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
        //Trie les joueurs par nombre de victoires. Ordre décroissant.
        const resultTrie = result
            .map((_a) => {
                var { _id } = _a, items = __rest(_a, ["_id"]);
                return items;
            })
            .sort((b, a) => a.nbVictoire - b.nbVictoire);
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
        rankTitle.classList.add("leftCell");
        rankTitle.innerText = "Rang";
        let nameTitle = firstRow.insertCell(1);
        nameTitle.innerText = "Nom";
        let winTitle = firstRow.insertCell(2);
        winTitle.classList.add("rightCell");
        winTitle.innerText = "Victoires";
        //Remplissage des cases du tableau avec resultTrie 
        // !!!! Non testé avec liste très grande
        for (let i = 0; i < resultTrie.length; i++) {
            let row = scoreTab.insertRow(i + 1);
            let tdRank = row.insertCell(0);
            tdRank.classList.add("leftCell");
            tdRank.innerText = (i + 1).toString();
            let tdName = row.insertCell(1);
            tdName.innerText = resultTrie[i].name;
            let tdWins = row.insertCell(2);
            tdWins.classList.add("rightCell");
            tdWins.innerText = resultTrie[i].nbVictoire;
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
