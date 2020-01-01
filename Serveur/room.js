function addRoom(socket){
    for(var i=0; i<1000; i++){
        //Si la room n'a pas encore été créé
        if(socket.adapter.rooms['room'+i]==undefined){
            // On ajoute le joueur à la room i 
            socket.join("room"+i);
            break;
        }
        //Si la room existe  
        else{
            // On vérifie qu'elle ne contient pas déjà 2 joueurs (length<2) 
            if(socket.adapter.rooms['room'+i].length<2){
                socket.join("room"+i);
                break;
            }
            // Sinon on passe à la room suivante 
        }
    }
}

// <----------------- Exports ----------------->
exports.addRoom = addRoom;