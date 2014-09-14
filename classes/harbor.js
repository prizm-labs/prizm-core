Harbor = function (id, entity, resourceType) {

    var piece = new Piece("port", id, entity);

    piece.class = resourceType;
    piece.locations = [];

    piece.entity.setResourceType(resourceType);

    piece.setEdge = function (location) {
        console.log(piece.entity);
        console.log(location.position.x);
        console.log(location.position.y);
        piece.entity.pos.x = location.position.x;
        piece.entity.pos.y = location.position.y;

        //rotate port entity to line up with edge
        piece.entity.alignToEdge(location.getIndex());

        piece.locations = location.getNeighbors();
        _.each(piece.locations, function (location) {
            //location.show();
            location.addLink('harbor', piece);
        });
    }

    return piece;
};