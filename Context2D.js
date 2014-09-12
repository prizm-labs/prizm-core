Context2D = function( DOMElementId, renderType, width, height ) {

    this.config = {
        type: renderType,
        height: height,
        width: width
    };
    this.DOMAnchor = document.getElementById( DOMElementId );

    this.templates = {};

    this.renderer = null;
    this.stage = null;

    //this.entities = [];
    this.entities = {};

    this.locations = {};


};

Context2D.prototype = {

    init: function( isBackgroundTransparent ) {

        var self = this;

        if (this.config.type=='canvas') {

            this.renderer = new PIXI.CanvasRenderer(
                this.config.width, this.config.height,
                null, isBackgroundTransparent||null);
            // Allow transparent background

        } else if (this.config.type=='webgl') {
            this.renderer = new PIXI.WebGLRenderer(this.config.width, this.config.height, null, true);
        }

        this.DOMAnchor.appendChild(this.renderer.view);

        this.stage = new PIXI.Stage();
        //this.stage = new PIXI.Stage(0x3da8bb, true);

        //requestAnimationFrame(this.animate.bind(self));

        TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
    },

    setBackgroundColor: function( color ){
        console.log('setBackgroundColor',color);
        if (typeof color === 'string') {
            color = parseInt(color.replace(/^#/, ''), 16);
        }
        console.log('color converter to hex',color);
        this.stage.setBackgroundColor(color);
        this.animate();
    },

    load: function( file, manifest, callback, isCrossOrigin ){

        console.log('2D load', file, manifest);
        var _this = this;

        isCrossOrigin = isCrossOrigin || false;

        var assetsToLoader = (typeof file== "string") ? [file] : file;
        var loader = new PIXI.AssetLoader(assetsToLoader, isCrossOrigin);
        loader.onProgress = onLoadProgress;
        loader.onComplete = onLoadComplete;
        loader.load();

        function onLoadComplete() {
            console.log('onLoadComplete');

            _.each(manifest, function( record ){

                var key = record[0], image = record[1];
                var template;

                if (typeof image == "string") { // single image for sprite
                    console.log('image path',image);
                    template = function(){
                        return new PIXI.Sprite(PIXI.Texture.fromImage(image));
                    };

                } else { // multiple versions of sprite

                    template = {};
                    _.each( image, function( path, variant ){
                        template[variant] = function(){
                            return new PIXI.Sprite(PIXI.Texture.fromImage(path));
                        }
                    })
                }
                _this.templates[key] = template;

            });

            callback(); // Notify view that context preloaded
        }

        function onLoadProgress( loader ) {
            console.log('onLoadProgress', loader);
        }
    },

    // Cache locations to map into 3D plane
    setLocations: function( key, locations ){

        this.locations[key] = locations;

    },

    addRectangle: function( x, y, width, height ){
        var graphics = new PIXI.Graphics();

        //graphics.beginFill(0xFFFF00);

// set the line style to have a width of 5 and set the color to red
        graphics.lineStyle(1, 0xFF0000);

// draw a rectangle
        graphics.drawRect( x, y, width, height );

        this.stage.addChild(graphics);

        return graphics;
    },

    removeBody: function( body ){

        this.stage.removeChild( body );

    },

    addGroup: function( x, y, bodies ){
        var container = new PIXI.DisplayObjectContainer();

        container.position.x = x;
        container.position.y = y;

        if (typeof bodies==='object'&&bodies.length>0){
            _.each(bodies, function(body){
                container.addChild(body);
            })
        }

        this.stage.addChild(container);

        var uuid = Meteor.uuid();
        this.entities[uuid]=container;

        return uuid;
    },

    addChildToGroup: function( id, body ){
        var group = this.getEntity(id);
        //_.each(bodies, function( body ){
            group.addChild(body);
        //})
    },

    addBody: function( x, y, key, options ){
        var self = this;

        var body = (options.variant) ? this.templates[key][options.variant]() : this.templates[key]();

        body.position.x = x;
        body.position.y = y;

        if (options.scale){
            body.scale.x = body.scale.x*options.scale;
            body.scale.y = body.scale.y*options.scale;
        }

        if (options.rotation)
            body.rotation = options.rotation;

        body.anchor.x = 0.5;
        body.anchor.y = 0.5;


        this.stage.addChild(body);

        console.log('sprite bounds',body.getLocalBounds());
//        var graphics = new PIXI.Graphics();
//
//        //graphics.beginFill(0xFFFF00);
//
//// set the line style to have a width of 5 and set the color to red
//        graphics.lineStyle(1, 0xFF0000);
//
//// draw a rectangle
//        graphics.drawRect( x, y, width, height );
//
//        this.stage.addChild(graphics);
//
        requestAnimationFrame(this.animate.bind(self));

        //Create UUID for a PixiJS Sprite
        var uuid = Meteor.uuid();
        this.entities[uuid]=body;
        return uuid;
    },

    //http://www.goodboydigital.com/pixi-js-brings-canvas-and-webgl-masking/
    maskBody: function( body, maskOptions ){

        //{ shape: "circle", position: {x:0,y:0}, size: 10}

        var mask = new PIXI.Graphics();
        mask.beginFill();

        if (maskOptions.shape=='circle'){
            mask.drawCircle( maskOptions.position.x,
                maskOptions.position.y, maskOptions.size);
        } else if (maskOptions.shape=='rectangle') {

        }

        mask.endFill();

        this.stage.addChild(mask);

        // the magic line!
        body.mask = mask;

    },

//    moveBody: function( body ){
//
//        //console.log('moveEntity', this.entities[body.id]);
//        var entity = this.entities[body.id];
//        var duration = body.duration;
//
//        if (duration==0) {
//            entity.position = {x:body.x,y:body.y};
//        } else {
//            this.runAnimation(function(){
//                TweenLite.to(entity.position, duration, {x:body.x,y:body.y});
//            })
//        }
//    },

    updateBodyDirect: function( body, attributes ){

        var entity = this.entities[body.id];

        _.each( attributes, function( values, key ){

            if (typeof values === 'object') {
                // only for 'position'
                _.each( values, function( v, k ){

                    entity[key][k] = v;

                });
            } else {
                entity[key] = values;
            }



        });

    },

    getEntity: function( id ){
        return this.entities[id];
    },

    updateBody: function( body ){

        var entity = this.entities[body.id];
        //console.log('updateBody', entity, body);

        if (body.animations.length>0){

            _.each( body.animations, function( animation ){

                var attribute = animation[0], values = animation[1], duration = animation[2];

                if (duration==0) {
                    _.each(values, function(value,key){
                        entity[attribute][key] = value;
                    });

                    //console.log(entity[attribute]);
                } else {
                    TweenLite.to(entity[attribute], duration, values );
                }
            });

            body.animations = [];
        }
    },

    animate: function(){

        this.renderer.render(this.stage);

        //requestAnimationFrame(this.animate);
    },

    runAnimation: function(animation){

        var timeline = new TimelineLite({ onStart: addListener, onComplete: removeListener });

        animation();
        //timeline.play();


        function addListener(){
            //TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
        }

        function removeListener(){

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
