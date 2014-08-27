    ResourceCard = function( id, entity, resourceType ) {
        
        var card = new Card(id,entity,"resource");

        card.resourceType = resourceType;
        card.inventoryKey = resourceType;
        card.addSubclass(resourceType);

        //card.entity.setType(resourceType);

        return card;
    };