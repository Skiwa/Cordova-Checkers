# Projet de jeu de dame

Gau Nicolas - Grimard Bettina - Haegman Julien - Nicollet Martin

---

## Présentation

TODO

## Installation

### Construire et déployer l'application

+ Installer Cordova, Gradle, Android SDK, Java JDK, ...

+ `git clone https://github.com/Skiwa/Cordova-Checkers.git`

+ `npm install` dans
    + Cordova-Checkers/Client
    + Cordova-Checkers/Client/www
    + Cordova-Checkers/Serveur


+ Dans Cordova-Checkers/Client/www/index.html:
    + Ligne 31: Remplacer l'adresse IP présente par celle de l'appareil qui hébergera le serveur Node


+ Dans Cordova-Checkers/Client:
    + `cordova platform add android` 
    + (`cordova requirements` pour vérifier si tout est ok)
    + `cordova build android`

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







## Architecture

### Côté Client

Le code du jeu pour le client est écrit en TypeScript (dosser `ts`) et compilé directement en JavaScript (dosser `js`).

Concernant le jeu en lui même, le code est séparé en 3 classes :

1.  #### Classe Jeu
    
    Gère la partie graphique, le fonctionnement du jeu et appelle des fonctions sur la classe `Plateau`, qui concernent les mouvement des pions.
    
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
    
    Si besoin, la classe plateau peut récupérer des informations de l'instance du jeu ( ex: couleur du joueur, tour actuel)
    
    Fonctionnalités :
    
    -   Création et gestion d'un plateau ( tableau 2D)
        
    -   Placement des pions pour le début de la partie
        
    -   Accesseurs pour les pions ( Récup position d'un pion ou pion en fonction de sa position )
        
    -   Génère les déplacements où un pion ou une dame peut aller + pions pouvant être capturés à la suite de ce mouvement
        
3.  #### Classe Pion
    
    Gère un pion. Chaque pion est symbolisable par un caractère (`n` ou `b`) en fonction de sa couleur. Si c'est une reine, le caractère est une majuscule.
    

#### Gestion des appels avec le serveur

TODO

#### Côté Serveur

TODO

## Gestion du travail

TODO
