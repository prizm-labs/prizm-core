/**
 * Created by michaelgarrido on 8/28/14.
 */
UIManager = (function () {


    function UIManager(factory, DOMAnchorId) {

        var _this = this;

        // Create sprites that will receive touch events

        this.targets = {
            byId: {},
            active: [],
            all: []
        };

        this.activeTarget = null;

        this.targetGroups = {};

        this.factory = factory; // Pixi 2D context
        this.DOMAnchor = document.getElementById(DOMAnchorId);

        console.log('Hammer DOMAnchor', this.DOMAnchor);

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

        mc.on("panstart panmove panend", this.onPan.bind(this));
        mc.on("rotatestart rotatemove rotateend", this.onRotate.bind(this));
        mc.on("pinchstart pinchmove pinchend", this.onPinch.bind(this));
        mc.on("swipe", this.onSwipe.bind(this));
        mc.on("tap", this.onTap.bind(this));
        mc.on("doubletap", this.onDoubleTap.bind(this));

        mc.on("hammer.input", function (event) {
            console.log('hammer input', event);

            // Set active target?

            if (_this.activeTarget == null) {

                var activeTarget = _this.checkForActivePoint(event.center.x, event.center.y);

                if (activeTarget) _this.activeTarget = activeTarget;
                console.log('activeTarget', _this.activeTarget);
            }

//            if (ev.isFinal) {
//                //resetElement();
//                console.log('hammer input final',ev);
//            } else {
//                console.log('hammer input',ev);
//            }
        });

    }

    UIManager.prototype = {

        onPan: function (event) {
            var phase;

            switch (event.type) {
                case 'panstart':
                    phase = 'start';
                    break;
                case 'panmove':
                    phase = 'update';
                    break;
                case 'panend':
                    phase = 'stop';
                    break;
            }

            this.onEvent('pan', phase, event);
        },

        onRotate: function (event) {

        },

        onPinch: function (event) {

        },

        onSwipe: function (event) {

        },

        onTap: function (event) {
            var phase;

            switch (event.type) {
                case 'tap':
                    phase = 'stop';
                    break;

            }

            this.onEvent('tap', phase, event);
        },

        onDoubleTap: function (event) {

        },

        onEvent: function (eventType, phase, event) {

            if (this.activeTarget != null) {

                var behavior = this.activeTarget.behaviors[eventType] || null;

                if (behavior != null) {

                    switch (phase) {
                        case 'start':
                            if (behavior.onStart != null) this.activeTarget.behaviors[eventType].onStart(event);
                            break;
                        case 'update':
                            if (behavior.onUpdate != null) this.activeTarget.behaviors[eventType].onUpdate(event);
                            break;
                        case 'stop':
                            if (behavior.onStop != null) this.activeTarget.behaviors[eventType].onStop(event);
                            this.activeTarget = null;
                            break;
                    }
                }
            }
        }
    };


    UIManager.prototype.checkForActivePoint = function (x, y) {


        var activeTarget = null;

        _.each(this.targets.active, function (target) {
            if (target.containsPoint(x, y)) activeTarget = target;
            return;
        });

        return activeTarget;
    };


    UIManager.prototype.bindStageTarget = function (ctxKey) {

        var stage = this.factory.contexts[ctxKey].stage;
        //this.addTarget( ctxKey, 'stage', stage );
    };

    // Add hit area

    // Bound to button

    // Bound to sprite


    // Activate hit area

    // Deactivate hit area


    // Move or scale hit area

    UIManager.prototype.addBoxTarget = function (x, y, width, height, ctxKey, groupKey) {

        var newTarget = new BoxTarget(x, y, width, height, this.factory.contexts[ctxKey], this);

        this.targets.all.push(newTarget);

        return newTarget;
    };


    UIManager.prototype.setTargetGroup = function (groupKey, targets) {
        var _this = this;
        if (typeof this.targetGroups[groupKey] == "undefined") this.targetGroups[groupKey] = [];
        _.each(targets, function (target) {
            _this.targetGroups[groupKey].push(target);
        });

    }


    UIManager.prototype.checkEventOrigin = function () {

        // Is point contained by an active target?

    }


    UIManager.prototype.addRelativeTarget = function (ctxKey, targetKey, target) {

        // Map hit area for bound target

        // Check event inside hit area

        // Update position

    };

    UIManager.prototype.addFixedTarget = function (ctxKey, targetKey, target) {


    };

    return UIManager;
})();

function BoxTarget(x, y, width, height, context2D, manager) {

    //console.log('BoxTarget',context2D);
    this.manager = manager;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.active = false;

    this.context = context2D;
    this.graphics = null;

    this.behaviors = {
        tap: null,
        pinch: null,
        rotate: null,
        swipe: null,
        tap: null,
        doubleTap: null
    };


    // generate corners to evaluate contained point
    this.corners = [];

    this.corners.push([x, y], [x + width, y], [x, y + height], [x + width, y + height]);
}

BoxTarget.prototype = {

    containsPoint: function (x, y) {
        return !(x < this.corners[0][0] || x > this.corners[3][0]
            || y < this.corners[0][1] || y > this.corners[3][1] );
    },

    activate: function () {
        this.graphics = this.context.addRectangle(this.x, this.y, this.width, this.height);
        this.active = true;

        this.manager.targets.active.push(this);
    },

    deactivate: function () {
        this.context.removeBody(this.graphics);
        this.active = false;

        this.manager.targets.active = _.without(this.manager.targets.active, this);
        console.log('targets after deactivation', this.manager.targets.active);
    },

    setBehavior: function (eventType, onStart, onUpdate, onStop) {

        this.behaviors[eventType] = new Behavior(onStart, onUpdate, onStop);

    }
};


function Behavior(onStart, onUpdate, onStop) {

    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onStop = onStop;
}

Behavior.prototype = {

};


function EventTargetGroup(key, targets) {

    this.targets = targets;
    this.active = false;

}