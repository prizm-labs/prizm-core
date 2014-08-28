var THREE = _THREE;

Context3D = function( DOMElementId, height, width ) {

    this.options = {
        height: height,
        width: width
    };
    this.DOMAnchor = document.getElementById( DOMElementId );

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

    init: function() {

        // TODO refactor loader???
        this.loader = new THREE.JSONLoader(); // init the loader util

        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color().setRGB(1,1,1);
        material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
        material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);

        this.materials = {
            'default': material
        };

        this.geometries = { cube: new THREE.BoxGeometry(1,1,1) };

        this.templates = {
            camera: function( fov, aspect, near, far ) {
                return new THREE.PerspectiveCamera( fov, aspect, near, far );
            },
            tabletop: function( sizeX, sizeZ ) {

                var geometry = new THREE.PlaneGeometry( sizeX, sizeZ, 3, 3 );
                var material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false});

                material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
                material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);

                var mesh = new THREE.Mesh(geometry, material);
                mesh.receiveShadow  = true;

                return mesh;
            }
        };

        this.scene = new THREE.Scene();

        // TODO camera setup

        this.addCamera(75, this.options.width / this.options.height, 0.1, 1000);

        this.camera = this.cameras[0];
        this.camera.position.z = 500;

        console.log(this.camera);


        // TODO light setup

        var light = new THREE.DirectionalLight();
        light.intensity = 0.7;
        light.castShadow = true;
        light.position.set(-320,350,100);
        this.scene.add( light );



        // TODO Floor setup
//        var tabletop = this.templates.tabletop(1200,1200);
//        tabletop.position.set(0,0,0);
//        this.scene.add( tabletop );
//        this.bodies['tabletop'] = tabletop;


        // TODO setup renderer
        this.renderer = new THREE.WebGLRenderer( { alpha: true } );
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setSize( this.options.width, this.options.height );



        this.DOMAnchor.appendChild( this.renderer.domElement );

        TweenLite.ticker.addEventListener("tick", this.render.bind(this));
    },

    addDynamicTexture: function( key, textureMap ){

        var mat = new THREE.MeshPhongMaterial();
        mat.map = new THREE.Texture(textureMap);

        this.materials[key] = mat;
        console.log(this.materials);
    },

    mapTabletopTexture: function( key ){

        var geometry = new THREE.PlaneGeometry( 1200, 1200, 3, 3 );
        var material = this.materials[key];

        material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
        material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);

        var mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow  = true;

        this.scene.add( mesh );

        mesh.material.map.needsUpdate = true;

//        this.bodies['tabletop'].material = this.materials[key];
//        this.bodies['tabletop'].material.map.needsUpdate = true;
    },


    load: function( model ) {

        var _this = this;

        var key = model[0];
        var path = model[1];
        var material = (model[2]!=null) ? this.materials[model[2]] : this.materials.default;
        var scale = model[3] || 1;

        var onGeometry = function(geometry)
        {

            _this.templates[key] = function(){
                var mesh = new THREE.Mesh(
                    geometry,
                    material
                );

                mesh.scale.x = mesh.scale.x*scale;
                mesh.scale.y = mesh.scale.y*scale;
                mesh.scale.z = mesh.scale.z*scale;

                return mesh;
            };

            //_this.scene.add(mesh);
            console.log('geometry loaded');
        };

        this.loader.load(path, onGeometry);
    },

    addCamera: function( fov, aspect, near, far ){

        var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

        this.cameras.push(camera);

        return this.cameras.length-1;
    },

    addBody: function( key, x, y, z, options ){
        console.log('addEntities',x,y,z);

        var self = this;

        var body = this.templates[key](options) || new THREE.Mesh( this.geometries.cube, this.materials.default );
        //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

        body.position.x = x;
        body.position.y = y;
        body.position.z = z;

        this.scene.add( body );


        requestAnimationFrame(this.render.bind(self));

        return body.id;
    },

    updateBody: function( body ){

        //var entity = this.entities[body.id];
        var entity = this.scene.getObjectById( body.id );
        console.log('updateBody', entity);

        this.runAnimation(function(){
            TweenLite.to(entity.position, 2,
                { x:body.position.x, y:body.position.y, z:body.position.z });

            TweenLite.to(entity.rotation, 2,
                { x:body.rotation.x, y:body.rotation.y, z:body.rotation.z });
        })

    },

    render: function(){

        this.renderer.render(this.scene, this.camera);
        //requestAnimationFrame(this.animate);
    },

    runAnimation: function(animation){

        var timeline = new TimelineLite({ onStart: addListener, onComplete: removeListener });

        animation();
        //timeline.play();


        function addListener(){
            //TweenLite.ticker.addEventListener("tick", this.animate.bind(this));
        }

        function removeListener(){

            //TweenLite.ticker.removeEventListener("tick", this.animate.bind(this));
        }

    }

};
