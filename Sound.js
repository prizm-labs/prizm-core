/**
 * Created by michaelgarrido on 8/29/14.
 */

SoundManager = (function () {
    function SoundManager() {
        this.sounds = {};
        this.groups = {};

        this.preloadedCount = 0;
    }

    SoundManager.prototype.loadGroup = function (groupKey, manifest, directory) {
        console.log('Sound loadGroup',groupKey, manifest, directory);

        var self = this;
        var groupCache = [];
        _.each(manifest, function (entry) {
            // entry: key, path, formats

            var path = (directory) ? directory+'/'+entry[1] : entry[1];
            var newSound = new buzz.sound(path, { formats: entry[2], autoplay: false, preload: false, loop: false });
            self.sounds[entry[0]] = newSound;
            groupCache.push(newSound);
        });

        this.groups[groupKey] = new buzz.group(groupCache);

        this.groups[groupKey].bind("loadstart", function (e) {
            console.log('start load sounds', this, e);
        }).bind("progress", function (e) {
            //console.log('progress load sounds', this, e);
        }).bind("loadstart", function (e) {
            console.log('loadstart sounds', this, e);
            //amplify.publish('preloadSounds');
        }).bind("loadeddata", function (e) {
            console.log('loadeddata sounds', this, e);
            //amplify.publish('preloadSounds');
        }).bind("loadedmetadata", function (e) {
            console.log('loadedmetadata sounds', this, e);

        }).bind("canplay", function (e) {
            console.log('canplay sounds', this, e);

        }).bind("canplaythrough", function (e) {
            console.log('canplaythrough sounds', this, e);
            self.preloadedCount++;
            console.log(self.preloadedCount+'/'+manifest.length);

            if (self.preloadedCount==manifest.length){
                amplify.publish('preloadComplete','sound');
            }
        }).bind("error", function (e) {
            console.log('error load sounds', this, e);
        }).load();
    };

    return SoundManager;
})();