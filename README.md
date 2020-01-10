# Projet de jeu de dame

Gau Nicolas - Grimard Bettina - Haegman Julien - Nicollet Martin

---

## Présentation

  Le projet consiste à réaliser une application Web Mobile couplée à un serveur Web permettant de jouer au jeu de Dames. Un joueur pourra se connecter sans être préalablement inscrit, être mis en attente jusqu’à ce qu’un autre joueur se présente pour jouer et afficher les meilleurs joueurs de l’application. Le jeu devra permettre à deux utilisateurs de s’affronter depuis plusieurs plateformes, de déterminer qui est le vainqueur et de stocker toutes ces informations dans une base de données afin d’être récupérable après le redémarrage de l’application.  

## Installation

### Construire et déployer l'application

+ Installer NodeJS, Cordova, Gradle, Android SDK, Java JDK, et MongoDB

+ `git clone https://github.com/Skiwa/Cordova-Checkers.git`

+ cd Cordova-Checkers

+ `npm install` dans
    + Cordova-Checkers/Client
    + Cordova-Checkers/Serveur

+ Dans Cordova-Checkers/Client/www/index.html:
    + Ligne 22: Remplacer l'adresse IP présente par celle de l'appareil qui hébergera le serveur Node
    
+ Dans Cordova-Checkers/Client:
    + `cordova platform add android` 
    + (`cordova requirements` pour vérifier si tout est ok)
    + `cordova build android`

+ N’importe où (dans l’environnement miniconda si mongoDB a été installé via conda) :
    + mongo
    
+ En cas d’erreur de la commande précédente:
    + mongod --dbapth PathVersEnvMongo
    
+ Dans Cordova-Checkers/Serveur:
    + `node app.js`
    







### Accéder à l'application
#### Via navigateur

+ Accéder à (http://localhost:3000/)


#### Via mobile
##### Installer l'app

+ Brancher le mobile par USB

+ Dans Cordova-Checkers/Client:
    + `cordova run android`


##### Utiliser l'app

+ Connecter les mobiles souhaités au même réseau wi-fi que l'appareil hébergeant le serveur.
    + Il semble plus fiable d'utiliser un mobile comme hotspot wi-fi et de connecter l'ordinateur-serveur à ce réseau plutôt que de connecter les 2 appareil à un réseau wi-fi privé.

+ Il n'est ensuite plus nécessaire de brancher le portable pour utiliser l'app tant que le portable est connecté au même wi-fi que le serveur. 

+ Si l'appareil hébergeant le serveur change, il est nécessaire de :
    1. corriger l'adresse IP dans 'Cordova-Checkers/Client/www/index.html' avec celle du nouvel appareil
    2. build à nouveau l'application avec `cordova build android`
    3. la réinstaller avec `cordova run android` sur un mobile branché par USB.

#### Via emulateur

+ Installer un emulateur

+ Dans Cordova-Checkers/Client:
    + `cordova emulate android`


### Ouvrir l'app dans Android-studio

+ Dans Android-studio:
    + File -> New -> Import Project
    + Naviguer à 'Cordova-Checkers/Client/platform'
    + Selectionner le dossier "Android" et presser OK
    
    
### Modifier l'app

+ Ajouter les modifications souhaitées dans Cordova-Checkers/Client/www
+ Dans 'Cordova-Checkers/Client' :
    + `cordova build android`
+ Réinstaller l'app sur les mobiles

### Remarque

Le pare-feu peut bloquer les connexions.



## Architecture

### Côté Client

Le code du jeu pour le client est écrit en TypeScript (dosser `ts`) et compilé directement en JavaScript (dosser `js`).

Concernant le jeu en lui même, le code est séparé en 3 classes :

1.  #### Classe Jeu

    Elle gère la partie graphique, le fonctionnement du jeu et appelle des fonctions sur la classe `Plateau`, qui concernent les mouvement des pions.
    
    Fonctionnalités :
    
    -   Gestion des tours des joueurs
        
    -   Gestion d'un mode solo (utile pour le développement)
        
    -   Création graphique du plateau
        
    -   Gestion des évènements de clic et détermination des endroits cliqués (pion / case vide)
        
    -   Selection d'un pion
        
    -   Affichage des cases où un pion peut aller
        
    -   Affichage des pions qu'un pion peut capturer
        
    -   Suppression graphique d'un pion quand il a été capturé
        
    -   Conversion graphique d'un pion en dame
        
    -   Envoi des mouvements du joueur sous la forme d'évènement
        
    -   Fonction de gestion d'un mouvement ennemi
        

2.  #### Classe Plateau
    
    Gère la partie fonctionnelle sur un tableau d'instances de `Pion`. S'occupe des mouvements des pions, reines, des vérifications si un mouvement est valide et des mouvements de capture.
    
    Si besoin, la classe plateau peut récupérer des informations de l'instance du jeu (ex: couleur du joueur, tour actuel)
    
    Fonctionnalités :
    
    -   Création et gestion d'un plateau (tableau 2D)
        
    -   Placement des pions pour le début de la partie
        
    -   Accesseurs pour les pions (Récup position d'un pion ou pion en fonction de sa position)
        
    -   Génère les déplacements où un pion ou une dame peut aller + pions pouvant être capturés à la suite de ce mouvement
        
3.  #### Classe Pion
    
     Gère un pion. Chaque pion est symbolisable par un caractère (`n` ou `b`) en fonction de sa couleur. Si c'est une dame, le caractère est une majuscule.


La communication avec le serveur ainsi que l’affichage de la page est géré par le fichier “index.html” qui fait appel au reste des fichiers de la partie Client qui servent à gérer les autres fonctionnalités telles que la connexion, la fin de jeu (avec la possibilité de relancer une partie), le leaderboard,...
    Le “routing” de l’application consiste uniquement à remplacer des éléments du DOM pour éviter tout rechargement de la page qui pourrait poser problème sur mobile.

    

#### Gestion des appels avec le serveur

Pour la communication entre le serveur et le client, nous avons utilisé la bibliothèque socket.io pour exploiter les websockets. 
    Nous utilisons différentes communications comme :
    
   - login : Cet appel serveur enverra depuis le client, des informations utilisateurs ainsi que son état. Le serveur fera son travail et mettra le joueur en liste d’attente (si aucune erreur n’est retournée)
    
   - ready/notReady: Permettant la mise en attente du joueur ou le lancement de la partie.
    
   - deplacement-joueur-envoi: Permettant de récupérer le déplacement d’un joueur pour pouvoir le retranscrire à son adversaire (qui est géré niveau client)
    
   - finPartie: Un état de fin de partie et ses interactions liées.
    
   - score: Récupérant les informations utilisateurs de notre base de données
    
   - disconnect: Qui gère la déconnexion d’un client (durant une partie ou non)

#### Côté Serveur

Le code est réparti en plusieurs répertoires et fichiers:

1.  #### Management 

Répertoire contenant les fonctions qui concernent la gestion des différents éléments essentiels de l’application.

   #### address_management = gestion des adresses du serveur
    
  Fonctionnalité :
    
   -   Récupération des adresses du serveur pour savoir à laquelle se connecter

   #### game_management = gestion des parties de dames

   Fonctionnalités :
   
   -  Choix des couleurs du jeu aléatoire
   -  Inversion des déplacements à chaque nouveau coup pour que l’affichage soit différent entre les joueurs d’une même partie (pions de la couleur du joueur en bas de l’écran)
   -  Création d’une nouvelle partie dans la base de données avec les deux joueurs
   -  Mise à jour du gagnant dans la base de données 
   -  Ajout de la nouvelle partie à une liste de partie qui permet de gérer les déconnexions durant une partie
   -  Retrouve la partie dans laquelle se trouve le joueur qui s’est déconnecté s’il était en train de jouer

   #### user_management = gestion des utilisateurs de l’application
    
   Fonctionnalités :
   
   -  Authentification et ajout de l’utilisateur dans la base de données (gestion des erreurs, par exemple si le mot de passe n’est pas le bon)  
   -  Ajout de l’utilisateur dans la liste d’attente (liste contenant tous les joueurs connectés qui attendent un autre joueur disponible pour jouer une partie)
   -  Suppression de l’utilisateur de la liste d’attente (notamment en cas de déconnexion)
   -  Incrémentation du nombre de victoires du gagnant 
   -  Récupération du nombre de victoires de l’utilisateur
   -  Récupération de la liste de tous les utilisateurs avec leur nombre de victoires et leur nombre de parties 
     
2.  #### Models 

Répertoire contenant les collections de la base de données “dame-db”.

   #### partie = définition de la collection “Partie” et exportation

   Fonctionnalités :
   
   -  Schéma json pour savoir ce qui est autorisé dans la base de données 
   -  Création d’un modèle qui respecte ce schéma et permettra l’ajout des parties dans la base de données 
     Remarque:
On utilise le nom des joueurs (unique) comme “identifiants” de la partie.

   #### user = définition de la collection “Utilisateur” et exportation
    
 Fonctionnalités :
   
   -  Schéma json pour savoir ce qui est autorisé dans la base de données 
   -  Création d’un modèle qui respecte ce schéma et permettra l’ajout des utilisateurs dans la base de données
     Remarques: 
- Pour la sauvegarde du mot de passe, on crypte et on utilise un sel avec la librairie bcryptjs.
- On utilise le nom comme identifiant unique pour chaque utilisateur.

3. #### Service 

Répertoire contenant les fonctions qui communiquent avec la base de données (requêtes, insertions, ...)

   #### game.service = interactions avec la collection “Partie”
    
 Fonctionnalités :
   
   -  Création et sauvegarde de la nouvelle Partie 
   -  Mise à jour du gagnant de la partie 

   #### user.service = interactions avec la collection “Utilisateur”
     
 Fonctionnalités :
   
   -  Création et sauvegarde d’un nouvel Utilisateur 
   -  Authentification de l’utilisateur avec vérification du mot de passe 
   -  Récupération du nombre de victoires d’un utilisateur 
   -  Récupération de tous les utilisateurs de la collection 
   -  Mise à jour du nombre de victoires de l’utilisateur
    
4. #### Serveur

   #### app = gestion de la communication avec le client 
     
 Fonctionnalités :
   
   -  Importation des dépendances
   -  Lancement du serveur
   -  Réception/Envoi de ce que le client émet et traitement 
    
   #### bdd_connexion = connexion à la base de données “dame-db” avec mongoose
     
 Fonctionnalités :
   
   -  Création de la base de données 
   -  Connexion à celle-ci

   #### room = gestion des rooms 
     
 Fonctionnalités :
   
   -  Création de room s’il n’y en a pas de disponible 
   -  Ajout de l’utilisateur dans une room 
   -  Fermeture de la room si le nombre de joueurs à l’intérieur est de 2 

## Gestion du travail

### Côté Client 

La partie client de l’application a été réalisée par Julien et Martin. Julien a dans un premier temps réalisé l’intégralité du jeu de dame (interface graphique + logique du jeu), ainsi que les communications serveurs nécessaires à une partie en multijoueur. 

Ensuite Martin a pris la relève et s’est occupé du partage de l'application sous Cordova et du reste du front, à savoir les pages de connexion, d’attente d’un autre joueur, de fin de partie ou du leaderboard.

### Côté Serveur

La partie Back/Serveur a été réalisée par Bettina et Nicolas. Le partage des tâches s’est fait assez instinctivement et équitablement. 
Dans un premier temps avec un travail en commun pour comprendre les rouages de cette partie de l’application. Ensuite après une meilleure compréhension de ce qui été attendu, nous avons développé certaines tâches/sous-tâches indépendamment.

Bettina s’est penchée sur l’aspect Partie dans sa globalité avec le model ou encore les fonctions liées et les interactions avec les utilisateurs. De plus, elle a aussi travaillé sur des bugs mineurs qui n’étaient pas pensés pendant le développement, comme l’incrémentation double en cas de refresh de page, etc.

Nicolas s’est penché sur l’aspect Utilisateur en améliorant une première version de l’authentification et ensuite en utilisant un minimum de sécurité pour l’utilisateur. Il s’est assuré aussi de récupérer les informations des utilisateurs demandées par la partie Client pour leurs affichages.


## Améliorations possibles

Il existe certaines fonctionnalités que nous n’avons pas eu le temps de terminer voir de commencer et qui mériteraient donc d’être achevées/implémentées: 

   + Le comportement des dames au cours d’une partie qui ne permettent pas le mangeage en chaîne actuellement.
    
   + Le leaderboard dont nous (Martin) n’avons pas réussi à fixer le layout, ce qui provoque des cases de taille variable pas vraiment esthétiques. L’astuce temporaire pour réduire cet effet a été de limiter la longueur des pseudos des utilisateurs.
   
   + Le mode solo qui actuellement doit être activé en modifiant le code pourrait être activable par les joueurs. Il serait également intéressant d’implémenter la possibilité de jouer contre un bot, actuellement le client joue les 2 joueurs.
   
   + Un système de gestion des événements et fonctionnalités mobiles (orientation portrait/landscape, zoom, thème nocturne)
   
   + Héberger le serveur en ligne (Heroku / Cloud)
   
   + Un système de classement plus élaboré de type “classement elo” avec gains et pertes de points proportionnel à la différence de points entre le joueur et l’adversaire.
   
   + La gestion des sessions pour éviter à l’utilisateur d’avoir à se reconnecter après un rafraîchissement de la page.  
