var THREE = _THREE;

Context3D = function (DOMElementId, width, height) {

    this.options = {
        height: height,
        width: width
    };
    this.DOMAnchor = document.getElementById(DOMElementId);

    this.loader = null;

    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.cameras = [];
    this.views = {}; //preset perspectives

    this.entities = []; // all bodies
    this.bodies = {}; // reserved bodies: tabletop
};

Context3D.prototype = {

    init: function () {

        // TODO refactor loader???
        this.loader = new THREE.JSONLoader(); // init the loader util

        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color().setRGB(1, 1, 1);
        material.ambient = new THREE.Color().setRGB(0.0196078431372549, 0.0196078431372549, 0.0196078431372549);
        material.specular = new THREE.Color().setRGB(0.06666666666666667, 0.06666666666666667, 0.06666666666666667);

        this.materials = {
            'default': material
        };

        this.geometries = { cube: new THREE.BoxGeometry(1, 1, 1) };

        this.templates = {
            camera: function (options) {

                var fov = options[0], aspect = options[1], near = options[2], far = options[3];

                var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

                return camera;
            },
            tabletop: function (sizeX, sizeZ) {

                var geometry = new THREE.PlaneGeometry(sizeX, sizeZ, 3, 3);
                var material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false});

                material.ambient = new THREE.Color().setRGB(0.0196078431372549, 0.0196078431372549, 0.0196078431372549);
                material.specular = new THREE.Color().setRGB(0.06666666666666667, 0.06666666666666667, 0.06666666666666667);

                var mesh = new THREE.Mesh(geometry, material);
                mesh.receiveShadow = true;

                return mesh;
            }
        };

        this.scene = new THREE.Scene();

        // TODO light setup
        this.setGlobalLights();


        // TODO setup renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.options.width, this.options.height);


        this.DOMAnchor.appendChild(this.renderer.domElement);
        //TweenLite.ticker.addEventListener("tick", this.render.bind(this));
    },

    setGlobalLights: function () {
        var light = new THREE.DirectionalLight();
        light.intensity = 0.7;
        light.castShadow = true;
        light.position.set(-320, 350, 100);
        this.scene.add(light);

        // 0x404040 // soft white
        // 0x909090
        var lightAmbient = new THREE.AmbientLight(0xffffff);
        this.scene.add(lightAmbient);
    },

    setActiveCamera: function (camera) {
        var _this = this;

        this.camera = this.scene.getObjectById(camera.id);

        console.log('setActiveCamera', this.camera);

        TweenLite.ticker.addEventListener("tick", this.render.bind(_this));

        //requestAnimationFrame(this.render.bind(_this));
    },

    start: function () {
        //TweenLite.ticker.addEventListener("tick", this.render.bind(this));
    },

    addDynamicTexture: function (key, textureMap) {

        var mat = new THREE.MeshPhongMaterial();
        mat.map = new THREE.Texture(textureMap);

        this.materials[key] = mat;
        console.log(this.materials);
    },

    mapTabletopTexture: function (key, width, height, scale) {

        var geometry = new THREE.PlaneGeometry(width, height);
        var material = this.materials[key];

        material.color = new THREE.Color().setRGB(1, 1, 1);
        material.ambient = new THREE.Color().setRGB(1, 1, 1);
        material.specular = new THREE.Color().setRGB(0.06666666666666667, 0.06666666666666667, 0.06666666666666667);

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.receiveShadow = true;

        mesh.scale.x = mesh.scale.x * scale;
        mesh.scale.y = mesh.scale.y * scale;
        mesh.scale.z = mesh.scale.z * scale;

        this.scene.add(mesh);
        console.log('tabletop mesh', mesh, width, height);

        // trigger mapping of 2D canvas
        mesh.material.map.needsUpdate = true;
    },


    load: function (model) {

        var _this = this;

        var key = model[0];
        var path = model[1];
        var material = (model[2] != null) ? this.materials[model[2]] : this.materials.default;
        var scale = model[3] || 1;

        var onGeometry = function (geometry) {

            _this.templates[key] = function () {
                var mesh = new THREE.Mesh(
                    geometry,
                    material
                );

                mesh.scale.x = mesh.scale.x * scale;
                mesh.scale.y = mesh.scale.y * scale;
                mesh.scale.z = mesh.scale.z * scale;

                return mesh;
            };

            console.log('geometry loaded');
        };

        this.loader.load(path, onGeometry);
    },

    addCamera: function (options) {

        var fov = options[0], aspect = options[1], near = options[2], far = options[3];

        var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.cameras.push(camera);

        return camera.id;
    },

    addBody: function (key, x, y, z, options) {
        console.log('addEntities', x, y, z);

        var body = this.templates[key](options) || new THREE.Mesh(this.geometries.cube, this.materials.default);
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

        body.position.x = x;
        body.position.y = y;
        body.position.z = z;

        this.scene.add(body);

        //requestAnimationFrame(this.render.bind(self));
        return body.id;
    },

    updateBody: function (body) {

        var entity = this.scene.getObjectById(body.id);
        console.log('updateBody', entity, body);

        if (body.animations.length > 0) {

            _.each(body.animations, function (animation) {

                var attribute = animation[0], values = animation[1], duration = animation[2];

                if (duration == 0) {
                    _.each(values, function (value, key) {
                        entity[attribute][key] = value;
                    });

                    console.log(entity[attribute]);
                } else {
                    TweenLite.to(entity[attribute], duration, values);
                }
            });

            body.animations = [];
        }
    },

    render: function () {
        this.renderer.render(this.scene, this.camera);
    },

    runAnimation: function (animation) {

        var timeline = new TimelineLite({ onStart: addListener, onComplete: removeListener });

        animation();
        //timeline.play();


        function addListener() {
            //TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
        }

        function removeListener() {

            //TweenLite.ticker.removeEventListener("tick", this.animate.bind(this));
        }

    }

};
