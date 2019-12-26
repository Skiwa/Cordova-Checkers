# Projet de jeu de dame

Gau Nicolas - Grimard Bettina - Haegman Julien - Nicollet Martin

---

## Présentation

TODO

## Installation

TODO ?

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
