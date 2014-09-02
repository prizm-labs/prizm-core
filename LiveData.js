/**
 * Created by michaelgarrido on 9/2/14.
 */
LiveDataDelegate = function(){

    function LiveDataDelegate(){

        // bind collection (or document) to reactive object
        //i.e. Node document on server to Body2D on client

        // with a translate function: position in 2D context

        this.subscriptions = {};
    }

    LiveDataDelegate.prototype = {

        registerSubscription: function( collection, id, translation ){

            this.subscriptions[collection+id] = translation;

        },

        updateSubscriptions: function( ddpMsg ){

            console.log('updateSubscriptions',ddpMsg);
            //if id matches subscription, call translation
            // ex:  { "msg":"changed",
            // "collection":"nodes",
            // "id":"qwiyKk5SFwZG9E4ca",
            // "fields":{"x":200,"y":200}}

            if (this.subscriptions[ddpMsg.collection+ddpMsg.id]) this.subscriptions[ddpMsg.collection+ddpMsg.id](ddpMsg.fields);

        }

    }

    return LiveDataDelegate;
}();