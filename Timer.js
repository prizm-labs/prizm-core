/**
 * Created by michaelgarrido on 9/23/14.
 */

TimerNode = function (){
    Node.call(this);

    this.addTag('timer');
};

TimerNode.prototype = Object.create(Node.prototype);

console.dir(TimerNode);

_.extend( TimerNode.prototype, {

    init: function (x, y, ctx, world) {

        this.state['currentTime'] = 0;
        this.state['active'] = false;

        this.ctx = ctx;
        this.world = world;


        var container = this.world.view.factory.makeGroup2D( this.ctx,
            { x: x, y: y });
        this.setBody('container', container);
    },

    renderNumber: function(type) {


        // Assuming number is seconds
        this.state['displayType'] = type;

        // Create number text
        // show max time remaining
        var countdownText = this.world.view.factory.makeBody2D( this.ctx,
            'text', [0,0], { text:this.timeRemainingInSeconds(),
                styles:{
                    font: 'normal 100px Helvetica',
                    fontSize: 100,
                    fill: 'white'
                }});
        countdownText.centerText();
        this.body('container').addChild(countdownText);
        this.setBody('countdownText',countdownText);



        this.configureInternalEvents(
            function(){
                // if (this.state['displayNumber'])
                this.body('countdownText').setText(this.timeRemainingInSeconds());
            },
            function(){
                this.body('countdownText').setText(this.timeRemainingInSeconds());
            },
            function(){
                this.body('countdownText').setText(this.timeRemainingInSeconds());
            });
    },

    timeRemainingInSeconds: function(){
        return Math.floor( (this.state['maxTime']-this.state['currentTime'])/1000 );
    },

    renderPie: function (radius, progressColor, backgroundColor) {
        var self = this;

        this.state['radius'] = radius;

        // Background B
        var backgroundB = this.createSemiCircle(radius+1,backgroundColor);
        this.setBody('backgroundB',backgroundB);
        this.body('container').addChild(backgroundB);
        backgroundB.rotate(Math.PI);

        // Progress A
        var progressA = this.createSemiCircle(radius,progressColor);
        this.setBody('progressA',progressA);
        this.body('container').addChild(progressA);
        progressA.rotate(Math.PI);

        // Progress B
        var progressB = this.createSemiCircle(radius,progressColor);
        this.setBody('progressB',progressB);
        this.body('container').addChild(progressB);

        // Background A
        var backgroundA = this.createSemiCircle(radius+1,backgroundColor);
        this.setBody('backgroundA',backgroundA);
        this.body('container').addChild(backgroundA);
        backgroundA.hide();
        backgroundA.rotate(Math.PI);

        // Pie mask
        var center = [this.body('container').x,this.body('container').y];
        var mask = self.world.view.factory.makeShape2D( this.ctx, 'circle',
            center,{ radius:radius, fillColor:0xFFFFFF } );
        this.body('container').setMask(mask);


        this.configureInternalEvents(function(){
            //var rotation = Math.PI+progress*(Math.PI);
            this.body('progressA').rotate(2*Math.PI,this.state['maxTime']/2/1000, function(){

                // At halfway point
                // Hide progress A

                //Meteor.setTimeout(function(){
                self.body('progressA').hide();
                self.body('progressA').rotate(0);

                self.body('backgroundA').show();
                self.body('backgroundA').rotate(2*Math.PI,self.state['maxTime']/2/1000, function(){

                    console.log('animation complete!');
                    //self.reset();

                });
                //},self.state['maxTime']/2);

            });
        })
    },

    createSemiCircle: function (radius, fillColor) {
        var self = this;

        var container = this.world.view.factory.makeGroup2D( this.ctx,
            [0,0]);

        var visibleArea =  self.world.view.factory.makeShape2D( this.ctx, 'circle',
            [0,0],{ radius:radius, fillColor:fillColor } );
        container.addChild(visibleArea);

        var mask = self.world.view.factory.makeShape2D( this.ctx, 'rectangle',
            [-radius,-radius],{ width:radius, height:radius*2, fillColor:0xFF0000 } );
        //container.addChild(mask);
        visibleArea.setMask(mask);

        return container;
    },

    configureInterval: function(maximum, delta){
        this.state['maxTime'] = maximum;
        this.state['delta'] = delta;
    },

    configureInternalEvents: function (onStart, onProgress, onComplete) {
        if (onStart) this.state['_onStart'] = onStart.bind(this);
        if (onProgress) this.state['_onProgress'] = onProgress.bind(this);
        if (onComplete) this.state['_onComplete'] = onComplete.bind(this);
    },


    configureEvents: function (onProgress, onComplete) {

        this.state['onProgress'] = onProgress.bind(this);
        this.state['onComplete'] = onComplete.bind(this);
    },

    start: function(){

        var self = this;

        if (this.state['active']) return;

        this.state['active'] = true;


        if (this.state['_onStart']) this.state['_onStart']();
        //self.onProgress();

        this.state['intervalHandle'] = Meteor.setInterval(function(){
            self.onProgress();
        },this.state['delta']);

    },

    onProgress: function(){

        this.state['currentTime'] += this.state['delta'];
        this.state['progress'] = this.state['currentTime']/this.state['maxTime'];

        if (this.state['_onProgress']) this.state['_onProgress'](this.state['progress'],this.state['currentTime'],this.state['delta']);
        if (this.state['onProgress']) this.state['onProgress'](this.state['progress'],this.state['currentTime'],this.state['delta']);

        if (this.state['currentTime'] == this.state['maxTime']) {
            this.onComplete();
        }
    },

    onComplete: function(){

        Meteor.clearInterval(this.state['intervalHandle']);

        //this.reset();

        console.log('internal onComplete',this);

        if (this.state['_onComplete'])this.state['_onComplete']();
        if (this.state['onComplete'])this.state['onComplete']();
    },

    reset: function(){

        // Reset state
        this.state['active'] = false;
        this.state['progress'] = 0;
        this.state['currentTime'] = 0;
        this.state['intervalHandle'] = null;


        // Reset bodies
        this.body('progressA').rotate(Math.PI);
        this.body('progressA').show();

        this.body('backgroundA').hide();
        this.body('backgroundA').rotate(0);
        this.body('backgroundA').rotate(Math.PI);

        console.log('internal reset',this);

    },

    onStart: function(){

    },

    centerRectangleOnCircle: function(radius){

    }

});