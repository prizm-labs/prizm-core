var pieceId = 0;

Player = function (id) {

    var _id = id;
    var _color = null;
    var _name = null;
    var _cards = {
        hand: [],
        field: [],
        badges: []
    };
    var _pieces = [];
    var _locations = {
        hand: [],
        field: [],
        badges: []
    };
    var _inventory = {};
    var _badges = {};
    var _entities = {};

    // rotate all assets along periphery of board
    var _orientation = 0;
    var _limits = {};

    var _trades = {
        wheat: 4,
        brick: 4,
        wood: 4,
        sheep: 4,
        ore: 4,
        any: 4
    }

    return {

        roll: function (dice) {

            _.each(dice, function (die) {

            });

        },

        setName: function (name) {
            _name = name;
        },
        getName: function () {
            return _name;
        },

        setLocation: function (key, x, y) {
            _locations[key] = {x: x, y: y}
        },
        getLocation: function (key) {
            return _locations[key];
        },

        setColor: function (color) {
            _color = color;
        },
        getColor: function (color) {
            return _color;
        },

        setEntity: function (key, entity) {
            _entities[key] = entity;
        },
        getEntity: function (key) {
            return _entities[key];
        },

        setOrientation: function (orientation) {
            _orientation = orientation;
        },
//                setLimits: function( limitMap ){
//                    //_limits[key] = limit;
//                    _.extend( _limits, limitMap );
//                },
//                getLimit: function(key) {
//                    return _limits[key];
//                },

        getTrades: function () {
            return _trades;
        },

        addBadge: function (key, badge) {
            _badges[key] = badge;
            this.receiveCards([badge], 'badges');
        },
        removeBadge: function (key) {
            var badge = _badges[key];
            delete _badges[key];
            return badge;
        },

        countKnights: function () {
            return this.getCards('field', 'development', 'knight').length;
        },
        countLongestRoad: function () {
            console.log('countLongestRoad');

            var maxLength = 0;
            //TODO acyclic walk!!!

            //find all open edges, roads without neighbors

            //construct tree

            //remove duplicate paths
            //if difference.length = 0

            //measure paths


            //compare paths

            return maxLength;
        },
        countVictoryPoints: function () {
            console.log('countVictoryPoints');
            var total = 0;

            total += this.getPieces('settlement').length; //count settlements
            total += 2 * this.getPieces('city').length; //count cities

            //count victory point cards
            total += this.getCards('field', 'development', 'chapel').length;
            total += this.getCards('field', 'development', 'palace').length;
            total += this.getCards('field', 'development', 'market').length;
            total += this.getCards('field', 'development', 'library').length;
            total += this.getCards('field', 'development', 'university').length;

            //count badges
            _.each(_badges, function (badge, key) {
                switch (key) {
                    case 'largestArmy':
                    case 'longestRoad':
                        total += 2;
                        break;
                }
            });

            return total;
        },

        generateCardPositions: function (total, locationKey, zone) {
            //positions relative to player origin
            //mapped according to orientation

            var origin = _locations.origin;
            var offset = zone.offset;
            var width = zone.size.w;
            console.log(width);

            switch (_orientation) {

                case degrees[0]:
                    //extend right
                    //position = {x:origin.x+width/(total-1)*i, y:origin.y};
                    origin = {x: origin.x - offset.x, y: origin.y - offset.y};
                    break;

                case degrees[90]:
                    //extend down
                    //position = {x:origin.x, y:origin.y-width/(total-1)*i};
                    origin = {x: origin.x + offset.y, y: origin.y - offset.x};
                    break;

                case degrees[180]:
                    //extend left
                    //position = {x:origin.x-width/(total-1)*i, y:origin.y};
                    origin = {x: origin.x + offset.x, y: origin.y + offset.y};
                    break;

                case degrees[270]:
                    //extend up
                    //position = {x:origin.x, y:origin.y+width/(total-1)*i};
                    origin = {x: origin.x - offset.y, y: origin.y + offset.x};

                    break;
            }

            this.createLocation(origin, locationKey);

            // distribute positions along line
            // TODO distribute positions along curve?

            for (var i = 1; i < total; i++) {

                var position;

                // 0, Math.PI/2, Math.PI, Math.PI*3/2
                switch (_orientation) {
                    //distribute positions along maxWidth

                    case degrees[180]:
                        //extend right
                        position = {x: origin.x + width / (total - 1) * i, y: origin.y};
                        break;

                    case degrees[90]:
                        //extend down
                        position = {x: origin.x, y: origin.y - width / (total - 1) * i};
                        break;

                    case degrees[0]:
                        //extend left
                        position = {x: origin.x - width / (total - 1) * i, y: origin.y};
                        break;

                    case degrees[270]:
                        //extend up
                        position = {x: origin.x, y: origin.y + width / (total - 1) * i};

                        break;
                }

                this.createLocation(position, locationKey);
            }

            // draw line of all possible positions
            // rotate all cards to player orientation
        },
        showCardPositions: function (locationKey) {
            _.each(_locations[locationKey], function (location) {

            });
        },
        hideCardPositions: function (locationKey) {
            _.each(_locations[locationKey], function (location) {
                location.hide();
            });
        },
        createLocation: function (position, locationKey) {
            var cardLocations = _locations[locationKey];

            var entity = {};
            //var entity = ig.game.spawnEntity(EntityLocation, position.x, position.y);
            // new Piece location model
            var cardLocation = new PieceLocation(position.x, position.y, locationKey, 0, entity);

            cardLocations.push(cardLocation);
        },

        receiveCards: function (cards, locationKey) {
            var self = this;

            console.log('player receiving cards:');
            console.log(cards);
            console.log(locationKey);

            //get cards at location
            var cardTarget = _cards[locationKey];
            console.log(cardTarget);

            _.each(cards, function (card) {
                var location = _locations[locationKey][cardTarget.length];
                card.setLocation(location);
                cardTarget.push(card);

                //hide card from other players
                //card.hide();

                card.reveal();

                card.entity.rotateToAngle(_orientation);

//                        card.entity.zIndex=cardTarget.length;
//
//                        // Re-sort Entities for layering
//                        ig.game.sortEntitiesDeferred();

                //process card for inventory
                self.addInventory(card);
            });

            self.sortCards(locationKey);
        },
        sortCards: function (locationKey) { //after cards have been removed from hand, compact spacing

            //get cards at location
            var cardTarget = _cards[locationKey];
            console.log(cardTarget);

            _.each(cardTarget, function (card, index) {
                var location = _locations[locationKey][index];
                card.setLocation(location);
                card.entity.zIndex = index;
            });
            // Re-sort Entities for layering
            //ig.game.sortEntitiesDeferred();
        },
        getCards: function (locationKey, mainClass, subClass) {

            var matches = [];

            _.each(_cards[locationKey], function (card) {
                if (card.class == mainClass && (typeof subClass == "undefined" || card.hasSubclass(subClass))) {
                    matches.push(card);
                }
            });

            return matches;
        },
        getRandomCards: function (quantity, locationKey) {

            var taken = [];
            var cardTarget = _cards[locationKey];

            for (var i = 0; i < quantity; i++) {
                var index = Math.floor(Math.random() * cardTarget.length);
                var card = cardTarget[index];

                this.removeCard(card, 'hand');
                taken.push(card);
            }

            return taken;
        },
        removeCard: function (card, locationKey) {
            _cards[locationKey] = _.without(_cards[locationKey], card);
            _inventory[card.inventoryKey] = _.without(_inventory[card.inventoryKey], card);
            this.sortCards(locationKey);
        },
        resolveCard: function (card) {
            console.log('card.resolve');

            //_cards['hand'] = _.without(_cards['hand'],card);
            //TODO animate movement to resolution

            switch (card.resolution) {
                case 'field':
                    this.receiveCards([card], 'field');
                    break;

                case 'discard':

                    break;
                case 'hand':

                    break;
            }
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
        getPieces: function (key) {
            if (typeof key == "undefined") {
                return _pieces;
            } else {
                var cache = [];
                _.each(_pieces, function (piece) {
                    if (piece.type == key) {
                        cache.push(piece);
                    }
                });
                return cache;
            }

        },

        getEligibleBuildingLocations: function (item) {
            var self = this;

            var locations = [];
            var roads = this.getPieces('road');
            var settlements = this.getPieces('settlement');

            switch (item) {
                // roads
                // get edge neighbors for current roads, settlements, and cities
                // check that road is not on edge
                case 'road':


                    _.each(roads, function (road) {
                        var origin = road.getLocation(); //edge
                        console.log('location under road');
                        console.log(origin);

                        var vertices = origin.getNeighbors(); //adjacent vertices
                        console.log('vertices adjacent to road');
                        console.log(vertices);

                        _.each(vertices, function (vertex) {

                            var edges = vertex.getNeighbors();
                            console.log('edges of vertex');
                            console.log(edges);

                            _.each(edges, function (edge) {
                                if (edge.getPieces().length == 0 && edge != origin) {
                                    locations.push(edge);
                                }
                            });
                        });
                    });

                    locations = _.uniq(locations);
                    break;

                // settlements
                // get vertex neighbors for current roads
                // check that vertex is at least 2 roads away and 2 edges away from another settlement
                case 'settlement':

                    _.each(roads, function (road) {
                        locations = locations.concat(road.getLocation().getNeighbors());
                    });

                    locations = _.uniq(locations);
                    console.log('road vertices');
                    console.log(locations.length);

                    var invalidated = [];
                    _.each(locations, function (location) {

                        var invalidLocation = false;

                        //if has a piece
                        if (location.getPieces().length > 0) {
                            console.log('vertex occupied');
                            invalidLocation = true;
                        } else {
                            //if settlement or city is 1 vertex away
                            _.each(location.getNeighborsAtDistance(2), function (vertex) {
                                if (vertex.getPieces().length > 0) {
                                    console.log('neighbor vertex occupied');
                                    invalidLocation = true;
                                }
                            });
                        }
                        if (invalidLocation) {
                            invalidated.push(location);
                        }
                    });
                    console.log('invalid vertices');
                    console.log(invalidated);

                    locations = _.difference(locations, invalidated);

                    break;

                // cities
                // get current settlements
                case 'city':
                    //var cities = this.getPieces('city');
                    break;
            }

            return locations;
        },
        buildRoad: function (location) {

            var origin = _locations.origin;

            var entity = {};
            //var entity = ig.game.spawnEntity(EntityRoad, origin.x, origin.y);
            var road = new Piece("road", pieceId, entity);

            road.setOwner(this);
            this.addPiece(road);

            location.placePiece(road);
        },
        buildSettlement: function (location) {

            var origin = _locations.origin;

            var entity = {};
            //var entity = ig.game.spawnEntity(EntitySettlement, origin.x, origin.y);
            var settlement = new Piece("settlement", pieceId, entity);

            settlement.setOwner(this);
            this.addPiece(settlement);

            location.placePiece(settlement);

            this.updateMaritimeTrades();
        },
        buildCity: function (location) {

            console.log('building city');

            var settlement = location.getPieces()[0];
            console.log(settlement);

            //create city entity
            var entity = {};
            //var entity = ig.game.spawnEntity(EntityCity, location.x, location.y);
            var city = new Piece("city", pieceId, entity);
            city.setOwner(this);
            this.addPiece(city);

            settlement.getLocation().placePiece(city);

            //destroy settlement
            settlement.destroy();
            this.updateMaritimeTrades();
        },

        playCard: function (card, activation, callback) {
            //remove card from hand
            _cards['hand'] = _.without(_cards['hand'], card);
            //remove card from inventory
            _inventory[card.inventory] = _.without(_inventory[card.inventory], card);
            this.sortCards('hand');

            card.setActivation(activation);
            card.play();

            //move card to field
            this.resolveCard(card);

            //return control to Game
            if (callback) {
                callback();
            }
        },

        buyDevelopmentCard: function (developmentCardDeck) {
            this.purchase(catalog.developmentCard);
            developmentCardDeck.dealCards(1, this, 'hand');
        },

        buyRoad: function (location) {
            this.purchase(catalog.road);
            this.buildRoad(location);
        },
        buySettlement: function (location) {
            this.purchase(catalog.settlement);
            this.buildSettlement(location);
        },
        buyCity: function (location) {
            this.purchase(catalog.settlement);
            this.buildSettlement(location.getPieces()[0]);
        },

        activateKnight: function (card, robber, terrain, callback) {
            var self = this;
            console.log('activateKnight');

            //move robber
            var activation = function () {
                console.log('knight activation');
                console.log(robber);
                console.log(terrain);
                self.moveRobber(robber, terrain);
            }

            this.playCard(card, activation, callback);

        },
        activateRoadBuilding: function (card, locations, callback) {
            var self = this;

            var activation = function () {
                console.log('activateRoadBuilding');
                _.each(locations, function (location) {
                    self.buildRoad(location);
                });
            }

//                    callback = function(){
//                        if (self.getPieces('road').length>=7){
//                            callback();
//                        }
//                    }

            //his.playCard(card, activation, callback.bind(self));

            this.playCard(card, activation, callback);
        },
        activateYearOfPlenty: function (card, types, resourceGenerator) {
            var self = this;
            console.log('activateYearOfPlenty');

            var payouts = [];
            _.each(types, function (type) {
                payouts.push({
                    player: self,
                    count: 1,
                    type: type,
                    origin: self.getLocation('origin')
                });
            });
            console.log(payouts);

            var activation = function () {
                resourceGenerator(payouts);
            }

            this.playCard(card, activation);
        },
        activateMonopoly: function (card, resourceType, players) {
            var self = this;

            console.log('activateMonopoly');
            console.log(resourceType);

            players = _.without(players, this);
            var taken = [];

            var activation = function () {
                _.each(players, function (player) {
                    var target = player.getInventory(resourceType);
                    console.log(target);

                    if (target.length > 0) {
                        var given = player.consumeInventory(target.length, resourceType)
                        taken = taken.concat(given);

                        player.sortCards('hand');
                    }
                });

                console.log('resources taken');
                console.log(taken);

                self.receiveCards(taken, 'hand');
            }

            this.playCard(card, activation);
        },
        activateVictoryPoint: function (card) {

            var activation = function () {
                console.log('victory point animation');
            }

            this.playCard(card, activation);
        },


        moveRobber: function (robber, terrain) {
            terrain.placeRobber(robber);
        },

        stealFromPlayer: function (player) {
            //randomly pull card from target player
            var cards = player.getRandomCards(1, 'hand');

            //add
            this.receiveCards(cards, 'hand');
        },

        updateMaritimeTrades: function () {
            console.log('updateMaritimeTrades');

            //get locations under each settlement
            var locations = [];

            _.each(this.getPieces('settlement'), function (piece) {
                locations.push(piece.getLocation());
            });
            _.each(this.getPieces('city'), function (piece) {
                locations.push(piece.getLocation());
            });

            var tradeKeys = [];
            //check location has link to port
            _.each(locations, function (location) {
                var harbor = location.getLink('harbor');
                if (harbor !== null) {
                    tradeKeys.push(harbor.class);
                }

            });

            console.log(tradeKeys);

            //update 2 <resourceType> for 1
            //update 3 any for 1
            _.each(tradeKeys, function (key) {

                switch (key) {
                    case 'wheat':
                    case 'brick':
                    case 'ore':
                    case 'sheep':
                    case 'wood':
                        _trades[key] = 2;
                        break;
                    case 'any':
                        _trades[key] = 3;
                }
            });
            console.log(_trades);
        },

        initiateTrade: function (player) {

        },

        getValidActions: function () {

            //crossreference permitted and affordable actions

        },

        getPermittedActions: function () { //permission based on game state


        },

        getAffordableActions: function () { //based on player inventory
            var self = this;

            // check player inventory against catalog
            var report = {};
            // cache totals for each type of inventory
            var totals = {};

            _.each(_inventory, function (inventoryType, key) {
                console.log(inventoryType);
                totals[key] = inventoryType.length;
            });

            console.log('inventory totals:');
            console.log(totals);

            _.each(catalog, function (item, name) {

                console.log(item.name);
                report[item.name] = true;

                _.each(item.cost, function (cost, key) {

                    if (typeof totals[key] == "undefined" || totals[key] < cost) {
                        report[item.name] = false;
                    }

                });

            });

            return report;
        },
        addInventory: function (object) {

            var key = object.inventoryKey;
            console.log('receiving inventory for');
            console.log(key);

            if (typeof _inventory[key] == "undefined") {
                _inventory[key] = [];
            }

            _inventory[key].push(object);

            console.log(_inventory[key]);
        },
        getInventory: function (key) {
            return _inventory[key];
        },
        consumeInventory: function (quantity, key) {
            var consumed = [];
            console.log('consume inventory')
            console.log(_inventory[key]);
            console.log(_cards['hand']);


            if (typeof _inventory[key] === "undefined") {
                return false;
            } else if (_inventory[key] < quantity) {
                return false;
            } else {
                consumed = _inventory[key].splice(0, quantity);
            }
            //also remove visible cards from hand
            _cards['hand'] = _.difference(_cards['hand'], consumed);
            this.sortCards('hand');

            console.log('after consumption');
            console.log(_inventory[key]);
            console.log(_cards['hand']);

            return consumed;
        },
        purchase: function (item) {
            var self = this;
            console.log('purchasing ' + item.name);
            _.each(item.cost, function (cost, key) {
                if (!self.consumeInventory(cost, key)) {
                    return false;
                }
            });
            console.log(_inventory);
            return true;
        }
    };

};