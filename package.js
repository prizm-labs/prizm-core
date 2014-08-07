Package.describe({
  summary: "Core classes for tabletop games on PRIZM",
  internal: true
});

Package.on_use(function (api) {
  api.use("underscore", ["client", "server"]);
  api.use("reactive-class", ["client", "server"]);

  api.add_files(['piece.js','card.js','deck.js','pieceLocation.js','player.js'],['client', 'server']);

  api.add_files(['core.js'], //dependencies in order
                ['client', 'server']);
  api.export("Prizm",['client', 'server']);
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