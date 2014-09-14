Robber = function (id, entity) {

    var piece = new Piece("robber", id, entity);

    var _terrain = null;

    piece.clear = function () {
        if (_terrain !== null) {
            _terrain.unblock();
            _terrain = null;
        }
    }

    piece.setTerrain = function (terrain) {
        var origin = terrain.getOrigin();

        piece.clear();

        //piece.entity.pos.x = origin.x;
        //piece.entity.pos.y = origin.y;

        _terrain = terrain;
        _terrain.block();

        //console.log(_terrain.isBlocked());
        //alert('blocking terrain');
    }


    return piece;
};