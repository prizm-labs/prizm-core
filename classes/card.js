Card = function(id,entity,mainClass){

        //type,id,entity
        var piece = new Piece("card",id,entity);

        piece.subclasses = [];
        piece.cardType = mainClass; //TODO remove attribute for class
        piece.class = mainClass;

        piece.addSubclass = function(subClass){
            //console.log(subClass);
            if (_.indexOf(subClass)==-1){
                piece.subclasses.push(subClass);
                //console.log(piece.subclasses);
            }
        }

        piece.removeSubclass = function(subClass){
            if (_.indexOf(subClass)==-1){
                piece.subclasses = _.without(piece.subclasses,subClass);
            }
        };

        piece.hasSubclass = function(subclass){
            //console.log(piece.subclasses);
            return (_.indexOf(piece.subclasses,subclass)!=-1);
        };

        piece.reveal = function(){
            //show front of card
            piece.entity.reveal();
        };

        piece.hide = function(){
            //show back of card
            piece.entity.hide();
        };

        return piece;
    }