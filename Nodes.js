/**
 * Created by michaelgarrido on 8/28/14.
 */
// lowest level translator between game state reactive data and rendered bodies


_Q = function( nodes ){
    var _this = this;

    this.length = nodes.length;
    this.splice = [].splice;
    _.each(nodes, function(node, index){
       _this[index] = node;
    });

    this.prevContext = nodes;

    return this;
}

_Q.prototype.find = function( _class, state ){

    var nodes = [];

    _.each( this.prevContext, function( node ){
        if ( node.classes.indexOf(_class) != -1) nodes.push(node);
    });

    return new _Q(nodes);
};

NodeMatrix = {
    nodes: [],
    query: function( _class, state ){
        var nodes = [];

        _.each( this.nodes, function( node ){
            if ( node.classes.indexOf(_class) != -1) nodes.push(node);
        });

        return new _Q(nodes);
    }
};

Node = (function(){

    function Node( classes, id ){


        this.uuid = Meteor.hashid();
        this.id = id || null;
        this.classes = classes || [];

        this.state = {}; // properties get and set by game master

        this.links = {}; // stored procedures for node traversal

        // associations with other nodes
        this.guests = [];
        this.hosts = [];

        this.children = [];
        this.parents = [];
        this.siblings = [];

        this.behaviors = {}; // trigger animations of bodies

        this.bodies = {}; // visual representations

        NodeMatrix.nodes.push(this);
    }

    Node.prototype.addClass = function( _class ) {
        this.classes = _.union((typeof _class=='string') ? [_class] : _class, this.classes);

        return this;
    };

    Node.prototype.addChild = function( node ) {
        if (this.children.indexOf(node)==-1) this.children.push(node);
        if (node.parents.indexOf(this)==-1) node.addParent(this);

        return this;
    };

    Node.prototype.addParent = function( node ) {
        if (this.parents.indexOf(node)==-1) this.parents.push(node);
        if (node.children.indexOf(this)==-1) node.addChild(this);

        return this;
    };

    Node.prototype.findClass = function( association, _class ) {

        var result = [];

        _.each( this[association], function( node ){
            if ( node.classes.indexOf(_class) != -1) result.push(node);
        });

        return result;
    };


    Node.prototype.setLink = function( key, query ){
        this.links[key] = query;
    };

    Node.prototype.addBody = function( key, body ){
        this.bodies[key] = body;
    };

    Node.prototype.setState = function( key, value ){
        this.state[key] = value;
    };
    Node.prototype.getState = function( key ){
        return this.state[key];
    };

    return Node;

})();