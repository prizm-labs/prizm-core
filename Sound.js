/**
 * Created by michaelgarrido on 8/29/14.
 */

SoundManager = (function(){
    function SoundManager() {
        this.sounds = {};
    }

    SoundManager.prototype.load = function( manifest ){
        var _this = this;
        _.each(manifest, function( entry ){
            _this.sounds[entry[0]] = new buzz.sound( entry[1], { formats: entry[2] } );

        });

        console.log('loaded sounds', this);
    };

    return SoundManager;
})();