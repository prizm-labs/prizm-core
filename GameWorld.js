/**
 * Created by michaelgarrido on 9/9/14.
 */

GameWorld = (function () {

    function GameWorld() {
        this.preloaded = {
            all:false,
            view: false,
            sound: false
        };
        this.rendered = false;
        this.view = null;
        this.sound = null;

        this._methods = {};

        this.nodes = [];

        this.state = {};

        this.liveData = new LiveDataDelegate();
    }


    GameWorld.prototype = {

        checkPreloadComplete: function(){
            console.log('checkPreloadComplete',this.preloaded);

            if (this.preloaded.view && this.preloaded.sound && !this.preloaded.all) {
                this.preloaded.all=true;

            }

            return this.preloaded.all;
        },

        prepare: function (contexts, players, sounds) {

            var self = this;
            console.log('prepareGameWorld', contexts, players, sounds);
            // preload each context

            // setup pubsub to track each context loading
            // when all contexts loaded, notify server
            amplify.subscribe('preloadComplete', function (key) {
                self.preloaded[key] = true;
                if (self.checkPreloadComplete()){

                    console.log('notifying client preload complete');
                    Meteor.call('clientReadyForGameSession',
                        Session.get('client_id'),
                        Session.get('arena')._id,
                        Session.get('gameState_id')
                    );
                }
            });

            this.sound = new SoundManager();
            this.sound.loadGroup( 'default', sounds.entries, sounds.directory );

            this.view = new View('main', Session.get('viewport_width'), Session.get('viewport_height'));
            this.view.createUIManager('hit-area');

            _.each(contexts, function (context, key) {

                if (context.type == '2D') {
                    self.view.createContext2D(key, context.domAnchor, 'canvas',
                        context.manifest, context.atlas.map,
                        Session.get('viewport_width'), Session.get('viewport_height')
                    );
                }

                if (context.loadPlayers) {

                    var manifest = self.createPlayerManifest(players);
                    self.view.addPreloadEntry('2D',key,manifest[0],manifest[1],true);
                }
            });

            this.view.preload();

        },

        exit: function(){

            // TODO teardown & reset contexts

        },

        createPlayerManifest: function (players) {

            var paths = [];
            var map = {};

            _.each(players, function(player){
               paths.push(player.avatar);
               map[player.index]=player.avatar;
            });

            return [paths, [['avatar', map]] ];

            // GOAL:
//            var avatarUrls = ['https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c32.113.402.402/197820_10200365622437550_1307454223_n.jpg?oh=8c158d69e3b36d07539b721b9cd0f404&oe=5492CF89&__gda__=1418764606_1684123b2a18eb8f4ab3bc3252c1e156',
//                'https://lh5.googleusercontent.com/-TbxFjAU9Vpg/AAAAAAAAAAI/AAAAAAAAAJU/ZiJRz12XYco/photo.jpg'];
//            var avatarManifest = [
//                [ 'avatar', {
//                    'p1':'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c32.113.402.402/197820_10200365622437550_1307454223_n.jpg?oh=8c158d69e3b36d07539b721b9cd0f404&oe=5492CF89&__gda__=1418764606_1684123b2a18eb8f4ab3bc3252c1e156',
//                    'p2':'https://lh5.googleusercontent.com/-TbxFjAU9Vpg/AAAAAAAAAAI/AAAAAAAAAJU/ZiJRz12XYco/photo.jpg'}]
//            ];
        },

        bindStream: function( stream ){
            this.stream = stream;
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
//        nodesWithTag: function (tag) {
//            var result = [];
//            _.each( this.nodes, function(node) {
//                if (node.hasTag(tag)) result.push(node);
//            });
//
//            return result;
//        },
        nodesWithTag: function (tag) {
            return _.filter( this.nodes, function(node) {
                return node.hasTag(tag);
            });
        },
        nodesWithTags: function (tags) {
            return _.filter( this.nodes, function(node) {
                return node.hasTags(tags);
            });
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


