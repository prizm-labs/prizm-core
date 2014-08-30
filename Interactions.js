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
        //this.addTarget( ctxKey, 'stage', stage );
    };

    // Add hit area

    // Bound to button

    // Bound to sprite


    // Activate hit area

    // Deactivate hit area


    // Move or scale hit area



    UIManager.prototype.addRelativeTarget = function( ctxKey, targetKey, target ){

        // Map hit area for bound target

        // Check event inside hit area

        // Update position

    };

    UIManager.prototype.addFixedTarget = function( ctxKey, targetKey, target ){


    };

    return UIManager;
})();