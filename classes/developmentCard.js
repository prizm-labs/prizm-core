
        DevelopmentCard = function( config ) {
            //config: id, entity, title, description, subClass, resolution

            //console.log(config);
            var card = new Card(config.id,config.entity,"development");

            var _action = null;
            var _decks = {};

            card.addSubclass(config.subClass);

            card.inventoryKey = config.subClass;
            card.title = config.title;
            card.description = config.description;

            card.resolution = config.resolution;

            card.play = function() {
                console.log('card.play');
                //TODO fancy revealing and effects...

                //reveal card to all
                this.entity.reveal();

                //move to center of board

                card.activate();

                //TODO handle interrupts, counters, etc.
            }

            card.setDeck = function( key, deck ){
                _decks[key] = deck;
            }
            card.getDeck = function(key){
                return _decks[key];
            }

            card.setActivation = function( action ) {
                _action = action;
            };

            card.activate = function(){
                console.log('card.activate');
                _action();
            };

            return card;
        };