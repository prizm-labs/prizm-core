    Badge = function( id, entity, badgeType ) {
        
        var card = new Card(id,entity,"badge");

        card.inventoryKey = badgeType;
        card.addSubclass(badgeType);
        card.entity.setType(badgeType);

        //OVERRIDE Card methods
        card.reveal = function(){
            console.log('badge reveal');
        }

        return card;
    }