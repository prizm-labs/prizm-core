/**
 * Created by michaelgarrido on 8/27/14.
 */
Factory = (function() {

    function Factory( context2D, context3D, dependency ) {

        this.ctx2D = context2D || null;
        this.ctx3D = context3D || null;

        this.contexts = {};

        this.dependency = dependency;


        this.templates2D = {};
        //this.bodies2D = [];


        this.templates3D = {};
        //this.bodies3D = [];
    }

    Factory.prototype = {

        registerContext: function( key, context ){
            this.contexts[key] = context;
        },

        // manifest: [ key, geometry, texture ]
        loadTemplates3D: function (manifest) {
            var _this = this;
            console.log('loadTemplates3D', manifest);

            _.each(manifest, function (model, index) {
                _this.ctx3D.load(model);
                console.log(index);

            })

            GameState.set('3D',true);
            //globalDep.changed();
        },

        loadTemplates2D: function( ctxKey, file, manifest ){

            //ctx2D.load( file, manifest );
            this.contexts[ctxKey].load( file, manifest );
        },

        makeBody3D: function ( ctxKey, bodyKey, x, y, z, options ) {

            var body = new Body3D( this.contexts[ctxKey], bodyKey, x, y, z, options );


            return body;
        },

        makeBody2D: function( ctxKey, bodyKey, properties, options ) {

            console.log('makeBody',this.contexts[ctxKey].constructor.name);

            var body = new Body2D( this.contexts[ctxKey], properties.x, properties.y, bodyKey, options );

            return body;
        },

        makeCamera3D: function ( ctxKey, x, y, z, options ) {

            return this.makeBody3D( ctxKey, 'camera', x, y, z, options );
            //return null;
        }

    };

    return Factory;

})();