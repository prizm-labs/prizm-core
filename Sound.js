/**
 * Created by michaelgarrido on 8/29/14.
 */

SoundManager = (function(){
    function SoundManager() {
        this.sounds = {};
        this.groups = {};


    }

    SoundManager.prototype.loadGroup = function( groupKey, manifest ){
        var _this = this;
        var groupCache = [];
        _.each(manifest, function( entry ){
            var newSound = new buzz.sound( entry[1], { formats: entry[2], autoplay: false, preload: false, loop: false } );
            _this.sounds[entry[0]] = newSound;
            groupCache.push( newSound );
        });

        this.groups[groupKey] = new buzz.group( groupCache );

        this.groups[groupKey].bind("loadstart", function(e) {
            //console.log('start load sounds', this, e);
        }).bind("progress", function(e) {
            //console.log('progress load sounds', this, e);
        }).bind("loadeddata", function(e) {
            //console.log('complete load sounds', this, e);
        }).bind("error", function(e) {
            //console.log('error load sounds', this, e);
        }).load();
    };

    return SoundManager;
})();