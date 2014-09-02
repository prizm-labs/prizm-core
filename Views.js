/**
 * Created by michaelgarrido on 9/1/14.
 */

ViewManager = (function(){

    function ViewManager( screenType, screenWidth, screenHeight ){

        this.screenType = screenType;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.currentView = null;
        this.views = {};
    }

    ViewManager.prototype = {

        addView: function(){


        },

        presentView: function(){



        },


        init: function(){




        }

    };

    return ViewManager;
})();

View = (function(){

    function View( width, height ) {

        this.allContextsLoaded = false;

        this.width = width;
        this.height = height;

        this.factory = new Factory();
        this.contexts = {};

        this.UI = null;
        this.soundManager = null;

        this.onStartup = function () {
        };

    }

    View.prototype = {

        createUIManager: function( UIDOMAnchorId ){
            this.UI = new UIManager( this.factory, UIDOMAnchorId );
        },

        present: function(){

            // show display of all contexts
            // setup UI / Sound bindings

        },

        resign: function(){

            // hide display of all contexts
            // teardown UI / Sound bindings

        },

        createContext2D: function( key, DOMAnchorId, renderingType, manifest, atlasPath, width, height ){

            var ctx2D =  new Context2D( DOMAnchorId, renderingType, width || this.width, height || this.height );
            this.bindContextToFactory( ctx2D, key );
            this.factory.loadTemplates2D( key, atlasPath, manifest );

            // TODO notify templates loaded !!!
        },

        createContext3D: function( key, DOMAnchorId, manifest ){

            var ctx3D = new Context3D( DOMAnchorId, this.width, this.height );
            this.bindContextToFactory( ctx3D, key );
            this.factory.loadTemplates3D( manifest, key );

            // TODO notify templates loaded !!!
        },

        bindContextToFactory: function( ctx, key ) {

            ctx.init();
            this.contexts[key] = ctx;
            this.factory.registerContext(key, ctx);
        }

    };


    return View;
})();