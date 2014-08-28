/**
 * Created by michaelgarrido on 8/26/14.
 */
//Body2D = (function() {
//
//    function Body2D(ctx, x, y, key, options) {
//
//        var body = new ReactiveObject({
//            'x': x,
//            'y': y,
//            ctx: ctx,
//            place: function (x, y) {
//                this.x = x;
//                this.y = y;
//
//                this.computation.invalidate();
//            },
//            position: function () {
//                console.log(this.x + ',' + this.y);
//                return [this.x, this.y];
//            }
//
//        });
//
//        body.id = ctx.addBody(body.x, body.y, key, options);
//
//        body.computation = Deps.autorun(function (computation) {
//            //console.log('first computation');
//            //dep.depend();
//            //Deps.currentComputation;
//            updatePosition2D(body);
//        });
//
//        return body;
//    }
//
//    function updatePosition2D( body ){
//
//        console.log('updatePosition', body);
//
//        body.ctx.moveBody( body );
//
//    }
//
//    return Body2D;
//
//})();

Body2D = (function() {

    function Body2D(ctx, x, y, key, options) {

        var body = {
            'x': x,
            'y': y,
            'duration': 0,
            ctx: ctx,

            _dep: new Deps.Dependency,

            place: function (x, y, duration) {

                this.x = x;
                this.y = y;
                this.duration = duration || 0;

                //this.computation.invalidate();
                this._dep.changed();
            },
            position: function () {
                console.log(this.x + ',' + this.y);
                return [this.x, this.y];
            },
            update: function(){
                this._dep.depend();
                this.ctx.moveBody( this );
            }

        };

        body.id = ctx.addBody(body.x, body.y, key, options);

        Deps.autorun(function(c){

            body.update();

            console.log('updatePosition');
            //body.ctx.moveBody( body );

        });

        console.log(body);

        return body;
    }



    return Body2D;

})();



//Body3D = (function() {
//
//    function Body3D(ctx, key, x, y, z) {
//
//        var body = new ReactiveObject({
//            position: {
//                x: x, y: y, z: z
//            },
//            rotation: {
//                x: 0, y: 0, z: 0
//            },
//            ctx: ctx,
//            key: key,
//
//            place: function (x, y, z) {
//                this.position = {
//                    x: x, y: y, z: z
//                };
//                this.computation.invalidate();
//            },
//
//            rotate: function (x, y, z) {
//                this.rotation = {
//                    x: x, y: y, z: z
//                };
//            }
//
//        });
//
//        body.id = ctx.addBody(key, body.position.x, body.position.y, body.position.z);
//
//        body.computation = Deps.autorun(function (computation) {
//            //dep.depend();
//
//            updateTransform3D(body);
//        });
//
//        return body;
//    }
//
//    function updateTransform3D( body ){
//        //position
//        //rotation
//        //scaling
//
//        body.ctx.updateBody( body );
//    }
//
//    return Body3D;
//
//})();

Body3D = (function() {

    function Body3D(ctx, key, x, y, z) {

        var body = {

            _dep: new Deps.Dependency,
            position: {
                x: x, y: y, z: z
            },
            rotation: {
                x: 0, y: 0, z: 0
            },
            ctx: ctx,
            key: key,

            place: function (x, y, z) {
                this.position = {
                    x: x, y: y, z: z
                };
                this._dep.changed();
            },

            rotate: function (x, y, z) {
                this.rotation = {
                    x: x, y: y, z: z
                };
                this._dep.changed();
            },

            update: function() {
                this._dep.depend();
                this.ctx.updateBody( this );
            }

        };

        body.id = ctx.addBody(key, body.position.x, body.position.y, body.position.z);

        Deps.autorun(function (computation) {
            body.update();
        });

        return body;
    }

    return Body3D;

})();


function Camera(){

    var body = new ReactiveObject({
        position: {
            x: x, y: y, z: z
        },
        rotation: {
            x: 0, y: 0, z: 0
        }
    });

    return body;

}

Factory = (function() {

    function Factory( context2D, context3D, dependency ) {

        this.ctx2D = context2D || null;
        this.ctx3D = context3D || null;

        this.contexts = {};

        this.dependency = dependency;

        this.templates2D = {};
        this.bodies2D = [];


        this.templates3D = {};
        this.bodies3D = [];
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

        makeBody3D: function (key, x, y, z) {

            var body = new Body3D(ctx3D, key, x, y, z);
            this.bodies3D.push(body);

            return body;
        },

        makeBody2D: function (x, y, key, options ) {
            var body = new Body2D(this.ctx2D, x, y, key, options );
            this.bodies2D.push(body);

            return body;
        },

        makeBody: function( ctxKey, bodyKey, properties, options ) {

            var body = new Body2D( this.contexts[ctxKey], properties.x, properties.y, bodyKey, options );

            return body;
        },

        makeCamera3D: function () {

            return this.makeBody3D('camera', x, y, z);

        }

    };

    return Factory;

})();