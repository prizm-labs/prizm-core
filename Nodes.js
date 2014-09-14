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
            if (this._methods[key]) this._methods[key].call(this, args);
        },
        setBody: function (key, body) {
            this.bodies[key] = body;
        },
        body: function (key) {
            return this.bodies[key];
        },
        setLocation: function (key, x, y) {
            this.locations[key] = [x, y];
        },
        location: function (key) {
            return this.locations[key];
        }
    }
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