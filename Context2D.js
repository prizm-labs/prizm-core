Context2D = function (DOMElementId, renderType, width, height) {

    this.config = {
        type: renderType,
        height: height,
        width: width
    };
    this.DOMAnchor = document.getElementById(DOMElementId);

    this.templates = {};

    this.renderer = null;
    this.stage = null;

    //this.entities = [];
    this.entities = {};

    this.locations = {};


};

Context2D.prototype = {

    init: function (isBackgroundTransparent) {

        var self = this;

        if (this.config.type == 'canvas') {

            this.renderer = new PIXI.CanvasRenderer(
                this.config.width, this.config.height,
                null, isBackgroundTransparent || null);
            // Allow transparent background

        } else if (this.config.type == 'webgl') {
            this.renderer = new PIXI.WebGLRenderer(this.config.width, this.config.height, null, true);
        }

        this.DOMAnchor.appendChild(this.renderer.view);

        this.stage = new PIXI.Stage();
        //this.stage = new PIXI.Stage(0x3da8bb, true);

        //requestAnimationFrame(this.animate.bind(self));

        TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
    },

    setBackgroundColor: function (color) {
        console.log('setBackgroundColor', color);
        color = Colors.stringToHex(color);
        this.stage.setBackgroundColor(color);
        this.animate();
    },

    load: function (file, manifest, callback, isCrossOrigin) {

        console.log('2D load', file, manifest);
        var _this = this;

        isCrossOrigin = isCrossOrigin || false;

        var assetsToLoader = (typeof file == "string") ? [file] : file;
        var loader = new PIXI.AssetLoader(assetsToLoader, isCrossOrigin);
        loader.onProgress = onLoadProgress;
        loader.onComplete = onLoadComplete;
        loader.load();

        function onLoadComplete() {
            console.log('onLoadComplete');

            _.each(manifest, function (record) {

                var key = record[0], image = record[1];
                var template;

                if (typeof image == "string") { // single image for sprite
                    console.log('image path', image);
                    template = function () {
                        return PIXI.Texture.fromImage(image);
                    };

                } else { // multiple versions of sprite

                    template = {};
                    _.each(image, function (path, variant) {
                        template[variant] = function () {
                            return PIXI.Texture.fromImage(path);
                        }
                    })
                }
                _this.templates[key] = template;

            });

            callback(); // Notify view that context preloaded
        }

        function onLoadProgress(loader) {
            console.log('onLoadProgress', loader);
        }
    },

    // Cache locations to map into 3D plane
    setLocations: function (key, locations) {

        this.locations[key] = locations;

    },

    addObject: function( object, waitOnRender ){

        // Postpone rendering to stage
        if (!waitOnRender) {
            this.stage.addChild(object);
        }

        var uuid = Meteor.uuid();
        this.entities[uuid] = object;

        return {
            id: uuid,
            body: object
        };
    },

    addText: function (x, y, text, styles, options) {
        // Style options
        // http://www.goodboydigital.com/pixijs/docs/classes/Text.html
//            [font] String optional
//        default 'bold 20px Arial' The style and size of the font
//
//            [fill='black'] String | Number optional
//        A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'
//
//            [align='left'] String optional
//        Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
//
//            [stroke] String | Number optional
//        A canvas fillstyle that will be used on the text stroke e.g 'blue', '#FCFF00'
//
//            [strokeThickness=0] Number optional
//        A number that represents the thickness of the stroke. Default is 0 (no stroke)
//
//        [wordWrap=false] Boolean optional
//        Indicates if word wrap should be used
//
//            [wordWrapWidth=100] Number optional
//        The width at which text will wrap, it needs wordWrap to be set to true

        var textObject = new PIXI.Text( text, styles || null );
        textObject.position.x = x;
        textObject.position.y = (styles.fontSize) ? y-styles.fontSize*0.6 : y;

        textObject.visible = (typeof options.visible=='undefined') ? true : options.visible;

        return this.addObject(textObject);
    },

    addRectangle: function (x, y, width, height, strokeColor, fillColor, options) {
        var graphics = new PIXI.Graphics();

        if (fillColor) graphics.beginFill(fillColor);
        if (strokeColor) graphics.lineStyle(1, strokeColor);
        graphics.drawRect(x, y, width, height);

        this.setDefaultProperties(graphics, null, null, options||{});

        return this.addObject(graphics);
    },

    addCircle: function (x, y, radius, strokeColor, fillColor, options) {
        var graphics = new PIXI.Graphics();

        if (fillColor) graphics.beginFill(fillColor);
        if (strokeColor) graphics.lineStyle(1, strokeColor);
        graphics.drawCircle(x, y, radius);

        this.setDefaultProperties(graphics, null, null, options||{});

        return this.addObject(graphics);
    },

    addGroup: function (x, y, bodies, options) {
        var container = new PIXI.DisplayObjectContainer();

        this.setDefaultProperties(container, x, y, options||{});

        if (typeof bodies === 'object' && bodies.length > 0) {
            _.each(bodies, function (body) {
                container.addChild(body);
            })
        }

        return this.addObject(container);
    },

    addChildToGroup: function (id, body) {
        var group = this.getEntity(id);

        //_.each(bodies, function( body ){
        group.addChild(body);
        // TODO add body's mask to group, if not child of group yet
//        if (body._mask) group.addChild(body._mask);
        //})
    },

    removeBody: function (id) {
        this.entities[id].parent.removeChild(this.entities[id]);
        delete this.entities[id];
    },

    addBody: function (x, y, key, options) {
        var self = this;
        var body;

        if (options.frames) { // create moveClip

            var frames = [];
            _.each(this.templates[key],function( frame ){
                frames.push(frame());
            });
            body = new PIXI.MovieClip(frames);
            body.gotoAndStop(options.currentFrame);

        } else { //create static sprite
            body = (options.variant) ? this.templates[key][options.variant]() : this.templates[key]();
            body = new PIXI.Sprite(body);
        }

        this.setDefaultProperties(body, x, y, options||{});

        body.anchor.x = 0.5;
        body.anchor.y = 0.5;

        console.log('new sprite', body);

        //requestAnimationFrame(this.animate.bind(self));

        return this.addObject(body);
    },

    setDefaultProperties: function (body, x, y, options) {

        if (x!==null) body.position.x = x;
        if (y!==null) body.position.y = y;

        if (options.scale) {
            body.scale.x = body.scale.x * options.scale;
            body.scale.y = body.scale.y * options.scale;
        }

        if (options.rotation)
            body.rotation = options.rotation;

        body.visible = (typeof options.visible=='undefined') ? true : options.visible;
    },

    addMask: function (shape, x, y, size) {

        // Mask relative to body's parent

        var mask = new PIXI.Graphics();
        mask.beginFill();

        if (shape == 'circle') {
            mask.drawCircle(x,y, size);
        } else if (shape == 'rectangle') {
            mask.drawRect(x, y, size[0], size[1]);
        }

        mask.endFill();

        return this.addObject(mask, true);
    },

    //http://www.goodboydigital.com/pixi-js-brings-canvas-and-webgl-masking/
    maskBody: function (body, mask) {

        body.parent.addChild(mask);
        body.mask = mask;
    },

    updateBodyDirect: function (body, attributes) {

        var entity = this.entities[body.id];

        _.each(attributes, function (values, key) {

            if (typeof values === 'object') {
                // only for 'position'
                _.each(values, function (v, k) {

                    entity[key][k] = v;

                });
            } else {
                entity[key] = values;
            }


        });

    },

    getEntity: function (id) {
        return this.entities[id];
    },

    updateBody: function (body, callback) {

        var entity = this.entities[body.id];

        var timelineOptions = { paused:true };
//        if (body.onComplete!==null) {
//            timelineOptions.onComplete = function() {
//                body.onComplete();
//                body.onComplete = null;
//            };
//        }
        if (callback) {
            timelineOptions.onComplete = callback;
        }


        var timeline = new TimelineLite(timelineOptions);
        //console.log('updateBody', entity, body);



        if (body.animations.length > 0) {

            _.each(body.animations, function (animation) {

                var attribute = animation[0], values = animation[1],
                    duration = animation[2], options=animation[3];
                //console.log(entity[attribute],values);

                if (duration == 0) {

                    if (typeof values === 'object') {
                        // only for 'position'
                        _.each(values, function (v, k) {

                            entity[attribute][k] = v;

                        });
                    } else {
                        entity[attribute] = values;
                    }

                } else {
                    console.log('tweening',attribute, duration, values);

                    if (typeof values === 'object') {

                        values['ease'] = 'Linear.easeNone';

                        // i.e. position
                        if (options){
                            if (options.parallel) TweenLite.to(entity[attribute], duration, values)
                        } else {
                            timeline.add( TweenLite.to(entity[attribute], duration, values) );
                        }

                    } else {
                        // i.e. alpha, rotation
                        var obj = {};
                        obj[attribute]=values;
                        obj['ease'] = 'Linear.easeNone';

                        if (options){
                            if (options.parallel) TweenLite.to(entity, duration, obj);
                        } else {
                            timeline.add( TweenLite.to(entity, duration, obj) );
                        }
                    }


                }
            });

            body.animations = [];
        }

        return timeline;
    },

    animate: function () {

        this.renderer.render(this.stage);

        //requestAnimationFrame(this.animate);
    },

    runAnimation: function (animation) {

        var timeline = new TimelineLite({ onStart: addListener, onComplete: removeListener });

        animation();
        //timeline.play();


        function addListener() {
            //TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
        }

        function removeListener() {

            //TweenLite.ticker.removeEventListener("tick", this.animate.bind(this));
        }

    }

};


//function render() {
//
//    // Render our three.js scene and camera
//
//    renderer.render( scene, camera );
//
//}
