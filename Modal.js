/**
 * Created by michaelgarrido on 9/23/14.
 */

ModalNode = function (){
    Node.call(this);
};

ModalNode.prototype = Object.create(Node.prototype);

console.dir(ModalNode);

_.extend( ModalNode.prototype, {

    init: function (width, height, backdropOpacity, backdropColor, ctx, world) {

        console.log('ModalNode init',this);

        this.world = world;
        this.ctx = ctx;

        this.state['backdropOpacity'] = backdropOpacity;

        var rootContainer = this.world.view.factory.makeGroup2D(ctx,
            [0,0]);
        rootContainer.hide();
        this.setBody('root',rootContainer);

        var backdrop =  this.world.view.factory.makeShape2D(ctx, 'rectangle',
            [0,0],{ height:height, width:width, fillColor:backdropColor } );
        rootContainer.addChild(backdrop);
        backdrop.hide();
        backdrop.fade(0);
        this.setBody('backdrop',backdrop);

        var objectContainer = this.world.view.factory.makeGroup2D(ctx,
            [width/2,height/2]);
        rootContainer.addChild(objectContainer);
        objectContainer.hide();
        objectContainer.fade(0);
        this.setBody('container',objectContainer);
    },

    prepare: function(presentMode, resignMode, renderAction, onPresent, onResign) {

        this.state['presentMode'] = presentMode;
        renderAction.call(this);

        if (onPresent) this.state['onPresent'] = onPresent.bind(this);
        if (onResign) this.state['onResign'] = onResign.bind(this);
    },

    present: function(){

        this.body('root').show();

        this.body('backdrop').show();
        this.body('backdrop').fade(this.state['backdropOpacity']);

        this.body('container').show();
        this.body('container').fade(1);

        // Slide in from: Top, Bottom, Left, Right

        // Grow from center

        // Fade in

        // Instant show

        if (this.state['onPresent']) this.state['onPresent']();
    },

    resign: function(){

        this.body('backdrop').fade(0);
        this.body('backdrop').show();

        this.body('container').fade(0);
        this.body('container').show();

        this.body('root').hide();

        // Slide out to: Top, Bottom, Left, Right

        // Shrink into center

        // Fade out

        // Instant hide

        if (this.state['onResign']) this.state['onResign']();
    }
});