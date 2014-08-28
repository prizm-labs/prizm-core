Package.describe({
  summary: "Core classes for tabletop games on PRIZM",
  internal: true
});

Package.on_use(function (api) {
  api.use(["deps", "ejson", "underscore"], ["client", "server"]);

  api.use("reactive-extra", ["client", "server"]);

  api.add_files(['vendor/pixi/pixi.dev.js', 'vendor/three/three.js'],['client']);
  api.add_files(['vendor/hashid/hashids.min.js', 'vendor/hashid/common.js'], ["client", "server"]);

  api.add_files(['vendor/gsap/TweenMax.js'],['client']);

  api.add_files(['Context2D.js','Context3D.js','Bodies.js','Factory.js', 'Nodes.js'],['client']);

  api.add_files(['classes/pieceLocation.js'],['client', 'server']);

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