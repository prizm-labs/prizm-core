Pz = function(){
}

Pz.classes = {};

Pz.classes.Card = "card";

var PostCollection = new Meteor.Collection(null);
var Post = new ReactiveClass(PostCollection);
var post = new Post({name: "My New Post"});

Pz.classes.Post = post;