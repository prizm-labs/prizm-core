/**
 * Created by michaelgarrido on 8/28/14.
 */

UIManager = (function(){



function UIManager( factory ){

    // Create sprites that will receive touch events
    this.targets = {};
    this.factory = factory; // Pixi 2D co
}

    UIManager.prototype.bindStageTarget = function( ctxKey ){

    var stage = this.factory.contexts[ctxKey].stage;
    var touchActive = false;

    stage.mousedown =  stage.touchstart = function(data)
    {
        touchActive = true;
        console.log('touchstart',data);
    }

    stage.mousemove = stage.touchmove = function(data)
    {
        if (touchActive) console.log('touchmove',data);
    }

    stage.mouseup = stage.touchend = function(data)
    {
        touchActive = false;
        console.log('touchend',data);
    }


    this.targets['stage'] = stage;
}

    UIManager.prototype.addTarget = function( ctxKey, options ){

}

    return UIManager;
})();