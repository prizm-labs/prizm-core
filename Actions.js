


function PhaseManager(){
  this.root = null;
  this.activePhase = null;
}

function Phase( key ){
  this.key = key; // internal reference
  this.title = title; // displayed to players

  this.children = [];
  this.parents = [];

  this.views = [];
}


Phase.prototype = {
  enter: function(){
    // create / enable views 
  },

  checkForExit: function(){

  },

  exit: function(){

    
  }
}

// global views, accessible anytime, like looking at your hand or inspecting the board

// contextual views, like when it's your turn to act

function Action(){
  // prompt
  // target(s)
  // resolution

  // draw a card
  // roll dice

}

Action.prototype = {

  enter: function(){

    // show available target(s)

  },

  setTargets: function( targets ){

    // show selected target(s)

  },

  clearTargets: function( ){

    // return to target selection

  },

  confirm: function(){

    // commit action on targets

  }

}

function View(){
  // What UI should be shown/enabled for user to perfrom given action?

  // eventTarget groups
  // behaviors 
  // bodies

  // UIElements

  // camera perspectives
}

function Progression(){
  //cyclical
  //linear

  this.history = [];

  this.iterator = null; // a sequence of actions
}

// enter, setup 


// exit, condition

// setup phase
  //

// StateMachine = function(){}



// Engine = function(){
  
// }

// // Preloader
// // manifest


// Session = function(){
//   this.variant;
//   this.users;
// }


// Phase = function(){
//   this.parent;
//   this.siblings;
//   thia.children;
// }



// Cyclical;
// Linear;

// Factory;

// SprayPaint;
// Plane;
// Mesh;

// SheetFactory
//   spritesheet;
//   composite


// SceneDelegate;

// Behavior = function(){

//   trigger;
//   actions: [];

// };

// ActionManager;

// Scene;

// world = {
//   type: '2D',
//   context: 
// }

// Body = function(){}

// Node = function(){}