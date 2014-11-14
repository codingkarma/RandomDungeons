function MapEditor(engine) {
    //Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;

    //Adding the light to the scene
    var ambient = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 100, 0), scene);
	ambient.diffuse = new BABYLON.Color3(.98, .95, .9);
	ambient.specular = new BABYLON.Color3(0, 0, 0);

    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = .000000001;
    var Beta = Math.PI / 16;
    var camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, RoomHeight*11, new BABYLON.Vector3.Zero(), scene);
    //set camera to not move
    // camera.lowerAlphaLimit = Alpha;
    // camera.upperAlphaLimit = Alpha;
    // camera.lowerBetaLimit = Beta;
    // camera.upperBetaLimit = Beta;

    scene.tileMaterialSword = new BABYLON.StandardMaterial("tile-texture-Sword", scene);
    scene.tileMaterialSword.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.7);
	// scene.tileMaterialSword.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.tile = [];
	// var ground = new BABYLON.Mesh.CreateBox("Seal", 1.0, scene);
	//Draw Entrance Room
	for (var i_room=0; i_room < map.rooms.length; i_room++) {
		if (map.rooms[i_room].type == RoomType.Entrance) {
			for (var i = 0; i < map.rooms[i_room].tiles.length ; i++) {
				scene.tile[i] = drawTile(scene, map.rooms[i_room].tiles[i],i);
				scene.tile[i].checkCollisions = true;
				scene.tile[i].tileId = i;
			}
			var centerX=map.rooms[i_room].width/2*map.rooms[i_room].tiles[0].width-1;
			var centerZ=map.rooms[i_room].height/2*map.rooms[i_room].tiles[0].width-1;
			camera.target = new BABYLON.Vector3(centerX, 0, centerZ);
			//bottom tile for "sealing"
			// ground.scaling =new BABYLON.Vector3(map.rooms[i_room].width*10, 0.2, map.rooms[i_room].height*10);
			// ground.position = new BABYLON.Vector3(centerX, -.1, centerZ);
			// ground.material= new BABYLON.StandardMaterial("texture-Seal", scene);
			// ground.diffuseColor =new BABYLON.Color3(0.3, 0.3, 0.3);
		}
	}
    
	
    // example of loading a mesh from blender export
    scene.Sword = 0;
    BABYLON.SceneLoader.ImportMesh("", "Models3D/", "FunSword.js", scene, function (meshes, particleSystems) {
        var m = meshes[0];
        m.isVisible = true;
        m.position = new BABYLON.Vector3(12, 7, 12);
        m.scaling = new BABYLON.Vector3(2, 2, 2);
        m.rotation.x = Math.PI / 6;
        m.rotation.y = Math.PI / 6;
        m.rotation.z = Math.PI / 3;
        // m.material = scene.tileMaterialSword;
        scene.Sword = m;
		// scene.Sword.checkCollisions = true;
		// scene.Sword.applyGravity=true;
		// //Set the ellipsoid around the camera (e.g. your player's size)
		// scene.Sword.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    });
	
    // ground.checkCollisions = true;
	
    // BABYLON.SceneLoader.ImportMesh("", "Models3D/", "BookGolem.js", scene, function (newMesh) {
        // scene.BookGolem = newMesh;
        // scene.BookGolem[0].position.y += 4;
		// for (var i=1; i< newMesh.length;i++) {
			// scene.BookGolem[i].position.y += 4;
		// }
        // // m[0].isVisible = true;
        // // m.material = scene.tileMaterialSword;
    // });

    scene.registerBeforeRender(function(){	
		if(scene.isReady() && scene.Sword) {
			velocity = new BABYLON.Vector3(0, -10, 0);	
			// scene.Sword.moveWithCollisions(velocity);
		}
	});

    //When click event is raised
    $('#renderCanvas').on("click", function (evt) {

        var scale = getScale();
        if (scale == null) {
            scale = 1;
        }
        // We try to pick an object
        var pickResult = scene.pick(evt.offsetX, evt.offsetY);

        // if the click hits the ground object, we change the impact position
        if (pickResult.hit) {
            //some function
        }
    });

    return scene;

}

this.getScale = function () {
    this.viewportScale = undefined;
    // Calculate viewport scale 
    this.viewportScale = screen.width / window.innerWidth;
    return this.viewportScale;
};

function drawTile(Scene, tile, index) {

    var newMesh = new BABYLON.Mesh.CreateBox(TileType[tile.type].name + '-' + parseInt(index), 1.0, Scene);
    newMesh.scaling = TileType[tile.type].scale;
    newMesh.position = new BABYLON.Vector3(tile.col*tile.width, 0, tile.row*tile.width);
    newMesh.material= new BABYLON.StandardMaterial("texture-" + TileType[tile.type].name, Scene);
	newMesh.material.diffuseColor = TileType[tile.type].diffuseColor;

    return newMesh;
};
