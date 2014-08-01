    Piece = function(type,id,entity){
      
        var _id = id;
        var _type = type;
        var _entity = entity;

        var _position = null;
        var _location = null; //PieceLocation
        var _owner = null;

        // TODO 
        // distinguish by owner

        return {
            type: _type,
            entity: _entity,
            inventoryKey: null,

            setPosiiton: function( position ){
                _position = position;
            },
            getPosition: function(){
                return _position;
            },
            
            setOwner: function(owner) {
                _owner = owner;
                _entity.setIdentifier(owner.getColor());
            },
            getOwner: function() {
                return _owner;
            },
//            setTerrain: function( terrain ) {
//                _terrain = terrain;
//            },
//            getTerrain: function() {
//                return _terrain;
//            },

            setLocation: function(location) {
                //console.log(location);
                _location = location;

                _entity.pos.x = _location.position.x;
                _entity.pos.y = _location.position.y;
            },
            getLocation: function() {
                return _location;
            },

            destroy: function() {
                var self = this;

                this.entity.kill();

                _owner.removePiece(this);
                _location.removePiece(this);

                var sharedTerrain = _location.getOwners();
                _.each(sharedTerrain,function(terrain){
                    terrain.removePiece(self);
                });
            }
        };
    }