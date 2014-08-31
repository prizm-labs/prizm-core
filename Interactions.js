/**
 * Created by michaelgarrido on 8/28/14.
 */

console.log('hammer internal',Hammer);

UIManager = (function(){



    function UIManager( factory, DOMSelector ){

        // Create sprites that will receive touch events
        this.targets = {};
        this.factory = factory; // Pixi 2D context
        this.DOMAnchor = document.getElementById(DOMSelector);

        var screen = document.querySelector(".device-screen");
        var el = this.DOMAnchor;

//        var START_X = Math.round((screen.offsetWidth - el.offsetWidth) / 2);
//        var START_Y = Math.round((screen.offsetHeight - el.offsetHeight) / 2);
//
//        var ticking = false;
//        var transform;
//        var timer;

        var mc = new Hammer.Manager(el);

        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

        mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        mc.add(new Hammer.Tap());

        mc.on("panstart panmove", onPan);
        mc.on("rotatestart rotatemove", onRotate);
        mc.on("pinchstart pinchmove", onPinch);
        mc.on("swipe", onSwipe);
        mc.on("tap", onTap);
        mc.on("doubletap", onDoubleTap);

        mc.on("hammer.input", function(ev) {


            if (ev.isFinal) {
                //resetElement();
                console.log('hammer input final',ev);
            } else {
                console.log('hammer input',ev);
            }
        });

    }

    function onPan( event ){

    }

    function onRotate( event ){

    }

    function onPinch( event ){

    }

    function onSwipe( event ){

    }

    function onTap( event ){

    }

    function onDoubleTap( event ){

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