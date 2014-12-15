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

Game.CreateStartScene = function() {
    //Creation of the scene 
    var scene = new BABYLON.Scene(Game.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = 0;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, 40, new BABYLON.Vector3.Zero(), scene);
	scene.camera.attachControl(Game.canvas, true);
    // //set camera to not move
    // scene.camera.lowerAlphaLimit = Alpha;
    // scene.camera.upperAlphaLimit = Alpha;
    // scene.camera.lowerBetaLimit = Beta;
    // scene.camera.upperBetaLimit = Beta;
	
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .9);
	scene.ambientLight.specular = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.intensity = .1;
	
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
	
	scene.floor = new BABYLON.Mesh.CreateBox('floor',1,scene);
	scene.floor.scaling = new BABYLON.Vector3(100,100,1);
	scene.floor.position = new BABYLON.Vector3(0,0,-15);
	scene.floor.material = new BABYLON.StandardMaterial("textureFloor", scene);
	scene.floor.material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-1.png', scene);
	scene.floor.material.diffuseTexture.uScale=20;
	scene.floor.material.diffuseTexture.vScale=20;
	scene.floor.material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
	
	scene.isLoaded=false;
	BABYLON.SceneLoader.ImportMesh("", "Models3D/", "StartScene.b.js", scene, function (meshes) {
		scene.doorFrame = meshes;
		
		BABYLON.SceneLoader.ImportMesh("", "Models3D/", "TorchTopFrame.b.js", scene, function (newMeshes) {
			scene.torchTop = newMeshes[0];
			
			scene.torchTop.isVisible = false;
			scene.doorFrame[0].isVisible = true;
			scene.doorFrame.push(scene.torchTop.clone());
			scene.doorFrame.push(scene.torchTop.clone());
			var arrayLength = scene.doorFrame.length;
			for (var j=1;j < arrayLength;j++){
				scene.doorFrame[j].parent = scene.doorFrame[0];
				scene.doorFrame[j].isVisible = true;
			}
			//create left and right torch tops
			scene.doorFrame[arrayLength-1].position = new BABYLON.Vector3(1.5,3.2,-1.7);
			scene.doorFrame[arrayLength-2].position = new BABYLON.Vector3(-1.5,3.2,-1.7);
			scene.doorFrame[0].scaling = new BABYLON.Vector3(6.5, 6, 6);
			scene.doorFrame[0].rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
			scene.doorFrame[0].position = new BABYLON.Vector3(0, -2, -14.5);
			
			scene.doorFrame[arrayLength-1].torchFire = [];
			scene.doorFrame[arrayLength-2].torchFire = [];
			createTorchFire(scene, scene.doorFrame[arrayLength-1]);
			createTorchFire(scene, scene.doorFrame[arrayLength-2]);
			scene.doorFrame[arrayLength-1].torchFire[0].emitter = scene.doorFrame[arrayLength-1]; // the starting object, the emitter
			scene.doorFrame[arrayLength-2].torchFire[0].emitter = scene.doorFrame[arrayLength-2]; // the starting object, the emitter
			// Start the particle system
			scene.doorFrame[arrayLength-1].torchFire[0].start();
			scene.doorFrame[arrayLength-2].torchFire[0].start();
			scene.isLoaded=true;
		});
	});

    scene.registerBeforeRender(function(){
		if (scene.isReady() && scene.rightTorch) {
			var arrayLength = scene.doorFrame.length;
			scene.doorFrame[arrayLength-1].torchFire[0].emitRate = getRandomInt(500, 1500);
			scene.doorFrame[arrayLength-1].torchFire[0].emitRate = getRandomInt(600, 1600);
			scene.doorFrame[arrayLength-1].torchFire[0].light.specular = new BABYLON.Color3(getRandomInt(3, 5)/10, .3, .3);
			scene.doorFrame[arrayLength-1].torchFire[0].light.specular = new BABYLON.Color3(getRandomInt(3, 5)/10, .3, .3);
		}
	});

    return scene;

}

Game.CreateGameScene = function() {
    //Creation of the scene 
    var scene = new BABYLON.Scene(Game.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = Math.PI/16;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, RoomHeight*13.2, new BABYLON.Vector3.Zero(), scene);
	scene.camera.attachControl(Game.canvas, true);
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

    scene.rooms = Game.map.rooms;
    scene.door = 0;
	scene.isLoaded=false;
	BABYLON.SceneLoader.ImportMesh("", "Models3D/", "FunSword.b.js", scene, function (meshes, particleSystems) {
		var m = meshes[0];
		m.isVisible = true;
		
		m.scaling = new BABYLON.Vector3(2, 2, 2);
		m.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/8);
		//instantiate player
		scene.player = new Entity(m,{type: EntityType.Player, health: 4, damage: 1, speed: 1});
		//scene.player.mesh.showBoundingBox = true;
		scene.player.mesh.checkCollisions = true;
		//Set the ellipsoid around the camera (e.g. your player's size)
		scene.player.mesh.ellipsoid = new BABYLON.Vector3(3, 1, 3);
		scene.player.mesh.previousRotation = scene.player.mesh.rotation.y;
		
		// Setup the collision meshes
		scene.player.bodyMesh =  BABYLON.Mesh.CreateCylinder("playerBodyMesh", 2, 1, 1, 10, scene);
		scene.player.bodyMesh.parent = scene.player.mesh;
		scene.player.bodyMesh.isVisible = false;
		//scene.player.bodyMesh.showBoundingBox = true;
		// scene.player.bodyMesh.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/8);
		
		scene.player.weaponMesh =  BABYLON.Mesh.CreateCylinder("playerWeaponMesh", 4.2, 1, 1, 10, scene);	
		scene.player.weaponMesh.parent = scene.player.mesh;
		scene.player.weaponMesh.position.y=3.5;
		scene.player.weaponMesh.isVisible = false;
		//scene.player.weaponMesh.showBoundingBox = true;
		
		scene.player.mesh.playerAnimations = new playerAnimations();
		//set up the action manager for attacks
		scene.actionManager = new BABYLON.ActionManager(scene);
		// Detect player input, then play attack animation
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
				if (evt.sourceEvent.keyCode == KEYS.SPACE) {
					if (scene.player.attacking==false) {
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
				for (var i_room=0; i_room < Game.map.rooms.length; i_room++) {
					if (Game.map.rooms[i_room].type != RoomType.Empty) {
						//set room properties
						scene.rooms[i_room].originOffset = new BABYLON.Vector3(Game.map.rooms[i_room].col*Game.map.rooms[i_room].width*Game.map.rooms[i_room].tiles[0].width,0,-Game.map.rooms[i_room].row*Game.map.rooms[i_room].height*Game.map.rooms[i_room].tiles[0].width);
						scene.rooms[i_room].centerPosition = new BABYLON.Vector3((Game.map.rooms[i_room].width-1)/2*Game.map.rooms[i_room].tiles[0].width,0,(Game.map.rooms[i_room].height-1)/2*Game.map.rooms[i_room].tiles[0].width);
						scene.rooms[i_room].index=i_room;
						scene.rooms[i_room].enemy=[];
						scene.rooms[i_room].door=[];
						for (var i = 0; i < Game.map.rooms[i_room].tiles.length ; i++) {
							scene.rooms[i_room].tiles[i].mesh = Game.drawTile(scene, Game.map.rooms[i_room].tiles[i],i);
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
						
						if (Game.map.rooms[i_room].type == RoomType.Entrance) {
							scene.camera.target = new BABYLON.Vector3(scene.rooms[i_room].originOffset.x+scene.rooms[i_room].centerPosition.x, 0, scene.rooms[i_room].originOffset.z-scene.rooms[i_room].centerPosition.z);
							//set active room to entrance
							scene.activeRoom=Game.map.rooms[i_room];
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
				x0=Game.map.rooms[entranceIndex].col*Game.map.rooms[entranceIndex].width*Game.map.rooms[entranceIndex].tiles[0].width+(Math.floor(Game.map.rooms[entranceIndex].width/2)*Game.map.rooms[entranceIndex].tiles[0].width);
				z0=-Game.map.rooms[entranceIndex].row*Game.map.rooms[entranceIndex].height*Game.map.rooms[entranceIndex].tiles[0].width-((Game.map.rooms[entranceIndex].height-1)*Game.map.rooms[entranceIndex].tiles[0].width);
				
				scene.player.mesh.position = new BABYLON.Vector3(x0, 50, z0+10);
				scene.player.mesh.applyGravity=true;
				scene.isLoaded=true;
			});
		});
    });
	
	scene.joystick = new BABYLON.GameFX.VirtualJoystick(true,"white");
	scene.joystickAction = new BABYLON.GameFX.VirtualJoystick(false,"yellow");
	//scene.joystick.deltaJoystickVector = new BABYLON.Vector2(0,0);
	//scene.joystickAction._isPressed = false;

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

Game.drawTile = function(activeScene, tile, index) {

    var newMesh = new BABYLON.Mesh.CreateBox(bjsHelper.tileType[tile.type].name + '-' + parseInt(index), 1.0, activeScene);
    newMesh.scaling = bjsHelper.tileType[tile.type].scale;
    newMesh.position = new BABYLON.Vector3(tile.col*tile.width, bjsHelper.tileType[tile.type].yOffset, -tile.row*tile.width);
    newMesh.material = bjsHelper.tileType[tile.type].material;

    return newMesh;
}

function spawnEnemy(activeScene, room) {
	//var activeScene = Game.scene[this.activeScene];
	//TO DO: Implement other enemy types, for now just a rolling ball, who has lost his chain
	var index = room.enemy.length;
	var enemyIndex = room.enemy.push(new Entity(new BABYLON.Mesh.CreateSphere("enemySphere-" + parseInt(index), 8.0, 8.0, activeScene), {type: EntityType.Sphere, health: 2, damage: 1, speed: 1})) - 1;
	room.enemy[enemyIndex].index = enemyIndex;
	
	var randomTile = getRandomInt(0, (room.width*room.height)-1);
	while (room.tiles[randomTile].type != TileType.Floor) {
		randomTile = getRandomInt(0, (room.width*room.height)-1);
	}
	var tileIndex = room.tiles[randomTile].row*room.tiles[randomTile].width + room.tiles[randomTile].col;
	room.enemy[enemyIndex].mesh.position = new BABYLON.Vector3(room.tiles[randomTile].mesh.position.x, 1, room.tiles[randomTile].mesh.position.z);
	room.enemy[enemyIndex].mesh.scaling = new BABYLON.Vector3(1, 1, 1);
	room.enemy[enemyIndex].mesh.material =new activeScene.enemyMaterial();
	//room.enemy[enemyIndex].mesh.showBoundingBox = true;
	
	room.enemy[enemyIndex].mesh.checkCollisions = true;
	room.enemy[enemyIndex].mesh.applyGravity = true;
	//Set the ellipsoid around the camera (e.g. your player's size)
	room.enemy[enemyIndex].mesh.ellipsoid = new BABYLON.Vector3(2, 1, 2);
	
	//attach animations
	room.enemy[enemyIndex].mesh.enemyAnimations = new enemyAnimations();
	
	// create intersect action
	room.enemy[enemyIndex].mesh.actionManager = new BABYLON.ActionManager(activeScene);
	// detect collision between enemy and player's weapon for an attack
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.weaponMesh}, function (data) {
		var test = data;
		if (activeScene.player.attacking == true) {
			room.enemy[enemyIndex].health--;
			if (room.enemy[enemyIndex].health <=0) {
				room.enemy[enemyIndex].mesh.enemyAnimations.die(activeScene,room.enemy[enemyIndex]);
			}
			else {
				room.enemy[enemyIndex].mesh.enemyAnimations.takeDmg(activeScene,room.enemy[enemyIndex].mesh);
			}
		}
	}));
	
	// Detect intersect between enemy and player's bodyMesh for an attack on player
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.bodyMesh}, function (data) {
		var test = data;
		if (activeScene.player.attacking != true) {
			activeScene.player.health--;
			$('#dmg').text('Health: ' + parseInt(activeScene.player.health));
			//TO DO:this can be handled better if we use knockout.js
			if (activeScene.player.health == 3 ) {
				$('#healthBar-4').hide();
			}
			else if (activeScene.player.health == 2 ) {
				$('#healthBar-3').hide();
			}
			else if (activeScene.player.health == 1 ) {
				$('#healthBar-2').hide();
			}
			else if (activeScene.player.health <= 0 ) {
				$('#healthBar-1').hide();
				activeScene.player.mesh.playerAnimations.die(activeScene,activeScene.player.mesh);
			}
			activeScene.player.mesh.playerAnimations.takeDmg(activeScene,activeScene.player.mesh);
		}
	}));
	
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.weaponMesh }, function (evt) {

	}));
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.bodyMesh }, function (evt) {

	}));

}

function playerAnimations() {
	var self = this
	self.animating = 0;
	
	self.updateIdle = function (activeScene) {
		//var activeScene = Game.scene[Game.activeScene];
		//create animations for player
		activeScene.idleAnimation = new BABYLON.Animation("idleAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		// Animation keys
		activeScene.idleAnimation.tempKeys = [];
		//At the animation key 0, the value of scaling is "1"
		activeScene.idleAnimation.tempKeys.push({
			frame: 0,
			value: activeScene.player.mesh.currentFacingAngle.add(new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4))
		});
		activeScene.idleAnimation.tempKeys.push({
			frame: 30,
			value: new BABYLON.Vector3(Math.PI/3, Math.PI/1.8, Math.PI/3)
		});
		activeScene.idleAnimation.tempKeys.push({
			frame: 60,
			value: new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4)
		});
		//Adding keys to the animation object
		activeScene.idleAnimation.setKeys(activeScene.idleAnimation.tempKeys);
		activeScene.player.mesh.animations.push(activeScene.idleAnimation);
	};
	
	self.updateAttack = function (activeScene) {
		//var activeScene = Game.scene[Game.activeScene];
		// ensure no other animations are active
		if (self.animating == 0) {
			activeScene.player.attacking=true;
			self.animating = 1;
			//create animations for player
			activeScene.attackAnimation = new BABYLON.Animation("attackAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// Animation keys
			activeScene.attackAnimation.tempKeys = [];
			//At the animation key 0, the value of scaling is "1"
			activeScene.attackAnimation.tempKeys.push({
				frame: 0,
				value: new BABYLON.Vector3(0, activeScene.player.mesh.currentFacingAngle.y + Math.PI/2.2, Math.PI/2)
			});
			activeScene.attackAnimation.tempKeys.push({
				frame: 10,
				value: new BABYLON.Vector3(0, activeScene.player.mesh.currentFacingAngle.y - 0.8, Math.PI/2)
			});
			//Adding keys to the animation object
			activeScene.attackAnimation.setKeys(activeScene.attackAnimation.tempKeys);
			if (activeScene.player.mesh.animations == undefined) {
				activeScene.player.mesh.animations.push(activeScene.attackAnimation);
			}
			else {
				activeScene.player.mesh.animations[0] = activeScene.attackAnimation;
			}
			activeScene.beginAnimation(activeScene.player.mesh, 0, 10, false, 1.0, function () {
				activeScene.player.attacking=false;
				self.animating=0;
				// Scene.player.Attack=0;
				activeScene.player.mesh.rotation = new BABYLON.Vector3(Math.PI/6,activeScene.player.mesh.currentFacingAngle.y,Math.PI/8);
			});
		}
	};
	
	self.takeDmg = function (activeScene, entity) {
		//var activeScene = Game.scene[Game.activeScene];
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
			activeScene.beginAnimation(entity, 0,15, false, 1.0, function () {
				self.animating=0;
			});
		}
	};
	
	self.die = function (activeScene, entity) {
		//var activeScene = Game.scene[Game.activeScene];
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
		activeScene.beginAnimation(entity, 0, 15, false, 1.0, function () {
			entity.dispose();
		});
	};
}

function enemyAnimations() {
	
	this.die = function (activeScene, entity) {
		//var activeScene = Game.scene[Game.activeScene];
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
		activeScene.beginAnimation(entity.mesh, 0, 15, false, 1.0, function () {
			entity.mesh.dispose();
			entity.mesh.actionManager.actions = []; // remove actions
			// activeScene.activeRoom.enemy.splice(entity.index, 1);
		});
	};
	
	this.takeDmg = function (activeScene, entityMesh) {
		//var activeScene = Game.scene[Game.activeScene];
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
		activeScene.beginAnimation(entityMesh, 0,15, false, 1.0);
	};
	
}

function createTorchFire(activeScene, attachTo) {
	//var activeScene = Game.scene[Game.activeScene];
	
	// Create a particle system
	var index = attachTo.torchFire.push(new BABYLON.ParticleSystem("particles", 1000, activeScene)) - 1;

    //Texture of each particle
    attachTo.torchFire[index].particleTexture = new BABYLON.Texture("./Textures/flame.png", activeScene);

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
    attachTo.torchFire[index].light = new BABYLON.PointLight("Omni", Position, activeScene);
	attachTo.torchFire[index].light.diffuse = new BABYLON.Color3(.6, .4, .2);
	attachTo.torchFire[index].light.specular = new BABYLON.Color3(.1, .05, .05);
	// attachTo.torchFire[index].light.diffuse = new BABYLON.Color3(.6, .4, .2);
	// attachTo.torchFire[index].light.specular = new BABYLON.Color3(.3, .2, .2);
}

function createMaterials(activeScene) {
	//var activeScene = Game.scene[Game.activeScene];
	//Create me some textures
	//Tile Type detailed materials
	var randomColor = new BABYLON.Color3(getRandomInt(0,10)/10, getRandomInt(0,10)/10, getRandomInt(0,10)/10);
	// randomColor =  new BABYLON.Color3(0,0,0); // awesome black tiles
	//Wall
	bjsHelper.tileType[0].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[0].name, activeScene);
	bjsHelper.tileType[0].material.diffuseTexture = new BABYLON.Texture('./Textures/Wall_Texture-2.png', activeScene);
	bjsHelper.tileType[0].material.diffuseTexture.wAng=0;
	bjsHelper.tileType[0].material.diffuseTexture.uScale=1;
	// bjsHelper.tileType[0].material.diffuseTexture.vOffset=-1;
	bjsHelper.tileType[0].material.bumpTexture = new BABYLON.Texture('./Textures/Wall_BumpTexture-2.png', activeScene);
	bjsHelper.tileType[0].material.bumpTexture.uScale=1;
	bjsHelper.tileType[0].material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	//Floor
	bjsHelper.tileType[1].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[1].name, activeScene);
	bjsHelper.tileType[1].material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-2.png', activeScene);
	bjsHelper.tileType[1].material.bumpTexture = new BABYLON.Texture('./Textures/Floor_Tile-bump.png', activeScene);
	bjsHelper.tileType[1].material.diffuseColor = randomColor;
	//Pillar
	bjsHelper.tileType[2].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[2].name, activeScene);
	bjsHelper.tileType[2].material.bumpTexture = new BABYLON.Texture('./Textures/Wall_BumpTexture-2.png', activeScene);
	bjsHelper.tileType[2].material.diffuseTexture = new BABYLON.Texture('./Textures/Wall_Texture-2.png', activeScene);
	bjsHelper.tileType[2].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Fire
	bjsHelper.tileType[3].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[3].name, activeScene);
	bjsHelper.tileType[3].material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-2.png', activeScene);
	bjsHelper.tileType[3].material.bumpTexture = new BABYLON.Texture('./Textures/Floor_Tile-bump.png', activeScene);
	bjsHelper.tileType[3].material.diffuseColor = randomColor;
	//Door
	bjsHelper.tileType[4].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[4].name, activeScene);
	bjsHelper.tileType[4].material.diffuseTexture = new BABYLON.Texture('./Textures/Floor_Tile-2.png', activeScene);
	bjsHelper.tileType[4].material.bumpTexture = new BABYLON.Texture('./Textures/Floor_Tile-bump.png', activeScene);
	bjsHelper.tileType[4].material.diffuseColor = randomColor;
	
    activeScene.tileMaterialSword = new BABYLON.StandardMaterial("tile-texture-Sword", activeScene);
    activeScene.tileMaterialSword.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.7);
	// activeScene.tileMaterialSword.specularColor = new BABYLON.Color3(0, 0, 0);
	
	activeScene.enemyMaterial = function () {
		$.extend(this,new BABYLON.StandardMaterial("enemyMaterial", activeScene));
		// this.diffuseTexture = new BABYLON.Texture('./Textures/stone1.jpg', activeScene);
		this.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.3);
		this.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	}
}
