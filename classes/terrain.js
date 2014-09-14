Terrain = function (id, type, entity) {

    var _id = id;
    var _type = type;
    var _entity = entity;

    var _locations = [];
    var _pieces = [];
    var _origin = null;
    var _numberToken = null;
    var _dieValue = null;

    var _blocked = false;

    return {
        id: _id,
        type: _type,
        entity: _entity,

        setOrigin: function (x, y, index) {
            _origin = {x: x, y: y, index: index};
        },
        getOrigin: function () {
            return _origin;
        },

        getDieValue: function () {
            return _dieValue;
        },

        placeNumberToken: function (numberToken) {
            _dieValue = numberToken.dieValue;
            _numberToken = numberToken;
            // place token at terrain origin
            numberToken.pos.x = _origin.x;
            numberToken.pos.y = _origin.y;
            // TODO animate terrain with predetermined type to origin
        },

        addLocation: function (location) {
            //if location is unique
            //if locations.length<12
            var position = _locations.length;
            var angle;

            switch (position) {
                //edges are 1,3,5,7,9,11
                //vertices are 0,2,4,6,8,10
                case 1:
                case 7:
                    angle = Math.PI * 2 / 3;
                    break;
                case 3:
                case 9:
                    angle = 0;
                    break;
                case 5:
                case 11:
                    angle = Math.PI * 1 / 3;
                    break;

                default:
                    angle = 0;
            }

            location.setIndex(position);
            location.setOrientation(angle);

            _locations.push(location);

        },
        getEdge: function (position) {
            //0-11
            //even # vertices
            //odd # edges
            return _locations[1 + position * 2];
        },
        getVertex: function (position) {
            return _locations[position * 2];
        },
        getLocations: function () {
            return _locations;
        },

        addPiece: function (piece) {
            _pieces.push(piece);
        },
        removePiece: function (piece) {
            console.log("removing piece");
            console.log(_pieces.length);
            _pieces = _.without(_pieces, piece);
            console.log(_pieces.length);
        },
        getPieces: function () {
            return _pieces;
        },

        hideLocations: function () {
            _.each(_locations, function (location) {
                //location.entity.zIndex=-1;
                //console.log(location.entity);
                location.hide();
            });
            //ig.game.sortEntitiesDeferred();
        },
        showLocations: function (locations) {
            _.each(locations, function (locationIndex) {
                _locations[locationIndex].show();
            });
        },

        block: function () {
            console.log(this);

            _blocked = true;
        },
        unblock: function () {
            _blocked = false;
        },
        isBlocked: function () {
            if (this.type == "desert") {
                return true;
            } else {
                return _blocked;
            }
        },

        getEdge: function (position) {
            return _locations[1 + position * 2];
        },

//                placePiece: function( piece, position ) {
//
//                    var location;
//
//                    switch( piece.type ) {
//
//                        case "road":
//                            location = _locations[1+position*2];
//                            var angle;
//                            switch (position) {
//                                case 0:
//                                case 3:
//                                    angle = Math.PI*2/3;
//                                    break;
//                                case 1:
//                                case 4:
//                                    angle = 0;
//                                    break;
//                                case 2:
//                                case 5:
//                                    angle = Math.PI*1/3;
//                                    break;
//                            }
//
//                            piece.entity.rotateToAngle(angle);
//                            break;
//
//                        case "settlement":
//                        case "city":
//                            location = _locations[position*2];
//                            break;
//                    }
//
//
//                    location.addPiece(piece);
//                    piece.setLocation(location);
//
//                    // add piece ownership to all terrain sharing that location
//                    // every vertex should have 3 owners
//                    // every edge should have 2 owners
//
//                    //console.log("location owners:");
//                    //console.log(location.getOwners());
//
//                    var sharedTerrain = location.getOwners();
//
//                    _.each(sharedTerrain,function(terrain){
//                        terrain.addPiece(piece);
//                    });
//                },

        generateResources: function () {
            var self = this;
            var payouts = [];

            var pieces = this.getPieces();
            //console.log(pieces);

            var resourceTotal = 0;
            var resourceType = null;


            // determine quantity & recipients from buildings on terrain
            _.each(pieces, function (piece) {
                //console.log(piece.type);

                var resourceCount;

                if (piece.type == "road") {
                    resourceCount = 0;
                } else if (piece.type == "settlement") {
                    resourceCount = 1;
                } else if (piece.type == "city") {
                    resourceCount = 2;
                }

                resourceTotal += resourceCount;

                if (resourceCount > 0) {
                    payouts.push({player: piece.getOwner(), count: resourceCount, type: cardConversions[self.type], origin: self.getOrigin()});
                }
            });

            console.log("total resources generated:");
            console.log(resourceTotal);
            console.log("resource recipients:");
            console.log(payouts);

            return payouts;
        },

        placeRobber: function (robber) {

            robber.setTerrain(this);

        }

    };
};