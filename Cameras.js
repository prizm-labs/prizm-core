/**
 * Created by michaelgarrido on 8/31/14.
 */
CameraManager = (function(){

    function CameraManager( camera ){

        this.camera = camera;
        this.views = {};
    }

    CameraManager.prototype = {

        registerView: function (key, duration, positionX, positionY, positionZ, rotationX, rotationY, rotationZ) {

            var _this = this;

            this.views[key] = function () {

//        _this.camera.place( positionX, positionY, positionZ, 0 );
//        _this.camera.rotate( rotationX, rotationY, rotationZ, 0 );
                _this.camera.registerAnimation('position', {x: positionX, y: positionY, z: positionZ}, duration);
                _this.camera.registerAnimation('rotation', {x: rotationX, y: rotationY, z: rotationZ}, duration);

                _this.camera.runAnimations();
            }

        },

        setView: function (key) {

            this.views[key]();

        }
    };


    return CameraManager;

})();