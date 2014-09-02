/**
 * Created by michaelgarrido on 8/27/14.
 */
Factory = (function() {

    function Factory() {

        this.contexts = {};
    }

    Factory.prototype = {

        registerContext: function( key, context ){
            this.contexts[key] = context;
        },

        // manifest: [ key, geometry, texture ]
        loadTemplates3D: function ( manifest, ctxKey) {
            var _this = this;
            console.log('loadTemplates3D', manifest);
            new Meteor.Collection("pieces");
            _.each(manifest, function (model, index) {
                _this.contexts[ctxKey].load(model);
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

            //console.log('makeBody',this.contexts[ctxKey].constructor.name);

            var body = new Body2D( this.contexts[ctxKey], properties.x, properties.y, bodyKey, options );

            return body;
        },

        makeCamera3D: function ( ctx3DKey, x, y, z, fov, near, far ) {

            var aspect = this.contexts[ctx3DKey].options.width/ this.contexts[ctx3DKey].options.height;

            var cameraOptions = [ fov, aspect, near, far ];

            return this.makeBody3D( ctx3DKey, 'camera', x, y, z, cameraOptions );
            //return null;
        }

    };

    return Factory;

})();