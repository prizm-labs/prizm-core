/**
 * Created by michaelgarrido on 8/26/14.
 */
Body2D = (function() {

    function Body2D(ctx, x, y) {

        var body = new ReactiveObject({
            'x': x,
            'y': y,
            ctx: ctx,
            place: function (x, y) {
                this.x = x;
                this.y = y;

                //this.computation.invalidate();
            },
            position: function () {
                console.log(this.x + ',' + this.y);
                return [this.x, this.y];
            }

        });

        body.id = ctx.addBody(body.x, body.y);

        body.computation = Deps.autorun(function (computation) {
            //console.log('first computation');
            //dep.depend();
            //Deps.currentComputation;
            updatePosition2D(body);
        });

        return body;
    }

    function updatePosition2D( body ){

        console.log('updatePosition', body);

        body.ctx.moveBody( body );

    }

    return Body2D;

})();


Body3D = (function() {

    function Body3D(ctx, key, x, y, z) {

        var body = new ReactiveObject({
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
            },

            rotate: function (x, y, z) {
                this.rotation = {
                    x: x, y: y, z: z
                };
            }

        });

        body.id = ctx.addBody(key, body.position.x, body.position.y, body.position.z);

        body.computation = Deps.autorun(function (computation) {
            //dep.depend();

            updateTransform3D(body);
        });

        return body;
    }

    function updateTransform3D( body ){
        //position
        //rotation
        //scaling

        body.ctx.updateBody( body );
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

    function Factory() {

        this.templates2D = {};
        this.bodies2D = [];


        this.templates3D = {};
        this.bodies3D = [];
    }

    Factory.prototype = {
        // manifest: [ key, geometry, texture ]
        loadTemplates3D: function (manifest) {
            console.log('loadTemplates3D', manifest);

            _.each(manifest, function (model) {
                ctx3D.load(model);
            })

        },

        makeBody3D: function (key, x, y, z) {

            var body = new Body3D(ctx3D, key, x, y, z);
            this.bodies3D.push(body);

            return body;
        },

        makeBody: function (x, y) {
            var body = new Body2D(ctx, x, y);
            this.bodies2D.push(body);

            return body;
        },

        makeCamera3D: function () {

            return this.makeBody3D('camera', x, y, z);

        }

    };

    return Factory;

})();