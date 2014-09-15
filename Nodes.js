/**
 * Created by michaelgarrido on 8/28/14.
 */
// lowest level translator between game state reactive data and rendered bodies

// NodeMatrix query object
// like jQuery object, allows chaining queries
// http://www.elijahmanor.com/jquery-object-quacks-like-an-array-duck/

_Q = function (nodes) {
    var _this = this;

    this.length = nodes.length;
    this.splice = [].splice;
    _.each(nodes, function (node, index) {
        _this[index] = node;
    });

    this.prevContext = nodes;

    return this;
}

_Q.prototype.find = function (_class, state) {

    var nodes = [];

    _.each(this.prevContext, function (node) {
        if (node.classes.indexOf(_class) != -1) nodes.push(node);
    });

    return new _Q(nodes);
};

NodeMatrix = {
    nodes: [],
    query: function (_class, state) {
        var nodes = [];

        _.each(this.nodes, function (node) {
            if (node.classes.indexOf(_class) != -1) nodes.push(node);
        });

        return new _Q(nodes);
    }
};

/*
 * Node is a translation layer between rendered bodies and live data
 * (Mongo collections, streams, UI events)
 *
 * Register event listeners on nodes,
 * event (+ data) triggers manipulation of rendered bodies*/

Node = (function () {

    var Node = function(classes, id) {


        this.uuid = Meteor.hashid();
        //this.id = id || null;
        //this.classes = classes || [];

        this.state = {}; // properties get and set by game master

        this.links = {}; // stored procedures for node traversal

        // associations with other nodes
        this.guests = [];
        this.hosts = [];

        this.children = [];
        this.parents = [];
        this.siblings = [];

        //this.behaviors = {}; // trigger animations of bodies
        this._methods = {};

        this.bodies = {}; // visual representations
        this.locations = {};

        this.tags = [];

        this.world = null;

        //NodeMatrix.nodes.push(this);

        console.log(this);
    }


    //_.extend(Node.prototype, {
    Node.prototype = {
        methods: function (methods) {
            _.extend(this._methods, methods);
        },

        call: function (key, args) {
            if (this._methods[key]) return this._methods[key].call(this, args);
        },
        apply: function (key, args) {
            if (this._methods[key]) return this._methods[key].apply(this, args);
        },

        addTag: function (tag) {
            this.tags.push(tag);
        },
        addTags: function (tags) {
            _.each(tags, this.addTag);
        },

        hasTag: function (tag) {
            return this.tags.indexOf(tag)!=-1;
        },
        hasTags: function (tags) {
            var self = this;
            var matches = _.filter(tags, function(tag){ return self.hasTag(tag); });
            return matches.length===tags.length;
        },

        bodiesWithTag: function (tag) {
            return _.filter( this.bodies, function(body) {
                return body.hasTag(tag);
            });
        },
        bodiesWithTags: function (tags) {
            return _.filter( this.bodies, function(body) {
                return body.hasTags(tags);
            });
        },

        addBody: function(body){
            // give body a unique id
            var uuid = Meteor.uuid();
            this.bodies[uuid] = body;

            return uuid;
        },
        setBody: function (key, body) {
            this.bodies[key] = body;
        },
        removeBody: function (key) {
            var self = this;
            var match = this.bodies[key];

            // Find all references to body
            var keys = [];
            _.each(this.bodies, function(body,key){
                if (body==match) keys.push(key);
            });

            match.remove();

            _.each(keys,function(key){
                delete self.bodies[key];
            });

        },

        body: function (key) {
            return this.bodies[key];
        },
        setLocation: function (key, x, y) {
            this.locations[key] = [x, y];
        },
        location: function (key) {
            return this.locations[key];
        },
        locationToPoint: function (key) {
            return Layout.arrayToPoint(this.locations[key]);
        },


        bindUI: function(){

            // hitarea, gesture, action

        },

        bindEvent: function(){

            // channel, attribute, action
        }
    };
    //});


//    Node.prototype.addClass = function (_class) {
//        this.classes = _.union((typeof _class == 'string') ? [_class] : _class, this.classes);
//
//        return this;
//    };
//
//    Node.prototype.addChild = function (node) {
//        if (this.children.indexOf(node) == -1) this.children.push(node);
//        if (node.parents.indexOf(this) == -1) node.addParent(this);
//
//        return this;
//    };
//
//    Node.prototype.addParent = function (node) {
//        if (this.parents.indexOf(node) == -1) this.parents.push(node);
//        if (node.children.indexOf(this) == -1) node.addChild(this);
//
//        return this;
//    };
//
//    Node.prototype.findClass = function (association, _class) {
//
//        var result = [];
//
//        _.each(this[association], function (node) {
//            if (node.classes.indexOf(_class) != -1) result.push(node);
//        });
//
//        return result;
//    };
//
//    Node.prototype.destroy = function () {
//        // Remove from all associations
//        // Remove all bodies from contexts
//    }
//
//
//    Node.prototype.setLink = function (key, query) {
//        this.links[key] = query;
//    };
//
//
//
//    Node.prototype.setState = function (key, value) {
//        this.state[key] = value;
//    };
//    Node.prototype.getState = function (key) {
//        return this.state[key];
//    };

    return Node;

})();