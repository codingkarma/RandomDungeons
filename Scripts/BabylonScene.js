var bjsHelper =  {
	tileType: [
		{name: "Wall", material: 0, scale: new BABYLON.Vector3(10, 30, 10)},
		{name: "Floor", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)},
		{name: "Pillar", material: 0, scale: new BABYLON.Vector3(10, 30, 10)},
		{name: "Fire",material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)},
		{name: "Door", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)}
	]
};

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
	
    var ambient1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(150, 50, 150), scene);
	ambient1.diffuse = new BABYLON.Color3(.68, .65, .6);
	ambient1.specular = new BABYLON.Color3(0, 0, 0);

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

	//Create me some textures
	//Tile Type detailed materials
	//Wall
	bjsHelper.tileType[0].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[0].name, scene);
	bjsHelper.tileType[0].material.diffuseTexture = new BABYLON.Texture('./Models3D/Wall_Texture.png', scene);
	bjsHelper.tileType[0].material.bumpTexture = new BABYLON.Texture('./Models3D/Wall_BumpTexture.png', scene);
	bjsHelper.tileType[0].material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
	//Floor
	bjsHelper.tileType[1].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[1].name, scene);
	bjsHelper.tileType[1].material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-2.png', scene);
	bjsHelper.tileType[1].material.bumpTexture = new BABYLON.Texture('./Models3D/Floor_Tile-bump.png', scene);
	bjsHelper.tileType[1].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Pillar
	bjsHelper.tileType[2].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[2].name, scene);
	bjsHelper.tileType[2].material.diffuseColor = new BABYLON.Color3(.1, 0.5, 0.1);
	//Fire
	bjsHelper.tileType[3].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[3].name, scene);
	bjsHelper.tileType[3].material.diffuseColor = new BABYLON.Color3(.5, 0.1, 0.1);
	//Door
	bjsHelper.tileType[4].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[4].name, scene);
	bjsHelper.tileType[4].material.diffuseColor = new BABYLON.Color3(.7, 0.7, 0.7);
	
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
		scene.Sword.checkCollisions = true;
		scene.Sword.applyGravity=true;
		//Set the ellipsoid around the camera (e.g. your player's size)
		scene.Sword.ellipsoid = new BABYLON.Vector3(2, 1, 2);
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
			// var velocity = new BABYLON.Vector3(0, -10, 0);	
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

    var newMesh = new BABYLON.Mesh.CreateBox(bjsHelper.tileType[tile.type].name + '-' + parseInt(index), 1.0, Scene);
    newMesh.scaling = bjsHelper.tileType[tile.type].scale;
    newMesh.position = new BABYLON.Vector3(tile.col*tile.width, 0, tile.row*tile.width);
    newMesh.material = bjsHelper.tileType[tile.type].material;

    return newMesh;
};
