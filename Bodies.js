/**
 * Created by michaelgarrido on 8/26/14.
 */

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
        });

        return body;
    }

    return Body2D;
})();


Body3D = (function() {

    function Body3D(ctx, key, x, y, z, options) {

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

        body.id = ctx.addBody(key, body.position.x, body.position.y, body.position.z, options);

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