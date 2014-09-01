/**
 * Created by michaelgarrido on 8/26/14.
 */

Body2D = (function() {

    function Body2D(ctx, x, y, key, options) {

        var body = {

            _dep: new Deps.Dependency,
            'x': x,
            'y': y,

            ctx: ctx,

            animations: [],

            place: function (x, y, duration) {

                this.x = x;
                this.y = y;

                this.registerAnimation( 'position', {
                    x: x, y: y
                }, duration || 0);

                //this._dep.changed();
                this.runAnimations();
            },

            registerAnimation: function( attributeKey, attributeValues, duration){
                this.animations.push( [attributeKey, attributeValues, duration] );
                console.log('registerAnimation',this.animations);
            },

            runAnimations: function(){
                this._dep.changed();
            },

            update: function(){
                this._dep.depend();
                this.ctx.updateBody( this );
            }

//            position: function () {
//                console.log(this.x + ',' + this.y);
//                return [this.x, this.y];
//            },

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

            animations: [],

            place: function (x, y, z, duration) {
                this.position = {
                    x: x, y: y, z: z
                };

                this.registerAnimation( 'position', {
                    x: x, y: y, z: z
                }, duration || 0 );

                this.runAnimations();
            },

            rotate: function (x, y, z, duration) {
                this.rotation = {
                    x: x, y: y, z: z
                };

                this.registerAnimation( 'rotation', {
                    x: x, y: y, z: z
                }, duration || 0 );
                this.runAnimations();
            },

            update: function() {
                this._dep.depend();
                this.ctx.updateBody( this );
            },

            registerAnimation: function( attributeKey, attributeValues, duration){
                this.animations.push( [attributeKey, attributeValues, duration] );
                console.log('registerAnimation',this.animations);
            },

            runAnimations: function(){
                this._dep.changed();
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