Package.describe({
    summary: "Core classes for tabletop games on PRIZM",
    internal: true
});

Package.on_use(function (api) {
    // default packages
    api.use(["deps", "ejson", "underscore", "amplify"], ["client", "server"]);

    // vendor packages
    api.use(["lodash","streams"], ["client", "server"]);

    Npm.depends({"shape2d": "0.0.5"});

    // vendor JS libraries
    api.add_files(['vendor/pixi/pixi.dev.js', 'vendor/three/three.js',
        'vendor/buzz/buzz.js', 'vendor/hammer/hammer.js', 'vendor/gsap/TweenMax.js'
    ], ['client']);
    api.add_files(['vendor/hashid/hashids.min.js', 'vendor/hashid/common.js',
        'vendor/fsm/state-machine.js', 'vendor/fsm/machina.js'], ["client", "server"]);

    // PRIZM classes
    api.add_files(['Helpers.js','Context2D.js', 'Context3D.js', 'Bodies.js', 'Factory.js',
        'Nodes.js', 'Interactions.js', 'Sound.js', 'Cameras.js', 'Views.js', 'GameWorld.js'], ['client']);
    api.add_files(['classes/pieceLocation.js', 'LiveData.js'], ['client', 'server']);

    // bundle & exports
    api.add_files(['core.js'], ['client']);
    api.export("PRIZM", ['client']);

    api.add_files(['vendor/shape2d/shape2d.js'], ['server']);
    api.export(["Shape","LiveDataDelegate"], ['server']);
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