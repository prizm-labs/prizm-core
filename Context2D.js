Context2D = function( DOMElementId, renderType, height, width ) {

    this.config = {
        type: renderType,
        height: height,
        width: width
    };
    this.DOMAnchor = document.getElementById( DOMElementId );

    this.renderer = null;
    this.stage = null;

    this.entities = [];
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

    addBody: function( x, y ){
        console.log('addEntities',x,y);

        var self = this;

        var texture = PIXI.Texture.fromImage("img/location-valid.png");
        var body = new PIXI.Sprite(texture);

        body.position.x = x;
        body.position.y = y;

//        bunny.scale.x = 2;
//        bunny.scale.y = 2;

        this.stage.addChild(body);

        requestAnimationFrame(this.animate.bind(self));

        this.entities.push(body);

        return this.entities.length-1;
    },

    moveBody: function( body ){



        console.log('moveEntity', this.entities[body.id]);
        var entity = this.entities[body.id];


        this.runAnimation(function(){
            TweenLite.to(entity.position, 2, {x:body.x,y:body.y});
        })

    },

    animate: function(){
        //console.log('animate');
        //bunny.rotation += 0.01;

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
