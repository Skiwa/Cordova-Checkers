class Login {
    //Crée un nouveau formulaire de connexion
    constructor() {
        console.log("Affichage du formulaire de connexion");
        //Affiche le formulaire de connexion
        this.afficherForm();
    }
    //Crée un formulaire et l'ajoute au DOM
    afficherForm() {
        let divForm = document.createElement("div");
        divForm.className = "form-conteneur";
        divForm.id = "form-conteneur";
        divForm.innerHTML = `
        <form class="form-popup" id="form-popup">
        <h1>Se connecter</h1>
        <label for="pseudo">Pseudo</label>
        <input type="text" placeholder="Votre pseudo" name="pseudo" required>
        <label for="password">Password</label>
        <input type="text" placeholder="Votre password" name="password" >
        <button type"submit" id="submitBtn">Ok</button>

        </form>
      `;
        document.getElementById("main").innerHTML = "";
        document.getElementById("main").appendChild(divForm);
    }
    ;
}
