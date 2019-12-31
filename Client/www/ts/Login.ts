class Login {
  divForm = document.createElement("div");

  //Crée un nouveau formulaire de connexion
  constructor() {
    this.divForm.id = "popup-fond";     

    //Affiche le formulaire de connexion
    this.afficherForm();
  }

  //Crée un formulaire et l'ajoute au DOM
  afficherForm() {
    this.divForm.innerHTML = `
        <div class="popup-conteneur" >
        <form id="theForm">
        <h1>Se connecter</h1>
        <label for="pseudo">Pseudo</label>
        <input type="text" placeholder="Votre pseudo" name="pseudo" required>
        <label for="password">Password</label>
        <input type="password" placeholder="Votre password" name="password" required>
        <button type"submit" id="submitBtn">Ok</button>
        </form>
        </div>
      `;

    document.getElementById("main").innerHTML = "";
    document.getElementById("main").appendChild(this.divForm);
  }

  //Crée et affiche l'écran d'attente
  attenteScreen() {
    document.getElementById("main").innerHTML = `
    <div class="popup-fond">
      <div class="popup-conteneur">
      <h1>En attente d'un adversaire</h1>
      <img src="images/Loading100px.svg">
      </div>
      </div>
      `;
  }
}
