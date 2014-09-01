Package.describe({
  summary: "Core classes for tabletop games on PRIZM",
  internal: true
});

Package.on_use(function (api) {
  // default packages
  api.use(["deps", "ejson", "underscore"], ["client", "server"]);

  // vendor packages
  api.use(["lodash"], ["client", "server"]);

  // vendor JS libraries
  api.add_files(['vendor/pixi/pixi.dev.js', 'vendor/three/three.js',
      'vendor/buzz/buzz.js', 'vendor/hammer/hammer.js','vendor/gsap/TweenMax.js'
      ],['client']);
  api.add_files(['vendor/hashid/hashids.min.js', 'vendor/hashid/common.js',
      'vendor/fsm/state-machine.js','vendor/fsm/machina.js'], ["client", "server"]);

  // PRIZM classes
  api.add_files(['Context2D.js','Context3D.js','Bodies.js','Factory.js', 'Nodes.js', 'Interactions.js', 'Sound.js', 'Cameras.js'],['client']);
  api.add_files(['classes/pieceLocation.js'],['client', 'server']);

  // bundle & exports
  api.add_files(['core.js'], ['client']);
  api.export("PRIZM",['client']);
});

Package.on_test(function (api) {
  // api.use(['tinytest', 'underscore']);
  // api.use('jsparse', 'client');

  // api.add_files('parser_tests.js',
  //               // Test just on client for faster running; should run
  //               // identically on server.
  //               'client');
  //               //['client', 'server']);
});