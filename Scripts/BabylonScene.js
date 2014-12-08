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
	scene.isLoaded=0;
	BABYLON.SceneLoader.ImportMesh("", "Models3D/", "FunSword.b.js", scene, function (meshes, particleSystems) {
		var m = meshes[0];
		m.isVisible = true;
		
		m.scaling = new BABYLON.Vector3(2, 2, 2);
		m.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/8);
		//instantiate player
		scene.player = new Entity(m,{type: EntityType.Player, health: 4, damage: 1, speed: 1});
		scene.player.mesh.checkCollisions = true;
		//Set the ellipsoid around the camera (e.g. your player's size)
		scene.player.mesh.ellipsoid = new BABYLON.Vector3(3, 1, 3);
		scene.player.mesh.previousRotation = scene.player.mesh.rotation.y;
		
		// Setup the collision meshes
		scene.player.bodyMesh =  BABYLON.Mesh.CreateCylinder("playerBodyMesh", 2, 1, 1, 10, scene);
		scene.player.bodyMesh.parent = scene.player.mesh;
		scene.player.bodyMesh.isVisible = false;
		
		scene.player.mesh.weaponMesh =  BABYLON.Mesh.CreateCylinder("playerBodyMesh", 4.2, 1, 1, 10, scene);	
		scene.player.mesh.weaponMesh.parent = scene.player.mesh;
		scene.player.mesh.weaponMesh.position.y=3.5;
		scene.player.mesh.weaponMesh.isVisible = false;
		
		scene.player.mesh.playerAnimations = new playerAnimations();
		//set up the action manager for attacks
		scene.actionManager = new BABYLON.ActionManager(scene);
		// Detect player input, then play attack animation
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
				if (evt.sourceEvent.keyCode == KEYS.SPACE) {
					if (scene.player.attacking==0) {
						scene.player.mesh.playerAnimations.updateAttack(scene);
					}
				}
		}));
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
							// scene.rooms[i_room].tiles[i].mesh.useOctreeForRenderingSelection = true;
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
						
						//Spawn an enemy on some random tile
						var maxEmenies = getRandomInt(1,3);
						for (var iSpawn = 0; iSpawn < maxEmenies; iSpawn++) {
							spawnEnemy(scene, scene.rooms[i_room]);
						}
					}
				}
				var entranceIndex=scene.activeRoom.index;
				x0=map.rooms[entranceIndex].col*map.rooms[entranceIndex].width*map.rooms[entranceIndex].tiles[0].width+(Math.floor(map.rooms[entranceIndex].width/2)*map.rooms[entranceIndex].tiles[0].width);
				z0=-map.rooms[entranceIndex].row*map.rooms[entranceIndex].height*map.rooms[entranceIndex].tiles[0].width-((map.rooms[entranceIndex].height-1)*map.rooms[entranceIndex].tiles[0].width);
				
				scene.player.mesh.position = new BABYLON.Vector3(x0, 50, z0+10);
				scene.player.mesh.applyGravity=true;
				scene.isLoaded=1;
			});
		});
    });
	
	scene.joystick = new BABYLON.GameFX.VirtualJoystick(true);

    scene.registerBeforeRender(function(){
		// if(scene.isErrthingReady) {
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

function spawnEnemy(Scene, room) {
	//TO DO: Implement other enemy types, for now just a rolling ball, who has lost his chain
	var index = room.enemy.length;
	var enemyIndex = room.enemy.push(new Entity(new BABYLON.Mesh.CreateSphere("enemySphere-" + parseInt(index), 8.0, 8.0, Scene), {type: EntityType.Sphere, health: 2, damage: 1, speed: 1})) - 1;
	room.enemy[enemyIndex].index = enemyIndex;
	
	var randomTile = getRandomInt(0, (room.width*room.height)-1);
	while (room.tiles[randomTile].type != TileType.Floor) {
		randomTile = getRandomInt(0, (room.width*room.height)-1);
	}
	var tileIndex = room.tiles[randomTile].row*room.tiles[randomTile].width + room.tiles[randomTile].col;
	room.enemy[enemyIndex].mesh.position = new BABYLON.Vector3(room.tiles[randomTile].mesh.position.x, 1, room.tiles[randomTile].mesh.position.z);
	room.enemy[enemyIndex].mesh.scaling = new BABYLON.Vector3(1, 1, 1);
	room.enemy[enemyIndex].mesh.material =new Scene.enemyMaterial();
	
	room.enemy[enemyIndex].mesh.checkCollisions = true;
	room.enemy[enemyIndex].mesh.applyGravity = true;
	//Set the ellipsoid around the camera (e.g. your player's size)
	room.enemy[enemyIndex].mesh.ellipsoid = new BABYLON.Vector3(2, 1, 2);
	
	//attach animations
	room.enemy[enemyIndex].mesh.enemyAnimations = new enemyAnimations();
	
	// create intersect action
	room.enemy[enemyIndex].mesh.actionManager = new BABYLON.ActionManager(scene);
	// Detect player input, then play animation after executing function
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: scene.player.mesh.weaponMesh}, function (evt) {
		if (scene.player.attacking == 1) {
			room.enemy[enemyIndex].health--;
			if (room.enemy[enemyIndex].health <=0) {
				room.enemy[enemyIndex].mesh.enemyAnimations.die(Scene,room.enemy[enemyIndex]);
			}
			else {
				room.enemy[enemyIndex].mesh.enemyAnimations.takeDmg(Scene,room.enemy[enemyIndex].mesh);
			}
		}
	}));
	
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: scene.player.bodyMesh}, function (evt) {
		if (scene.player.attacking != 1) {
			Scene.player.health--;
			//TO DO:this can be handled better if we use knockout.js
			if (Scene.player.health == 3 ) {
				$('#healthBar-4').hide();
			}
			else if (Scene.player.health == 2 ) {
				$('#healthBar-3').hide();
			}
			else if (Scene.player.health == 1 ) {
				$('#healthBar-2').hide();
			}
			else if (Scene.player.health <= 0 ) {
				$('#healthBar-1').hide();
				Scene.player.mesh.playerAnimations.die(Scene,Scene.player.mesh);
			}
			Scene.player.mesh.playerAnimations.takeDmg(Scene,Scene.player.mesh);
		}
	}));
	
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: scene.player.mesh.weaponMesh }, function (evt) {

	}));
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: scene.player.bodyMesh }, function (evt) {

	}));

}

function playerAnimations() {
	var self = this
	self.animating = 0;
	
	self.updateIdle = function (Scene) {
		//create animations for player
		Scene.idleAnimation = new BABYLON.Animation("idleAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		// Animation keys
		Scene.idleAnimation.tempKeys = [];
		//At the animation key 0, the value of scaling is "1"
		Scene.idleAnimation.tempKeys.push({
			frame: 0,
			value: Scene.player.mesh.currentFacingAngle.add(new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4))
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
		Scene.player.mesh.animations.push(scene.idleAnimation);
	};
	
	self.updateAttack = function (Scene) {
		// ensure no other animations are active
		if (self.animating == 0) {
			Scene.player.attacking=1;
			self.animating = 1;
			//create animations for player
			Scene.attackAnimation = new BABYLON.Animation("attackAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// Animation keys
			Scene.attackAnimation.tempKeys = [];
			//At the animation key 0, the value of scaling is "1"
			Scene.attackAnimation.tempKeys.push({
				frame: 0,
				value: new BABYLON.Vector3(0, Scene.player.mesh.currentFacingAngle.y + Math.PI/2.2, Math.PI/2)
			});
			Scene.attackAnimation.tempKeys.push({
				frame: 10,
				value: new BABYLON.Vector3(0, Scene.player.mesh.currentFacingAngle.y - 0.8, Math.PI/2)
			});
			//Adding keys to the animation object
			Scene.attackAnimation.setKeys(Scene.attackAnimation.tempKeys);
			if (Scene.player.mesh.animations == undefined) {
				Scene.player.mesh.animations.push(Scene.attackAnimation);
			}
			else {
				Scene.player.mesh.animations[0] = Scene.attackAnimation;
			}
			Scene.beginAnimation(Scene.player.mesh, 0, 10, false, 1.0, function () {
				Scene.player.attacking=0;
				self.animating=0;
				// Scene.player.Attack=0;
				Scene.player.mesh.rotation = new BABYLON.Vector3(Math.PI/6,Scene.player.mesh.currentFacingAngle.y,Math.PI/8);
			});
		}
	};
	
	self.takeDmg = function (Scene, entity) {
		// ensure no other animations are active
		if (self.animating == 0) {
			self.animating = 1;
			//create animations for player
			entity.attackAnimation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// Animation keys
			entity.attackAnimation.tempKeys = [];
			//At the animation key 0, the value of scaling is "1"
			entity.attackAnimation.tempKeys.push({
				frame: 0,
				value: new BABYLON.Color3(1,0,0)
			});
			entity.attackAnimation.tempKeys.push({
				frame: 5,
				value: new BABYLON.Color3(0,0,0)
			});
			entity.attackAnimation.tempKeys.push({
				frame: 10,
				value: new BABYLON.Color3(1,0,0)
			});
			entity.attackAnimation.tempKeys.push({
				frame: 15,
				value: new BABYLON.Color3(0,0,0)
			});
			//Adding keys to the animation object
			entity.attackAnimation.setKeys(entity.attackAnimation.tempKeys);
			if (entity.animations == undefined) {
				entity.animations.push(entity.attackAnimation);
			}
			else {
				entity.animations[0] = entity.attackAnimation;
			}
			Scene.beginAnimation(entity, 0,15, false, 1.0, function () {
				self.animating=0;
			});
		}
	};
	
	self.die = function (Scene, entity) {
		//create animations for player
		entity.attackAnimation = new BABYLON.Animation("dieAnimation", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		// Animation keys
		entity.attackAnimation.tempKeys = [];
		var startScaling = entity.scaling;
		//At the animation key 0, the value of scaling is "1"
		entity.attackAnimation.tempKeys.push({
			frame: 0,
			value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
		});
		entity.attackAnimation.tempKeys.push({
			frame: 5,
			value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
		});
		entity.attackAnimation.tempKeys.push({
			frame: 10,
			value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
		});
		entity.attackAnimation.tempKeys.push({
			frame: 15,
			value: new BABYLON.Vector3(.25, .25, .25)
		});
		//Adding keys to the animation object
		entity.attackAnimation.setKeys(entity.attackAnimation.tempKeys);
		if (entity.animations == undefined) {
			entity.animations.push(entity.attackAnimation);
		}
		else {
			entity.animations[0] = entity.attackAnimation;
		}
		Scene.beginAnimation(entity, 0, 15, false, 1.0, function () {
			entity.dispose();
		});
	};
}

function enemyAnimations() {
	
	this.die = function (Scene, entity) {
		//create animations for player
		entity.mesh.attackAnimation = new BABYLON.Animation("dieAnimation", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		// Animation keys
		entity.mesh.attackAnimation.tempKeys = [];
		var startScaling = entity.mesh.scaling;
		//At the animation key 0, the value of scaling is "1"
		entity.mesh.attackAnimation.tempKeys.push({
			frame: 0,
			value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
		});
		entity.mesh.attackAnimation.tempKeys.push({
			frame: 5,
			value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
		});
		entity.mesh.attackAnimation.tempKeys.push({
			frame: 10,
			value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
		});
		entity.mesh.attackAnimation.tempKeys.push({
			frame: 15,
			value: new BABYLON.Vector3(.25, .25, .25)
		});
		//Adding keys to the animation object
		entity.mesh.attackAnimation.setKeys(entity.mesh.attackAnimation.tempKeys);
		if (entity.mesh.animations == undefined) {
			entity.mesh.animations.push(entity.mesh.attackAnimation);
		}
		else {
			entity.mesh.animations[0] = entity.mesh.attackAnimation;
		}
		Scene.beginAnimation(entity.mesh, 0, 15, false, 1.0, function () {
			entity.mesh.dispose();
			entity.mesh.actionManager.actions = []; // remove actions
			// Scene.activeRoom.enemy.splice(entity.index, 1);
		});
	};
	
	this.takeDmg = function (Scene, entityMesh) {
		//create animations for player
		entityMesh.attackAnimation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		// Animation keys
		entityMesh.attackAnimation.tempKeys = [];
		//At the animation key 0, the value of scaling is "1"
		entityMesh.attackAnimation.tempKeys.push({
			frame: 0,
			value: new BABYLON.Color3(1,0,0)
		});
		entityMesh.attackAnimation.tempKeys.push({
			frame: 5,
			value: new BABYLON.Color3(0,0,0)
		});
		entityMesh.attackAnimation.tempKeys.push({
			frame: 10,
			value: new BABYLON.Color3(1,0,0)
		});
		entityMesh.attackAnimation.tempKeys.push({
			frame: 15,
			value: new BABYLON.Color3(0,0,0)
		});
		//Adding keys to the animation object
		entityMesh.attackAnimation.setKeys(entityMesh.attackAnimation.tempKeys);
		if (entityMesh.animations == undefined) {
			entityMesh.animations.push(entityMesh.attackAnimation);
		}
		else {
			entityMesh.animations[0] = entityMesh.attackAnimation;
		}
		Scene.beginAnimation(entityMesh, 0,15, false, 1.0);
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
	
	Scene.enemyMaterial = function () {
		$.extend(this,new BABYLON.StandardMaterial("enemyMaterial", Scene));
		// this.diffuseTexture = new BABYLON.Texture('./Textures/stone1.jpg', Scene);
		this.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.3);
		this.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	}
}
