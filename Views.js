/**
 * Created by michaelgarrido on 9/1/14.
 */

ViewManager = (function () {

    function ViewManager(screenType, screenWidth, screenHeight) {

        this.screenType = screenType;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.currentView = null;
        this.views = {};
    }

    ViewManager.prototype = {

        addView: function () {


        },

        presentView: function () {


        },


        init: function () {


        }

    };

    return ViewManager;
})();

//TODO modal views???


View = (function () {

    function View(key, width, height) {
        var self = this;

        this.allContextsLoaded = false;

        this.key = key;

        this.width = width;
        this.height = height;

        this.factory = new Factory();
        this.contexts = {};

        this.UI = null;
        this.soundManager = null;

        this.onStartup = function () {
        };

        this.preloadQueue = [];

        this.locations = {
            center: function () {
                return { x: self.width / 2, y: self.height / 2}
            },
            corners: function () {
                return [
                    { x: 0, y: 0 },
                    { x: self.width, y: 0 },
                    { x: self.width, y: self.height },
                    { x: 0, y: self.height }
                ]
            }
        }

        // notify client that all view's contexts are preloaded
        amplify.subscribe('preloadContext', function (data) {
            console.log('preloadContext', data);
            self.preloadQueue = _.without(self.preloadQueue, data.entry);
            console.log('preloadContext after entry removed', self.preloadQueue.length);

            if (self.preloadQueue.length == 0) {
                amplify.publish('preloadComplete', 'view');
                //amplify.publish('preloadComplete', {view: self.key})
            }

        });
    }

    View.prototype = {

        createUIManager: function (UIDOMAnchorId) {
            this.UI = new UIManager(this.factory, UIDOMAnchorId);
        },

        present: function () {

            // show display of all contexts
            // setup UI / Sound bindings

        },

        resign: function () {

            // hide display of all contexts
            // teardown UI / Sound bindings

        },

        preload: function () {
            var self = this;
            console.log('View preload', this);
            // execute preload for each context in queue
            _.each(this.preloadQueue, function (entry) {
                if (entry[0] === '2D') {
                    self.factory.loadTemplates2D(entry[1], entry[2], entry[3], function () {
                        console.log('loadTemplates2D callback', entry);
                        amplify.publish('preloadContext', {entry: entry});
                    }, entry[4]||null);
                }

            });

            //TODO preload sounds !!!
        },

        addPreloadEntry: function (contextType, key, assetsPath, manifest) {
            var entry = [contextType, key, assetsPath, manifest];
            console.log('addPreloadEntry',entry);
            this.preloadQueue.push(entry);
        },

        createContext2D: function (key, DOMAnchorId, renderingType, manifest, atlasPath, width, height) {

            var ctx2D = new Context2D(DOMAnchorId, renderingType, width || this.width, height || this.height);
            this.bindContextToFactory(ctx2D, key);

            // create preload queue entry
            //this.factory.loadTemplates2D( key, atlasPath, JSON.parse(Assets.getText(manifest)) );
            this.addPreloadEntry('2D', key, atlasPath, manifest, false);
        },

        createContext3D: function (key, DOMAnchorId, manifest) {

            var ctx3D = new Context3D(DOMAnchorId, this.width, this.height);
            this.bindContextToFactory(ctx3D, key);
            this.factory.loadTemplates3D(manifest, key);

            // TODO notify templates loaded !!!
        },

        bindContextToFactory: function (ctx, key) {

            ctx.init();
            this.contexts[key] = ctx;
            this.factory.registerContext(key, ctx);
        }

    };


    return View;
})();