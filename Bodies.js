/**
 * Created by michaelgarrido on 8/26/14.
 */

Body2D = (function () {

    function Body2D(ctx, x, y, key, options) {

        var body = {

            _dep: new Deps.Dependency,
            _entity: null,

            key: key,
            x: x,
            y: y,
            alpha: 1,
            rotation: 0,
            scale: 1,

            hasFrames: options ? (options.frames || false) : false,
            ctx: ctx,

            animations: [],
            onComplete: null,

            hitArea: null,

            children: [],
            tags: [],

            state: {},

            setFrame: function( index ){
                this._entity.gotoAndStop( index );
            },

            getAbsoluteBounds: function( options, reference ){

                // default reference assuming Stage is parent
                var bounds = this._entity.getBounds();

                //TODO why does Sprite._bounds have scaled applied inconsistently???
                //TODO workaround to detect if scale applied
                var applyScaling = (bounds.x<0 && bounds.y<0);

                var x, y, w, h;

                if (applyScaling) {
                    w = bounds.width*this._entity.scale.x;
                    h = bounds.height*this._entity.scale.y;
                } else {
                    w = bounds.width;
                    h = bounds.height;
                }



                if (options) {
                    if (options.center) { // return center point
                        x = this._entity.position.x;
                        y = this._entity.position.y;
                    }
                } else { // return top-left corner

                    if (applyScaling) {
                        x = this._entity.position.x+bounds.x*this._entity.scale.x;
                        y = this._entity.position.y+bounds.y*this._entity.scale.y;
                    } else {
                        x = this._entity.position.x-bounds.width/2*this._entity.scale.x;
                        y = this._entity.position.y-bounds.height/2*this._entity.scale.y;
                    }


                }

                return [x,y,w,h];
            },

            setHitArea: function( uiTarget ){

                this.hitArea = uiTarget;

            },

            getCenterPoint: function(){

            },


            addMask: function (shape, x, y, size) {

                // Mask relative to body's parent
                this.mask = this.ctx.addMask(shape, this.x+x, this.y+y, size);
                this.ctx.maskBody(this._entity,this.mask.body)
            },

            setMask: function(body){
                this.mask = body;
                this.ctx.maskBody(this._entity,body._entity);
            },

            addTag: function (tag) {
                  this.tags.push(tag);
            },

            addTags: function (tags) {
                _.each(tags, this.addTag.bind(this));
            },

            hasTag: function( tag ){
                return this.tags.indexOf(tag)!=-1;
            },
            hasTags: function (tags) {
                var self = this;
                var matches = _.filter(tags, function(tag){ return self.hasTag(tag); });
                return matches.length===tags.length;
            },

            place: function (x, y, duration, callback) {

                //console.log(x!=null,y!=null);

                this.x = x != null ? x : this.x;
                this.y = y != null ? y : this.y;


                this.registerAnimation('position', {
                    x: this.x, y: this.y
                }, duration || 0);

                //this._dep.changed();
                this.runAnimations(callback);
            },

            resize: function (x, y, duration, callback) {

                this.registerAnimation('scale', {x:x,y:y},
                        duration || 0);

                this.runAnimations(callback);
            },

            hide: function(){
                this._entity.visible = false;
            },
            show: function(){
                this._entity.visible = true;
            },

            fade: function( alpha, duration, callback ){

                this.show();

                this.alpha = alpha;
                this.registerAnimation('alpha', alpha,
                        duration || 0);

                this.runAnimations(callback);
            },

            rotate: function (rotation, duration, callback) {
                this.rotation = rotation;


                this.registerAnimation('rotation', rotation,
                        duration || 0);

                this.runAnimations(callback);
            },

            setPivot: function( x, y ) {
                this.entity().pivot.x = x;
                this.entity().pivot.y = y;
            },

            registerAnimation: function (attributeKey, attributeValues, duration, options) {
                this.animations.push([attributeKey, attributeValues, duration, options]);
                //console.log('registerAnimation', this.animations);
            },

            runAnimations: function ( callback ) {
                this.onComplete = callback || null;
                this._dep.changed();
            },

            update: function () {
                this._dep.depend();
                var timeline = this.ctx.updateBody(this, this.onComplete);
                this.onComplete = null;

                if (timeline) timeline.play();
            },

            entity: function () {
                return this._entity;
            },

            addChild: function (body2D) {
                this.children.push(body2D);
                this.ctx.addChildToGroup(this.id, body2D.entity());
            },

            remove: function(){
                this.ctx.removeBody(this.id);

                if (this.hitArea!=null){
                    this.hitArea.remove();
                }
            },

            setText: function(text){
                this._entity.setText(text);
            },
            centerText: function() {
                if (this.key == 'text') {
                    this._entity.position.x = this.x-this._entity.width/2;
                }
            },


            createEntity: function (key) {

                var entity;

                switch (key){

                    case 'group':
                        entity = ctx.addGroup(body.x, body.y);
                        break;

                    case 'text':
                        entity = ctx.addText(body.x, body.y, options.text, options.styles || null, options);
                        break;

                    case 'circle':
                        entity = ctx.addCircle(body.x, body.y, options.radius,
                                options.strokeColor||null, options.fillColor||null, options);
                        break;

                    case 'rectangle':
                        entity = ctx.addRectangle(body.x, body.y, options.width, options.height,
                                options.strokeColor||null, options.fillColor||null, options);
                        break;

                    default:
                        entity = ctx.addBody(body.x, body.y, key, options);
                        break;
                }

                this._entity = entity.body;
                this.id = entity.id;
            }
        };



//        if (key === 'group') {
//            entity = ctx.addGroup(body.x, body.y);
//        } else if (key=='text') {
//            entity = ctx.addText(body.x, body.y, options.text, options.styles || null, options);
//        } else {
//            entity = ctx.addBody(body.x, body.y, key, options);
//        }


        body.createEntity(key);


        Deps.autorun(function (c) {
            body.update();
        });

        return body;
    }

    return Body2D;
})();


Body3D = (function () {

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

                this.registerAnimation('position', {
                    x: x, y: y, z: z
                }, duration || 0);

                this.runAnimations();
            },

            rotate: function (x, y, z, duration) {
                this.rotation = {
                    x: x, y: y, z: z
                };

                this.registerAnimation('rotation', {
                    x: x, y: y, z: z
                }, duration || 0);
                this.runAnimations();
            },

            update: function () {
                this._dep.depend();
                this.ctx.updateBody(this);
            },

            registerAnimation: function (attributeKey, attributeValues, duration) {
                this.animations.push([attributeKey, attributeValues, duration]);
                console.log('registerAnimation', this.animations);
            },

            runAnimations: function () {
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