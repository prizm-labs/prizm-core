/**
 * Created by michaelgarrido on 9/9/14.
 */

GameWorld = (function () {

    function GameWorld() {
        this.preloaded = false;
        this.rendered = false;
        this.view = null;

        this._methods = {};

        this.nodes = [];

        this.state = {};
    }


    GameWorld.prototype = {

        prepare: function (contexts) {

            var self = this;
            console.log('prepareGameWorld', contexts);
            // preload each context

            // setup pubsub to track each context loading
            // when all contexts loaded, notify server
            amplify.subscribe('preloadView', function (data) {
                self.preloaded = true;

                Meteor.call('clientReadyForGameSession', Session.get('client_id'), Session.get('arena')._id)
            });

            this.view = new View('main', Session.get('viewport_width'), Session.get('viewport_height'));
            this.view.createUIManager('hit-area');

            _.each(contexts, function (context, key) {
                if (context.type == '2D') {
                    self.view.createContext2D(key, context.domAnchor, 'canvas',
                        context.manifest, context.atlas.map,
                        Session.get('viewport_width'), Session.get('viewport_height')
                    );
                }
            });

            this.view.preload();

        },

        broadcast: function( channel, data ){


        },

        methods: function (methods) {
            _.extend(this._methods, methods);
        },

        call: function (key, args) {
            if (this._methods[key]) return this._methods[key].call(this, args);
        },

        addNode: function (node) {
            this.nodes.push(node);
        },
        nodesWithTag: function (tag) {
            var result = [];
            _.each( this.nodes, function(node) {
                if (node.hasTag(tag)) result.push(node);
            });

            return result;
        },

        bindUI: function () {

//        b1 = this.factory.makeBody2D( 'hand', 'terrain', { x:100, y:100}, { variant: 'pasture' } );
//        b2 = this.factory.makeBody3D( 'field', 'road', 0,0,0);
//
//        liveDataDelegate.registerSubscription( 'nodes', 'qwiyKk5SFwZG9E4ca', function( fields ){
//            b1.place( fields.x||null, fields.y||null, 0 );
//        });
//        var gameMaster = new GameMaster( VARIANTS["threeToFourPlayers"], this.factory );
//        gameMaster.init( this.factory );
//        gameMaster.setupNodeMatrix();


            // Render private view bodies (i.e. hand)

            boxTgt = this.view.UI.addBoxTarget(0, 0, screenSize[0], screenSize[1], 'hand');
            boxTgt.setBehavior('tap', null, null, function (event) {
                console.log('box tap stop', event);
            });
            boxTgt.setBehavior('pan',
                function (event) {
                    console.log('box pan start', event);
                },
                function (event) {
                    console.log('box pan update', event);
                    //b1.place( b1.x+event.deltaX, b1.y+event.deltaY );
                    //b1.place( event.center.x, event.center.y, 0 );
                    Meteor.call('updateNode', "qwiyKk5SFwZG9E4ca", {x: event.center.x, y: event.center.y})
                },
                function (event) {
                    console.log('box pan stop', event);
                });
            boxTgt.activate();


            this.view.UI.setTargetGroup('fullscreen', [boxTgt]);


            this.view.present();

        }

    };

    return GameWorld;

})();


