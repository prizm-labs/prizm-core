Context2D = function( DOMElementId, renderType, height, width ) {

    this.config = {
        type: renderType,
        height: height,
        width: width
    };
    this.DOMAnchor = document.getElementById( DOMElementId );

    this.templates = {};

    this.renderer = null;
    this.stage = null;

    this.entities = [];

    this.locations = {};
};

Context2D.prototype = {

    init: function() {

        var self = this;

        if (this.config.type=='canvas') {
            this.renderer = new PIXI.CanvasRenderer(this.config.width, this.config.height, null, true);
        } else if (this.config.type=='webgl') {
            this.renderer = new PIXI.WebGLRenderer(this.config.width, this.config.height, null, true);
        }

        this.DOMAnchor.appendChild(this.renderer.view);

        this.stage = new PIXI.Stage;

        //requestAnimationFrame(this.animate.bind(self));

        TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
    },

    load: function( file, manifest ){

        console.log('2D load', file, manifest);
        var _this = this;

        var assetsToLoader = [file];
        var loader = new PIXI.AssetLoader(assetsToLoader);
        loader.onProgress = onLoadProgress;
        loader.onComplete = onLoadComplete;
        loader.load();

        function onLoadComplete() {
            console.log('onLoadComplete');

            _.each(manifest, function( record ){

                var key = record[0], image = record[1];
                var template;

                if (typeof image == "string") { // single image for sprite

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

            GameState.set('2D',true);
        }

        function onLoadProgress( loader ) {
            console.log('onLoadProgress', loader);
        }
    },

    // Cache locations to map into 3D plane
    setLocations: function( key, locations ){

        this.locations[key] = locations;

    },

    addBody: function( x, y, key, options ){
        var self = this;

        var body = (options.variant) ? this.templates[key][options.variant]() : this.templates[key]();

        body.position.x = x;
        body.position.y = y;


        this.stage.addChild(body);

        requestAnimationFrame(this.animate.bind(self));

        //TODO create UUID for a PixiJS Sprite
        this.entities.push(body);
        return this.entities.length-1;
    },

    moveBody: function( body ){

        //console.log('moveEntity', this.entities[body.id]);
        var entity = this.entities[body.id];
        var duration = body.duration;

        if (duration==0) {
            entity.position = {x:body.x,y:body.y};
        } else {
            this.runAnimation(function(){
                TweenLite.to(entity.position, duration, {x:body.x,y:body.y});
            })
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
