//Helpful Info
// X Z are analogous to x and y cartesian coor. 
//The Map gets drawn in the lower right quadrant, that is x > 0 and z < 0

var bjsHelper =  {
	tileType: [
		{name: "Wall", material: 0, scale: new BABYLON.Vector3(10, 30, 10)},
		{name: "Floor", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)},
		{name: "Pillar", material: 0, scale: new BABYLON.Vector3(10, 30, 10)},
		{name: "Fire",material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)},
		{name: "Door", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)}
	]
};

function CreateStartScene(engine) {
    //Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = 0;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, 40, new BABYLON.Vector3.Zero(), scene);
    // //set camera to not move
    // scene.camera.lowerAlphaLimit = Alpha;
    // scene.camera.upperAlphaLimit = Alpha;
    // scene.camera.lowerBetaLimit = Beta;
    // scene.camera.upperBetaLimit = Beta;
	
	scene.light= new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 20, 0), scene);
	scene.light.diffuse = new BABYLON.Color3(.18, .15, .1);
	scene.light.specular = new BABYLON.Color3(0, 0, 0);
	var uvScale = 4;
	//Create Wall with Door and Torches
	scene.leftWall = new BABYLON.Mesh.CreateBox('leftWall',1.0,scene);
	scene.leftWall.scaling = new BABYLON.Vector3(40,10,30);
	scene.leftWall.position = new BABYLON.Vector3(-30,0,0);
	scene.leftWall.material = new BABYLON.StandardMaterial("textureWall", scene);
	scene.leftWall.material.diffuseTexture = new BABYLON.Texture('./Models3D/Wall_Texture.png', scene);
	scene.leftWall.material.diffuseTexture.uScale=uvScale;
	scene.leftWall.material.diffuseTexture.vScale=uvScale;
	scene.leftWall.material.bumpTexture = new BABYLON.Texture('./Models3D/Wall_BumpTexture.png', scene);
	scene.leftWall.material.bumpTexture.uScale=uvScale;
	scene.leftWall.material.bumpTexture.vScale=uvScale;
	// scene.leftWall.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	
	scene.rigthWall = new BABYLON.Mesh.CreateBox('rightWall',1.0,scene);
	scene.rigthWall.scaling = new BABYLON.Vector3(40,10,30);
	scene.rigthWall.position = new BABYLON.Vector3(30,0,0);
	scene.rigthWall.material = scene.leftWall.material
	
	scene.door = new BABYLON.Mesh.CreateBox('door',1.0,scene);
	scene.door.scaling = new BABYLON.Vector3(20,1,30);
	scene.door.material = new BABYLON.StandardMaterial("textureDoor", scene);
	scene.door.material.diffuseTexture = new BABYLON.Texture('./Models3D/Medieval_door2.jpg', scene);
	scene.door.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
	
	scene.floor = new BABYLON.Mesh.CreateBox('floor',1,scene);
	scene.floor.scaling = new BABYLON.Vector3(100,100,1);
	scene.floor.position = new BABYLON.Vector3(0,0,-15);
	scene.floor.material = new BABYLON.StandardMaterial("textureFloor", scene);
	scene.floor.material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-1.png', scene);
	scene.floor.material.diffuseTexture.uScale=20;
	scene.floor.material.diffuseTexture.vScale=20;
	scene.floor.material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
	
	// Create a particle system
	scene.leftTorchFire = new BABYLON.ParticleSystem("particles", 1000, scene);

    //Texture of each particle
    scene.leftTorchFire.particleTexture = new BABYLON.Texture("Models3D/flame.png", scene);

    // Where the particles come from
    scene.leftTorchFire.minEmitBox = new BABYLON.Vector3(-.75, 0, 0); // Starting all from
    scene.leftTorchFire.maxEmitBox = new BABYLON.Vector3(.75, .25, 0); // To...

    // Colors of all particles
    scene.leftTorchFire.color1 = new BABYLON.Color4(1, 0.7, 0.7, 1.0);
    scene.leftTorchFire.color2 = new BABYLON.Color4(0.5, 0.2, 0.2, 1.0);
    scene.leftTorchFire.colorDead = new BABYLON.Color4(0.2, 0, 0, 0.0);

    // Size of each particle (random between...
    scene.leftTorchFire.minSize = 0.1;
    scene.leftTorchFire.maxSize = 0.5;

    // Life time of each particle (random between...
    scene.leftTorchFire.minLifeTime = 0.3;
    scene.leftTorchFire.maxLifeTime = 1;

    // Emission rate
    scene.leftTorchFire.emitRate = 800;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    scene.leftTorchFire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    scene.leftTorchFire.gravity = new BABYLON.Vector3(0, 2, 8);

    // Direction of each particle after it has been emitted
    scene.leftTorchFire.direction1 = new BABYLON.Vector3(-.75, 1, 1);
    scene.leftTorchFire.direction2 = new BABYLON.Vector3(.25, 1, 1);

    // Angular speed, in radians
    scene.leftTorchFire.minAngularSpeed = 0;
    scene.leftTorchFire.maxAngularSpeed = Math.PI;

    // Speed
    scene.leftTorchFire.minEmitPower = .5;
    scene.leftTorchFire.maxEmitPower = 1.5;
    scene.leftTorchFire.updateSpeed = 0.005;

    scene.leftTorchLight= new BABYLON.PointLight("Omni", new BABYLON.Vector3(-17, 10,7), scene);
	scene.leftTorchLight.diffuse = new BABYLON.Color3(.6, .4, .2);
	scene.leftTorchLight.specular = new BABYLON.Color3(.3, .2, .2);
    scene.rightTorchLight= new BABYLON.PointLight("Omni", new BABYLON.Vector3(17, 10,7), scene);
	scene.rightTorchLight.diffuse = new BABYLON.Color3(.6, .4, .2);
	scene.rightTorchLight.specular = new BABYLON.Color3(.3, .2, .2);
	
	//Create Torch Meshes
	scene.leftTorchHandle = new BABYLON.Mesh.CreateCylinder('TorchHandle',6,1.35,.75,8,1,scene);
	scene.leftTorchHandle.rotation = new BABYLON.Vector3(0,Math.PI/2,Math.PI/2.4);
	scene.leftTorchHandle.scaling = new BABYLON.Vector3(1,1,1);
	scene.leftTorchHandle.position = new BABYLON.Vector3(-13, 7, 1.5);
	scene.leftTorchHandle.material = new BABYLON.StandardMaterial("textureTorch", scene);
	scene.leftTorchHandle.material.diffuseTexture = new BABYLON.Texture('./Models3D/torch_wood.jpg', scene);
	
	scene.rightTorchHandle = new BABYLON.Mesh.CreateCylinder('TorchHandle',6,1.35,.75,8,1,scene);
	scene.rightTorchHandle.rotation = new BABYLON.Vector3(0,Math.PI/2,Math.PI/2.4);
	scene.rightTorchHandle.scaling = new BABYLON.Vector3(1,1,1);
	scene.rightTorchHandle.position = new BABYLON.Vector3(13, 7, 1.5);
	scene.rightTorchHandle.material = scene.leftTorchHandle.material;
	
	scene.player = 0;
    BABYLON.SceneLoader.ImportMesh("", "Models3D/", "TorchTop.b.js", scene, function (meshes) {
        var m = meshes[0];
        m.isVisible = true;
        m.position = new BABYLON.Vector3(-13, 8, 4);
        m.scaling = new BABYLON.Vector3(1.4, 1.4, 1.4);
        m.rotation = new BABYLON.Vector3(Math.PI/2.4, 0, 0);
        scene.leftTorch = m;
		scene.rightTorch = m.clone();
        scene.rightTorch.position = new BABYLON.Vector3(13, 8, 4);
        scene.rightTorch.scaling = new BABYLON.Vector3(1.4, 1.4, 1.4);
        scene.rightTorch.rotation = new BABYLON.Vector3(Math.PI/2.4, 0, 0);
		scene.rightTorchFire = scene.leftTorchFire.clone();
		scene.rightTorchFire.direction1 = new BABYLON.Vector3(.75, 1, 1);
		scene.leftTorchFire.emitter = scene.leftTorch; // the starting object, the emitter
		scene.rightTorchFire.emitter = scene.rightTorch; // the starting object, the emitter
		// Start the particle system
		scene.leftTorchFire.start();
		scene.rightTorchFire.start();
    });
	

    scene.registerBeforeRender(function(){
		if (scene.isReady() && scene.rightTorch) {
			scene.leftTorchFire.emitRate = getRandomInt(500, 1500);
			scene.rightTorchFire.emitRate = getRandomInt(600, 1600);
			scene.leftTorchLight.specular = new BABYLON.Color3(getRandomInt(3, 5)/10, .3, .3);
			scene.rightTorchLight.specular = new BABYLON.Color3(getRandomInt(3, 5)/10, .3, .3);
		}
	});

    return scene;

}

function CreateScene(engine) {
    //Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = Math.PI/16;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, RoomHeight*11.5, new BABYLON.Vector3.Zero(), scene);
    //set camera to not move
    scene.camera.lowerAlphaLimit = Alpha;
    scene.camera.upperAlphaLimit = Alpha;
    scene.camera.lowerBetaLimit = Beta;
    scene.camera.upperBetaLimit = Beta;
	
	createMaterials(scene);

    scene.rooms = map.rooms;
	//Draw Rooms
	//TODO: change roomX0/roomZ0 to originOffset and add to each room as a parameter
	var roomX0=0;
	var roomZ0=0;
	for (var i_room=0; i_room < map.rooms.length; i_room++) {
		roomX0=map.rooms[i_room].col*map.rooms[i_room].width*map.rooms[i_room].tiles[0].width;
		roomZ0=-map.rooms[i_room].row*map.rooms[i_room].height*map.rooms[i_room].tiles[0].width;
		
		if (map.rooms[i_room].type != RoomType.Empty) {
			for (var i = 0; i < map.rooms[i_room].tiles.length ; i++) {
				scene.rooms[i_room].tiles[i].mesh = drawTile(scene, map.rooms[i_room].tiles[i],i);
				//reposition to room location
				scene.rooms[i_room].tiles[i].mesh.position.x=scene.rooms[i_room].tiles[i].mesh.position.x+roomX0;
				scene.rooms[i_room].tiles[i].mesh.position.z=scene.rooms[i_room].tiles[i].mesh.position.z+roomZ0;
				scene.rooms[i_room].tiles[i].mesh.backFaceCulling = false;
				
				scene.rooms[i_room].tiles[i].mesh.checkCollisions = true;
				scene.rooms[i_room].tiles[i].mesh.tileId = i;
			}
			var centerX=(map.rooms[i_room].width-1)/2*map.rooms[i_room].tiles[0].width;
			var centerZ=(map.rooms[i_room].height-1)/2*map.rooms[i_room].tiles[0].width;
			//Add a light to the room
			scene.rooms[i_room].light = [];
			scene.rooms[i_room].light[0] = new BABYLON.PointLight("Omni", new BABYLON.Vector3(roomX0+centerX, 200, roomZ0-centerZ), scene);
			scene.rooms[i_room].light[0].diffuse = new BABYLON.Color3(.98, .95, .9);
			scene.rooms[i_room].light[0].specular = new BABYLON.Color3(0, 0, 0);
			scene.rooms[i_room].light[1] = new BABYLON.PointLight("Omni-1", new BABYLON.Vector3(roomX0+centerX, 50, roomZ0-2*centerZ), scene);
			scene.rooms[i_room].light[1].diffuse = new BABYLON.Color3(.68, .65, .6);
			scene.rooms[i_room].light[1].specular = new BABYLON.Color3(0, 0, 0);
			
			if (map.rooms[i_room].type == RoomType.Entrance) {
				scene.camera.target = new BABYLON.Vector3(roomX0+centerX, 0, roomZ0-centerZ);
				//set active room to entrance
				scene.activeRoom=map.rooms[i_room];
				scene.activeRoom.index=i_room;
				scene.activeRoom.roomX0=scene.activeRoom.col*scene.activeRoom.width*scene.activeRoom.tiles[0].width;
				scene.activeRoom.roomZ0=-scene.activeRoom.row*scene.activeRoom.height*scene.activeRoom.tiles[0].width;
			}
		}
	}
	
    // example of loading a mesh from blender export
    scene.player = 0;
	scene.enemy=[];
    BABYLON.SceneLoader.ImportMesh("", "Models3D/", "FunSword.js", scene, function (meshes, particleSystems) {
        var m = meshes[0];
        m.isVisible = true;
		var entranceIndex = map.entranceRow*map.width+map.entranceCol;
		roomX0=map.rooms[entranceIndex].col*map.rooms[entranceIndex].width*map.rooms[entranceIndex].tiles[0].width+(Math.floor(map.rooms[entranceIndex].width/2)*map.rooms[entranceIndex].tiles[0].width);
		roomZ0=-map.rooms[entranceIndex].row*map.rooms[entranceIndex].height*map.rooms[entranceIndex].tiles[0].width-((map.rooms[entranceIndex].height-1)*map.rooms[entranceIndex].tiles[0].width);

        m.position = new BABYLON.Vector3(roomX0, 50, roomZ0+10);
        m.scaling = new BABYLON.Vector3(2, 2, 2);
        m.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4);
        scene.player = m;
		scene.player.checkCollisions = true;
		scene.player.applyGravity=true;
		//Set the ellipsoid around the camera (e.g. your player's size)
		scene.player.ellipsoid = new BABYLON.Vector3(3, 1, 3);
		scene.player.previousRotation = scene.player.rotation.y;
		scene.player.playerAnimations = new playerAnimations();
		//Spawn a Blob on some random tile
		spawnEnemy(scene);
		spawnEnemy(scene);
		spawnEnemy(scene);
    });

	
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
		if(scene.isErrthingReady) {
			//Detect if player hits enemy mesh
			for (i=0; i < scene.enemy.length;i++) {
				if (scene.player.intersectsMesh(scene.enemy[i], true) && scene.player.Attack == 1) {
					scene.enemy[i].renderOutline = true;
					scene.enemy[i].outlineColor = new BABYLON.Color4(.8,.2,.2,.8);
					scene.enemy[i].outlineWidth =.2;
				} else {
					scene.enemy[i].renderOutline = false;
				}
			}
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
}

function drawTile(Scene, tile, index) {

    var newMesh = new BABYLON.Mesh.CreateBox(bjsHelper.tileType[tile.type].name + '-' + parseInt(index), 1.0, Scene);
    newMesh.scaling = bjsHelper.tileType[tile.type].scale;
    newMesh.position = new BABYLON.Vector3(tile.col*tile.width, 0, -tile.row*tile.width);
    newMesh.material = bjsHelper.tileType[tile.type].material;

    return newMesh;
}

function spawnEnemy(Scene) {
	var entranceIndex = Scene.activeRoom.index;
	//TO DO: Implement other enemy types, for now just a rolling ball, who has lost his chain
	var index = Scene.enemy.length;
    var newMesh = new BABYLON.Mesh.CreateSphere("enemySphere-" + parseInt(index), 8.0, 8.0, Scene);
	var enemyIndex = Scene.enemy.push(newMesh) - 1;
	var randomTile = getRandomInt(0, map.rooms[entranceIndex].width*map.rooms[entranceIndex].height);
	while (map.rooms[entranceIndex].tiles[randomTile].type != TileType.Floor) {
		randomTile = getRandomInt(0, map.rooms[entranceIndex].width*map.rooms[entranceIndex].height);
	}
	var tileIndex = map.rooms[entranceIndex].tiles[randomTile].row*map.rooms[entranceIndex].tiles[randomTile].width + map.rooms[entranceIndex].tiles[randomTile].col;
	Scene.enemy[enemyIndex].position = new BABYLON.Vector3(Scene.rooms[entranceIndex].tiles[randomTile].mesh.position.x, 50, Scene.rooms[entranceIndex].tiles[randomTile].mesh.position.z);
	Scene.enemy[enemyIndex].scaling = new BABYLON.Vector3(1, 1, 1);
	Scene.enemy[enemyIndex].material = Scene.BlobMaterial;
	
	
	Scene.enemy[enemyIndex].checkCollisions = true;
	Scene.enemy[enemyIndex].applyGravity = true;
	//Set the ellipsoid around the camera (e.g. your player's size)
	Scene.enemy[enemyIndex].ellipsoid = new BABYLON.Vector3(2, 1, 2);
	
	return;

}

function playerAnimations() {

	this.updateIdle = function (Scene) {
		//create animations for player
		Scene.idleAnimation = new BABYLON.Animation("idleAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		// Animation keys
		Scene.idleAnimation.tempKeys = [];
		//At the animation key 0, the value of scaling is "1"
		Scene.idleAnimation.tempKeys.push({
			frame: 0,
			value: Scene.player.currentFacingAngle.add(new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4))
		});
		Scene.idleAnimation.tempKeys.push({
			frame: 30,
			value: new BABYLON.Vector3(Math.PI/3, Math.PI/1.8, Math.PI/3)
		});
		Scene.idleAnimation.tempKeys.push({
			frame: 60,
			value: new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4)
		});
		//Adding keys to the animation object
		Scene.idleAnimation.setKeys(Scene.idleAnimation.tempKeys);
		Scene.player.animations.push(scene.idleAnimation);
	};
	
	this.updateAttack = function (Scene) {
		//create animations for player
		Scene.attackAnimation = new BABYLON.Animation("attackAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		// Animation keys
		Scene.attackAnimation.tempKeys = [];
		//At the animation key 0, the value of scaling is "1"
		Scene.attackAnimation.tempKeys.push({
			frame: 0,
			value: new BABYLON.Vector3(0, Scene.player.currentFacingAngle.y + Math.PI/2.2, Math.PI/2)
		});
		Scene.attackAnimation.tempKeys.push({
			frame: 10,
			value: new BABYLON.Vector3(0, Scene.player.currentFacingAngle.y - 0.8, Math.PI/2)
		});
		//Adding keys to the animation object
		Scene.attackAnimation.setKeys(Scene.attackAnimation.tempKeys);
		Scene.player.animations.push(Scene.attackAnimation);
		Scene.beginAnimation(Scene.player, 0, 10, false, 1.0, function () {
			Scene.player.Attacking=0;
			Scene.player.Attack=0; 
			Scene.player.rotation = new BABYLON.Vector3(Math.PI/6,Scene.player.currentFacingAngle.y,Math.PI/4);
		});
	};
}

function createMaterials(Scene) {
	//Create me some textures
	//Tile Type detailed materials
	//Wall
	bjsHelper.tileType[0].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[0].name, Scene);
	bjsHelper.tileType[0].material.diffuseTexture = new BABYLON.Texture('./Models3D/Wall_Texture-2.png', Scene);
	bjsHelper.tileType[0].material.diffuseTexture.wAng=0;
	bjsHelper.tileType[0].material.diffuseTexture.uScale=1;
	// bjsHelper.tileType[0].material.diffuseTexture.vOffset=-1;
	bjsHelper.tileType[0].material.bumpTexture = new BABYLON.Texture('./Models3D/Wall_BumpTexture-2.png', Scene);
	bjsHelper.tileType[0].material.bumpTexture.uScale=1;
	bjsHelper.tileType[0].material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	//Floor
	bjsHelper.tileType[1].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[1].name, Scene);
	bjsHelper.tileType[1].material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-2.png', Scene);
	bjsHelper.tileType[1].material.bumpTexture = new BABYLON.Texture('./Models3D/Floor_Tile-bump.png', Scene);
	bjsHelper.tileType[1].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Pillar
	bjsHelper.tileType[2].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[2].name, Scene);
	bjsHelper.tileType[2].material.bumpTexture = new BABYLON.Texture('./Models3D/Wall_BumpTexture-2.png', Scene);
	bjsHelper.tileType[2].material.diffuseTexture = new BABYLON.Texture('./Models3D/Wall_Texture-2.png', Scene);
	bjsHelper.tileType[2].material.diffuseColor = new BABYLON.Color3(.5, 0.5, 0.5);
	//Fire
	bjsHelper.tileType[3].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[3].name, Scene);
	bjsHelper.tileType[3].material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-2.png', Scene);
	bjsHelper.tileType[3].material.bumpTexture = new BABYLON.Texture('./Models3D/Floor_Tile-bump.png', Scene);
	bjsHelper.tileType[3].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Door
	bjsHelper.tileType[4].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[4].name, Scene);
	bjsHelper.tileType[4].material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-2.png', Scene);
	bjsHelper.tileType[4].material.bumpTexture = new BABYLON.Texture('./Models3D/Floor_Tile-bump.png', Scene);
	bjsHelper.tileType[4].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	
    Scene.tileMaterialSword = new BABYLON.StandardMaterial("tile-texture-Sword", Scene);
    Scene.tileMaterialSword.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.7);
	// Scene.tileMaterialSword.specularColor = new BABYLON.Color3(0, 0, 0);
	
	Scene.BlobMaterial = new BABYLON.StandardMaterial("tile-texture-Blob", Scene);
    Scene.BlobMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.3);
    Scene.BlobMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
}
