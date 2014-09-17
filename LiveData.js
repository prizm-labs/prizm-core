/**
 * Created by michaelgarrido on 9/2/14.
 */
LiveDataDelegate = function () {

    function LiveDataDelegate() {

        // bind collection (or document) to reactive object
        //i.e. Node document on server to Body2D on client

        // with a translate function: position in 2D context


        this.currentStream = null;
        this.streams = {};

        this.subscriptions = {};

        this.players = {};
    }

    LiveDataDelegate.prototype = {


        setupStream: function (streamId) {

            var stream = new Meteor.Stream(streamId);
            this.streams[streamId] = stream;
        },

        activateStream: function (streamId) {

            if (this.streams[streamId]) this.currentStream = this.streams[streamId];
        },

        addTrigger: function(event, action){

            this.currentStream.on(event,action);
        },

        mapCallerToPlayer: function( subscriptionId, userId ){
            players[subscriptionId] = userId;
        },

        setPermissions: function () {

            if (Meteor.isServer) {
                // Permissions
                this.currentStream.permissions.read(function () {
                    return true;
                });
                this.currentStream.permissions.write(function () {
                    return true;
                });
            }
        },

        addFilter: function (event, filterAction) {

            if(Meteor.isServer) {
                // Filters
                this.currentStream.addFilter(function(eventName, args){
                    return args;
                });
            }
        },

        broadcast: function (event, data) {

            this.currentStream.emit(event, data);
        },

        registerSubscription: function (collection, id, translation) {

            this.subscriptions[collection + id] = translation;

        },

        updateSubscriptions: function (ddpMsg) {

            //console.log('updateSubscriptions',ddpMsg);
            //if id matches subscription, call translation
            // ex:  { "msg":"changed",
            // "collection":"nodes",
            // "id":"qwiyKk5SFwZG9E4ca",
            // "fields":{"x":200,"y":200}}

            if (this.subscriptions[ddpMsg.collection + ddpMsg.id]) this.subscriptions[ddpMsg.collection + ddpMsg.id](ddpMsg.fields);

        }

    }

    return LiveDataDelegate;
}();