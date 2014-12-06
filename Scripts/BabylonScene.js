//Helpful Info
// X Z are analogous to x and y cartesian coor. 
//The Map gets drawn in the lower right quadrant, that is x > 0 and z < 0

var bjsHelper =  {
	tileType: [
		{name: "Wall", material: 0, scale: new BABYLON.Vector3(10, 20, 10), yOffset: 10.1},
		{name: "Floor", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10), yOffset: 0},
		{name: "Pillar", material: 0, scale: new BABYLON.Vector3(10, 20, 10), yOffset: 10.1},
		{name: "Fire",material: 0, scale: new BABYLON.Vector3(10, 0.2, 10), yOffset: 0},
		{name: "Door", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10), yOffset: 0}
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
	scene.leftWall.material.diffuseTexture = new BABYLON.Texture('./Textures/Wall_Texture.png', scene);
	scene.leftWall.material.diffuseTexture.uScale=uvScale;
	scene.leftWall.material.diffuseTexture.vScale=uvScale;
	scene.leftWall.material.bumpTexture = new BABYLON.Texture('./Textures/Wall_BumpTexture.png', scene);
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
	scene.door.material.diffuseTexture = new BABYLON.Texture('./Textures/Medieval_door2.jpg', scene);
	scene.door.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
	
	scene.floor = new BABYLON.Mesh.CreateBox('floor',1,scene);
	scene.floor.scaling = new BABYLON.Vector3(100,100,1);
	scene.floor.position = new BABYLON.Vector3(0,0,-15);
	scene.floor.material = new BABYLON.StandardMaterial("textureFloor", scene);
	scene.floor.material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-1.png', scene);
	scene.floor.material.diffuseTexture.uScale=20;
	scene.floor.material.diffuseTexture.vScale=20;
	scene.floor.material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
	
	scene.torchFire = [];
	createTorchFire(scene, scene);
    // Set the gravity of all particles
    scene.torchFire[0].gravity = new BABYLON.Vector3(0, 2, 8);
	scene.torchFire[0].minEmitBox = new BABYLON.Vector3(-.75, 0, 0); // Starting all from
    scene.torchFire[0].maxEmitBox = new BABYLON.Vector3(.75, .25, 0); // To...
    scene.torchFire[0].direction1 = new BABYLON.Vector3(-.75, 1, 1);
    scene.torchFire[0].direction2 = new BABYLON.Vector3(.25, 1, 1);
	
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
    BABYLON.SceneLoader.ImportMesh("", "./Models3D/", "TorchTop.b.js", scene, function (meshes) {
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
		scene.torchFire.push(scene.torchFire[0].clone());
		
		scene.torchFire[0].light.position = new BABYLON.Vector3(-17, 10, 7);
		scene.torchFire[1].light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(17, 10, 7), scene);
		scene.torchFire[1].light.diffuse = new BABYLON.Color3(.6, .4, .2);
		scene.torchFire[1].light.specular = new BABYLON.Color3(.3, .2, .2);
		scene.torchFire[1].direction1 = new BABYLON.Vector3(.75, 1, 1);
		scene.torchFire[0].emitter = scene.leftTorch; // the starting object, the emitter
		scene.torchFire[1].emitter = scene.rightTorch; // the starting object, the emitter
		// Start the particle system
		scene.torchFire[0].start();
		scene.torchFire[1].start();
    });
	

    scene.registerBeforeRender(function(){
		if (scene.isReady() && scene.rightTorch) {
			scene.torchFire[0].emitRate = getRandomInt(500, 1500);
			scene.torchFire[1].emitRate = getRandomInt(600, 1600);
			scene.torchFire[0].light.specular = new BABYLON.Color3(getRandomInt(3, 5)/10, .3, .3);
			scene.torchFire[1].light.specular = new BABYLON.Color3(getRandomInt(3, 5)/10, .3, .3);
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
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, RoomHeight*13.2, new BABYLON.Vector3.Zero(), scene);
    //set camera to not move
    // scene.camera.lowerAlphaLimit = Alpha;
    // scene.camera.upperAlphaLimit = Alpha;
    // scene.camera.lowerBetaLimit = Beta;
    // scene.camera.upperBetaLimit = Beta;
	
	
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .9);
	scene.ambientLight.specular = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.intensity = 1;
	
	createMaterials(scene);

    scene.rooms = map.rooms;
    scene.door = 0;
    scene.player = 0;
    BABYLON.SceneLoader.ImportMesh("", "Models3D/", "DoorFrame.b.js", scene, function (meshes) {
        scene.doorFrame = meshes;
		
		BABYLON.SceneLoader.ImportMesh("", "Models3D/", "TorchTopFrame.b.js", scene, function (newMeshes) {
			scene.torchTop = newMeshes[0];
			
			scene.torchTop.isVisible = false;
			scene.doorFrame[0].isVisible = false;
			scene.doorFrame.push(scene.torchTop.clone());
			scene.doorFrame.push(scene.torchTop.clone());
			var arrayLength = scene.doorFrame.length;
			for (var j=1;j < arrayLength;j++){
				scene.doorFrame[j].parent = scene.doorFrame[0];
				scene.doorFrame[j].isVisible = false;
			}
			//create left and right torch tops
			scene.doorFrame[arrayLength-1].position = new BABYLON.Vector3(1.5,3.2,-1.7);
			scene.doorFrame[arrayLength-2].position = new BABYLON.Vector3(-1.5,3.2,-1.7);
			scene.doorFrame[0].scaling = new BABYLON.Vector3(4.8, 4.8, 4.8);
			
			//Draw Rooms
			for (var i_room=0; i_room < map.rooms.length; i_room++) {
				if (map.rooms[i_room].type != RoomType.Empty) {
					//set room properties
					scene.rooms[i_room].originOffset = new BABYLON.Vector3(map.rooms[i_room].col*map.rooms[i_room].width*map.rooms[i_room].tiles[0].width,0,-map.rooms[i_room].row*map.rooms[i_room].height*map.rooms[i_room].tiles[0].width);
					scene.rooms[i_room].centerPosition = new BABYLON.Vector3((map.rooms[i_room].width-1)/2*map.rooms[i_room].tiles[0].width,0,(map.rooms[i_room].height-1)/2*map.rooms[i_room].tiles[0].width);
					scene.rooms[i_room].index=i_room;
					scene.rooms[i_room].enemy=[];
					scene.rooms[i_room].door=[];
					for (var i = 0; i < map.rooms[i_room].tiles.length ; i++) {
						scene.rooms[i_room].tiles[i].mesh = drawTile(scene, map.rooms[i_room].tiles[i],i);
						//reposition to room location
						scene.rooms[i_room].tiles[i].mesh.position.x=scene.rooms[i_room].tiles[i].mesh.position.x+scene.rooms[i_room].originOffset.x;
						scene.rooms[i_room].tiles[i].mesh.position.z=scene.rooms[i_room].tiles[i].mesh.position.z+scene.rooms[i_room].originOffset.z;
						
						scene.rooms[i_room].tiles[i].mesh.checkCollisions = true;
						scene.rooms[i_room].tiles[i].mesh.tileId = i;
						//create and position doors, adding the torch flame and light
						if (scene.rooms[i_room].tiles[i].type == TileType.Door) {
							var doorIndex = scene.rooms[i_room].door.push({Frame: []})-1;
							scene.rooms[i_room].door[doorIndex].Frame.push(scene.doorFrame[0].clone())
							scene.rooms[i_room].door[doorIndex].Frame[0].isVisible = true;
							for (var j=1;j < scene.doorFrame.length;j++){
								scene.rooms[i_room].door[doorIndex].Frame.push(scene.doorFrame[j].clone());
								scene.rooms[i_room].door[doorIndex].Frame[j].parent = scene.rooms[i_room].door[doorIndex].Frame[0];
								scene.rooms[i_room].door[doorIndex].Frame[j].isVisible = true;
							}
							scene.rooms[i_room].door[doorIndex].Frame[0].position = new BABYLON.Vector3(scene.rooms[i_room].tiles[i].mesh.position.x, -2,scene.rooms[i_room].tiles[i].mesh.position.z);
							var doorRotation = ((scene.rooms[i_room].tiles[i].col==scene.rooms[i_room].width-1)*1 + (scene.rooms[i_room].tiles[i].row==scene.rooms[i_room].height-1)*2 + (scene.rooms[i_room].tiles[i].col==0)*3)*Math.PI/2;
							scene.rooms[i_room].door[doorIndex].Frame[0].rotation = new BABYLON.Vector3(0, doorRotation, 0);
							//attach fire to TorchTop
							arrayLength = scene.doorFrame.length-1;
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength].torchFire = [];
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1].torchFire = [];
							createTorchFire(scene, scene.rooms[i_room].door[doorIndex].Frame[arrayLength]);
							createTorchFire(scene, scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1]);
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength].torchFire[0].light.intensity = 3;
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1].torchFire[0].light.intensity = 3;
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength].torchFire[0].light.range = 40;
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1].torchFire[0].light.range = 40;
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength].torchFire[0].emitter = scene.rooms[i_room].door[doorIndex].Frame[arrayLength];
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1].torchFire[0].emitter = scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1];
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
							// Start the particle system
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength].torchFire[0].start();
							scene.rooms[i_room].door[doorIndex].Frame[arrayLength-1].torchFire[0].start();
						}
					}
					
					if (map.rooms[i_room].type == RoomType.Entrance) {
						scene.camera.target = new BABYLON.Vector3(scene.rooms[i_room].originOffset.x+scene.rooms[i_room].centerPosition.x, 0, scene.rooms[i_room].originOffset.z-scene.rooms[i_room].centerPosition.z);
						//set active room to entrance
						scene.activeRoom=map.rooms[i_room];
						//activate torch lights
						for (doorIndex = 0; doorIndex < scene.activeRoom.door.length; doorIndex++) {
							arrayLength = scene.activeRoom.door[doorIndex].Frame.length-1;
							scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
							scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
						}
					}
				}
			}		
			
			BABYLON.SceneLoader.ImportMesh("", "Models3D/", "FunSword.b.js", scene, function (meshes, particleSystems) {
				var m = meshes[0];
				m.isVisible = true;
				var entranceIndex=scene.activeRoom.index;
				x0=map.rooms[entranceIndex].col*map.rooms[entranceIndex].width*map.rooms[entranceIndex].tiles[0].width+(Math.floor(map.rooms[entranceIndex].width/2)*map.rooms[entranceIndex].tiles[0].width);
				z0=-map.rooms[entranceIndex].row*map.rooms[entranceIndex].height*map.rooms[entranceIndex].tiles[0].width-((map.rooms[entranceIndex].height-1)*map.rooms[entranceIndex].tiles[0].width);
				
				m.position = new BABYLON.Vector3(x0, 50, z0+10);
				m.scaling = new BABYLON.Vector3(2, 2, 2);
				m.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4);
				scene.player = m;
				scene.player.checkCollisions = true;
				scene.player.applyGravity=true;
				//Set the ellipsoid around the camera (e.g. your player's size)
				scene.player.ellipsoid = new BABYLON.Vector3(3, 1, 3);
				scene.player.previousRotation = scene.player.rotation.y;
				scene.player.playerAnimations = new playerAnimations();
				//set up the action manager for attacks
				scene.actionManager = new BABYLON.ActionManager(scene);
				// Detect player input, then play attack animation
				scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
						if (evt.sourceEvent.keyCode == KEYS.SPACE) {
							if (scene.player.Attacking==0) {
								scene.player.playerAnimations.updateAttack(scene);
								scene.player.Attacking=1;
							}
						}
				}));
				
				//Spawn a Blob on some random tile
				var maxEmenies = getRandomInt(1,3);
				for (var iSpawn = 0; iSpawn < maxEmenies; iSpawn++) {
					spawnEnemy(scene);
				}
			});
		});
    });

    scene.registerBeforeRender(function(){
		// if(scene.isErrthingReady) {
			// //Detect if player hits enemy mesh
			// for (i=0; i < scene.activeRoom.enemy.length;i++) {
				// if (scene.player.intersectsMesh(scene.activeRoom.enemy[i], true) && scene.player.Attacking == 1) {
					// scene.activeRoom.enemy[i].renderOutline = true;
					// scene.activeRoom.enemy[i].outlineColor = new BABYLON.Color4(.8,.2,.2,.8);
					// scene.activeRoom.enemy[i].outlineWidth =.2;
				// } else {
					// scene.activeRoom.enemy[i].renderOutline = false;
				// }
			// }
		// }
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
    newMesh.position = new BABYLON.Vector3(tile.col*tile.width, bjsHelper.tileType[tile.type].yOffset, -tile.row*tile.width);
    newMesh.material = bjsHelper.tileType[tile.type].material;

    return newMesh;
}

function spawnEnemy(Scene) {
	//TO DO: Implement other enemy types, for now just a rolling ball, who has lost his chain
	var index = Scene.activeRoom.enemy.length;
    var newMesh = new BABYLON.Mesh.CreateSphere("enemySphere-" + parseInt(index), 8.0, 8.0, Scene);
	var enemyIndex = Scene.activeRoom.enemy.push(newMesh) - 1;
	var randomTile = getRandomInt(0, (Scene.activeRoom.width*Scene.activeRoom.height)-1);
	while (Scene.activeRoom.tiles[randomTile].type != TileType.Floor) {
		randomTile = getRandomInt(0, (Scene.activeRoom.width*Scene.activeRoom.height)-1);
	}
	var tileIndex = Scene.activeRoom.tiles[randomTile].row*Scene.activeRoom.tiles[randomTile].width + Scene.activeRoom.tiles[randomTile].col;
	Scene.activeRoom.enemy[enemyIndex].position = new BABYLON.Vector3(Scene.activeRoom.tiles[randomTile].mesh.position.x, 1, Scene.activeRoom.tiles[randomTile].mesh.position.z);
	Scene.activeRoom.enemy[enemyIndex].scaling = new BABYLON.Vector3(1, 1, 1);
	Scene.activeRoom.enemy[enemyIndex].material = Scene.BlobMaterial;
	
	Scene.activeRoom.enemy[enemyIndex].checkCollisions = true;
	Scene.activeRoom.enemy[enemyIndex].applyGravity = true;
	//Set the ellipsoid around the camera (e.g. your player's size)
	Scene.activeRoom.enemy[enemyIndex].ellipsoid = new BABYLON.Vector3(2, 1, 2);
	
	// create intersect action
	Scene.activeRoom.enemy[enemyIndex].actionManager = new BABYLON.ActionManager(scene);
	Scene.activeRoom.enemy[enemyIndex].health = 5;
	// Detect player input, then play animation after executing function
	Scene.activeRoom.enemy[enemyIndex].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: scene.player }, function (evt) {
			if (scene.player.Attacking == 1) {
				Scene.activeRoom.enemy[enemyIndex].health--;
				$('#dmg').html('<br />dmg: ' + parseInt(Scene.activeRoom.enemy[enemyIndex].health));
			}
	}));
	
	Scene.activeRoom.enemy[enemyIndex].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: scene.player }, function (evt) {

	}));
	
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
		if (Scene.player.animations == undefined) {
			Scene.player.animations.push(Scene.attackAnimation);
		}
		else {
			Scene.player.animations[0] = Scene.attackAnimation;
		}
		Scene.beginAnimation(Scene.player, 0, 10, false, 1.0, function () {
			Scene.player.Attacking=0;
			// Scene.player.Attack=0;
			Scene.player.rotation = new BABYLON.Vector3(Math.PI/6,Scene.player.currentFacingAngle.y,Math.PI/4);
		});
	};
}

function createTorchFire(scene, attachTo) {
	
	// Create a particle system
	var index = attachTo.torchFire.push(new BABYLON.ParticleSystem("particles", 1000, scene)) - 1;

    //Texture of each particle
    attachTo.torchFire[index].particleTexture = new BABYLON.Texture("./Textures/flame.png", scene);

    // Where the particles come from
    attachTo.torchFire[index].minEmitBox = new BABYLON.Vector3(-.1, 0, -.1);// Starting all from
    attachTo.torchFire[index].maxEmitBox = new BABYLON.Vector3(.1, .05, .1); // To...

    // Colors of all particles
    attachTo.torchFire[index].color1 = new BABYLON.Color4(1, 0.7, 0.7, 1.0);
    attachTo.torchFire[index].color2 = new BABYLON.Color4(0.5, 0.2, 0.2, 1.0);
    attachTo.torchFire[index].colorDead = new BABYLON.Color4(0.2, 0, 0, 0.0);

    // Size of each particle (random between...
    attachTo.torchFire[index].minSize = 0.1;
    attachTo.torchFire[index].maxSize = 0.5;

    // Life time of each particle (random between...
    attachTo.torchFire[index].minLifeTime = 0.3;
    attachTo.torchFire[index].maxLifeTime = 1;

    // Emission rate
    attachTo.torchFire[index].emitRate = 800;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    attachTo.torchFire[index].blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

	// Set the gravity of all particles
	attachTo.torchFire[index].gravity = new BABYLON.Vector3(0, 8, 0);

	// Direction of each particle after it has been emitted
    attachTo.torchFire[index].direction1 = new BABYLON.Vector3(-.2, 1, .2);
    attachTo.torchFire[index].direction2 = new BABYLON.Vector3(.2, 1, -.2);

    // Angular speed, in radians
    attachTo.torchFire[index].minAngularSpeed = 0;
    attachTo.torchFire[index].maxAngularSpeed = Math.PI;

    // Speed
    attachTo.torchFire[index].minEmitPower = .5;
    attachTo.torchFire[index].maxEmitPower = 1.5;
    attachTo.torchFire[index].updateSpeed = 0.005;

	var Position;
	if (attachTo.absolutePosition == undefined) {
		Position = new BABYLON.Vector3(0, 10, 0);
	}
	else {
		Position = attachTo.absolutePosition;
	}
    attachTo.torchFire[index].light = new BABYLON.PointLight("Omni", Position, scene);
	attachTo.torchFire[index].light.diffuse = new BABYLON.Color3(.6, .4, .2);
	attachTo.torchFire[index].light.specular = new BABYLON.Color3(.1, .05, .05);
	// attachTo.torchFire[index].light.diffuse = new BABYLON.Color3(.6, .4, .2);
	// attachTo.torchFire[index].light.specular = new BABYLON.Color3(.3, .2, .2);
}

function createMaterials(Scene) {
	//Create me some textures
	//Tile Type detailed materials
	var randomColor = new BABYLON.Color3(getRandomInt(0,10)/10, getRandomInt(0,10)/10, getRandomInt(0,10)/10);
	// randomColor =  new BABYLON.Color3(0,0,0); // awesome black tiles
	//Wall
	bjsHelper.tileType[0].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[0].name, Scene);
	bjsHelper.tileType[0].material.diffuseTexture = new BABYLON.Texture('./Textures/Wall_Texture-2.png', Scene);
	bjsHelper.tileType[0].material.diffuseTexture.wAng=0;
	bjsHelper.tileType[0].material.diffuseTexture.uScale=1;
	// bjsHelper.tileType[0].material.diffuseTexture.vOffset=-1;
	bjsHelper.tileType[0].material.bumpTexture = new BABYLON.Texture('./Textures/Wall_BumpTexture-2.png', Scene);
	bjsHelper.tileType[0].material.bumpTexture.uScale=1;
	bjsHelper.tileType[0].material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	//Floor
	bjsHelper.tileType[1].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[1].name, Scene);
	bjsHelper.tileType[1].material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-2.png', Scene);
	bjsHelper.tileType[1].material.bumpTexture = new BABYLON.Texture('./Textures/Floor_Tile-bump.png', Scene);
	bjsHelper.tileType[1].material.diffuseColor = randomColor;
	//Pillar
	bjsHelper.tileType[2].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[2].name, Scene);
	bjsHelper.tileType[2].material.bumpTexture = new BABYLON.Texture('./Textures/Wall_BumpTexture-2.png', Scene);
	bjsHelper.tileType[2].material.diffuseTexture = new BABYLON.Texture('./Textures/Wall_Texture-2.png', Scene);
	bjsHelper.tileType[2].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Fire
	bjsHelper.tileType[3].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[3].name, Scene);
	bjsHelper.tileType[3].material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-2.png', Scene);
	bjsHelper.tileType[3].material.bumpTexture = new BABYLON.Texture('./Textures/Floor_Tile-bump.png', Scene);
	bjsHelper.tileType[3].material.diffuseColor = randomColor;
	//Door
	bjsHelper.tileType[4].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[4].name, Scene);
	bjsHelper.tileType[4].material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-2.png', Scene);
	bjsHelper.tileType[4].material.bumpTexture = new BABYLON.Texture('./Textures/Floor_Tile-bump.png', Scene);
	bjsHelper.tileType[4].material.diffuseColor = randomColor;
	
    Scene.tileMaterialSword = new BABYLON.StandardMaterial("tile-texture-Sword", Scene);
    Scene.tileMaterialSword.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.7);
	// Scene.tileMaterialSword.specularColor = new BABYLON.Color3(0, 0, 0);
	
	Scene.BlobMaterial = new BABYLON.StandardMaterial("tile-texture-Blob", Scene);
	// Scene.BlobMaterial.diffuseTexture = new BABYLON.Texture('./Textures/stone1.jpg', Scene);
    Scene.BlobMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.3);
    Scene.BlobMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
}
