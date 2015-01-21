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
    var Beta = 0.00000001;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, 40, new BABYLON.Vector3.Zero(), scene);
	scene.camera.attachControl(Game.canvas, true);
    // //set camera to not move
    scene.camera.lowerAlphaLimit = Alpha;
    scene.camera.upperAlphaLimit = Alpha;
    scene.camera.lowerBetaLimit = Beta;
    scene.camera.upperBetaLimit = Beta;
	
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
			scene.doorFrame[arrayLength-1].torchFire[0].emitRate = Game.getRandomInt(500, 1500);
			scene.doorFrame[arrayLength-1].torchFire[0].emitRate = Game.getRandomInt(600, 1600);
			scene.doorFrame[arrayLength-1].torchFire[0].light.specular = new BABYLON.Color3(Game.getRandomInt(3, 5)/10, .3, .3);
			scene.doorFrame[arrayLength-1].torchFire[0].light.specular = new BABYLON.Color3(Game.getRandomInt(3, 5)/10, .3, .3);
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
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, Game.RoomHeight*13.2, new BABYLON.Vector3.Zero(), scene);
	scene.camera.attachControl(Game.canvas, true);
    //set camera to not move
	if (!Game.debug) {
		scene.camera.lowerAlphaLimit = Alpha;
		scene.camera.upperAlphaLimit = Alpha;
		scene.camera.lowerBetaLimit = Beta;
		scene.camera.upperBetaLimit = Beta;
	}
	
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .9);
	scene.ambientLight.specular = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.intensity = 1;
	
	createMaterials(scene);
    scene.rooms = Game.map.rooms;
    scene.door = 0;
	scene.isLoaded=false;

	//create Asset Manager
	scene.assetsManager = new BABYLON.AssetsManager(scene);
	scene.assetsManager.useDefaultLoadingScreen=false;
	
	//create Asset Tasks
	scene.playerTask = scene.assetsManager.addMeshTask("playerTask", "", "./Models3D/", "FunSword.b.js");
	scene.doorFrameTask = scene.assetsManager.addMeshTask("doorFrameTask", "", "./Models3D/", "DoorFrame.b.js");
	scene.torchTopTask = scene.assetsManager.addMeshTask("doorFrameTask", "", "./Models3D/", "TorchTopFrame.b.js");
	scene.doorTask = scene.assetsManager.addMeshTask("doorTask", "", "./Models3D/", "Door.b.js");
	
	//Set functions to assign loaded meshes
	scene.playerTask.onSuccess = function (task) {
		var m = task.loadedMeshes[0];
		m.isVisible = true;
		m.scaling = new BABYLON.Vector3(2, 2, 2);
		m.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/8);
		
		scene.player = new Entity(m,{type: EntityType.Player, health: 4, damage: 1, speed: .6});
		prepareHealthBars();
	}
	scene.doorFrameTask.onSuccess = function (task) {
		scene.doorFrame = task.loadedMeshes;
	}
	scene.torchTopTask.onSuccess = function (task) {
		scene.torchTop = task.loadedMeshes[0];
	}
	scene.doorTask.onSuccess = function (task) {
		scene.doorMesh = task.loadedMeshes[2];
		scene.doorMesh.isVisible = false;
		scene.doorMesh.scaling = new BABYLON.Vector3(4.8, 4.8, 4.8);
	}	
	
	//Set up Scene after all Tasks are complete
	scene.assetsManager.onFinish = function (tasks) {
	
		//scene.player.mesh.showBoundingBox = true;
		scene.player.mesh.checkCollisions = true;
		//Set the ellipsoid around the camera (e.g. your player's size)
		scene.player.mesh.ellipsoid = new BABYLON.Vector3(3, 1.4, 3);
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
		
		scene.player.mesh.playerAnimations = new Game.playerAnimations();
		scene.player.mesh.playerAnimations.init(scene);
		//set up the action manager for attacks
		scene.actionManager = new BABYLON.ActionManager(scene);
		// Detect player input, then play attack animation
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
				if (evt.sourceEvent.keyCode == KEYS.SPACE) {
					if (scene.player.attacking==false) {
						scene.player.mesh.playerAnimations.attack.start(scene,scene.player);
					}
				}
		}));
		
		//Set up initial door and torches
		scene.torchTop.isVisible = false;
		scene.doorFrame[0].isVisible = false;
		scene.doorFrame[0].addLODLevel(Game.performance.viewDistance, null);
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
		
		//create parent tiles for the room
		scene.parentTile = {'mesh': []};
		for (var iParent=0; iParent < bjsHelper.tileType.length; iParent++) {
			Game.createParentTiles(scene, iParent);
		}
		
		//Draw Rooms
		for (var i_room=0; i_room < Game.map.rooms.length; i_room++) {
			if (Game.map.rooms[i_room].type != Game.RoomType.Empty) {
				//set room properties
				scene.rooms[i_room].originOffset = new BABYLON.Vector3(Game.map.rooms[i_room].col*Game.map.rooms[i_room].width*Game.map.rooms[i_room].tiles[0].width,0,-Game.map.rooms[i_room].row*Game.map.rooms[i_room].height*Game.map.rooms[i_room].tiles[0].width);
				scene.rooms[i_room].centerPosition = new BABYLON.Vector3((Game.map.rooms[i_room].width-1)/2*Game.map.rooms[i_room].tiles[0].width,0,(Game.map.rooms[i_room].height-1)/2*Game.map.rooms[i_room].tiles[0].width);
				scene.rooms[i_room].index=i_room;
				scene.rooms[i_room].enemy=[];
				scene.rooms[i_room].enemiesDead=false;
				
				//scene.rooms[i_room].door=[];
				for (var i = 0; i < Game.map.rooms[i_room].tiles.length ; i++) {
					scene.rooms[i_room].tiles[i].mesh = Game.drawTile(scene, Game.map.rooms[i_room].tiles[i],i);
					// scene.rooms[i_room].tiles[i].mesh.useOctreeForRenderingSelection = true;
					//reposition to room location
					scene.rooms[i_room].tiles[i].mesh.position.x=scene.rooms[i_room].tiles[i].mesh.position.x+scene.rooms[i_room].originOffset.x;
					scene.rooms[i_room].tiles[i].mesh.position.z=scene.rooms[i_room].tiles[i].mesh.position.z+scene.rooms[i_room].originOffset.z;
					
					scene.rooms[i_room].tiles[i].mesh.checkCollisions = true;
					scene.rooms[i_room].tiles[i].mesh.tileId = i;
					//create and position doors, adding the torch flame and light
					if (scene.rooms[i_room].tiles[i].type == Game.TileType.Door) {
						var doorIndex = scene.rooms[i_room].tiles[i].doorIndex;
						scene.rooms[i_room].doors[doorIndex].frame.push(scene.doorFrame[0].clone());
						scene.rooms[i_room].doors[doorIndex].frame[0].isVisible = true;
						for (var j=1;j < scene.doorFrame.length;j++) {
							scene.rooms[i_room].doors[doorIndex].frame.push(scene.doorFrame[j].clone());
							scene.rooms[i_room].doors[doorIndex].frame[j].parent = scene.rooms[i_room].doors[doorIndex].frame[0];
							scene.rooms[i_room].doors[doorIndex].frame[j].isVisible = true;
						}
						scene.rooms[i_room].doors[doorIndex].frame[0].position = new BABYLON.Vector3(scene.rooms[i_room].tiles[i].mesh.position.x, -2,scene.rooms[i_room].tiles[i].mesh.position.z);
						var doorRotation = ((scene.rooms[i_room].tiles[i].col==scene.rooms[i_room].width-1)*1 + (scene.rooms[i_room].tiles[i].row==scene.rooms[i_room].height-1)*2 + (scene.rooms[i_room].tiles[i].col==0)*3)*Math.PI/2;
						scene.rooms[i_room].doors[doorIndex].frame[0].rotation = new BABYLON.Vector3(0, doorRotation, 0);
						
						//set up door and matching door
						scene.rooms[i_room].doors[doorIndex].mesh=scene.doorMesh.clone();
						scene.rooms[i_room].doors[doorIndex].mesh.position = new BABYLON.Vector3(scene.rooms[i_room].tiles[i].mesh.position.x, -2,scene.rooms[i_room].tiles[i].mesh.position.z);
						scene.rooms[i_room].doors[doorIndex].mesh.rotation = new BABYLON.Vector3(0, doorRotation, 0);
						if (scene.rooms[i_room].tiles[i].col==scene.rooms[i_room].width-1) { // right
							scene.rooms[i_room].doors[doorIndex].mesh.position.x-=5;
							scene.rooms[i_room].doors[doorIndex].mesh.position.z+=5;
						}
						else if (scene.rooms[i_room].tiles[i].row==scene.rooms[i_room].height-1) { // bottom
							scene.rooms[i_room].doors[doorIndex].mesh.position.x+=5;
							scene.rooms[i_room].doors[doorIndex].mesh.position.z+=5;
						}
						else if (scene.rooms[i_room].tiles[i].col==0) { // left
							scene.rooms[i_room].doors[doorIndex].mesh.position.x+=5;
							scene.rooms[i_room].doors[doorIndex].mesh.position.z-=5;
						}
						else { // top
							scene.rooms[i_room].doors[doorIndex].mesh.position.x-=5;
							scene.rooms[i_room].doors[doorIndex].mesh.position.z-=5;
						}
						scene.rooms[i_room].doors[doorIndex].mesh.isVisible=true;
						scene.rooms[i_room].doors[doorIndex].mesh.checkCollisions = true;
						
						//attach fire to TorchTop
						arrayLength = scene.doorFrame.length-1;
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire = [];
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire = [];
						createTorchFire(scene, scene.rooms[i_room].doors[doorIndex].frame[arrayLength]);
						createTorchFire(scene, scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1]);
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].light.intensity = 3;
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].light.intensity = 3;
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].light.range = 40;
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].light.range = 40;
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].emitter = scene.rooms[i_room].doors[doorIndex].frame[arrayLength];
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].emitter = scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1];
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(false);
						scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(false);
					}
				}
				//Game.activateRoom(scene.rooms[i_room],scene.rooms[i_room]);
				
				if (Game.map.rooms[i_room].type == Game.RoomType.Boss) {
					spawnBoss(scene, scene.rooms[i_room]);
					Game.transportRing = new Game.createTransportRing(scene, scene.rooms[i_room]);
				}
				else {
					//Spawn an enemy on some random tile
					var maxEmenies = Game.getRandomInt(1,3);
					for (var iSpawn = 0; iSpawn < maxEmenies; iSpawn++) {
						spawnEnemy(scene, scene.rooms[i_room]);
					}
				}
				
				//Game.activateRoom(scene.rooms[i_room],scene.rooms[i_room]);
				
				if (Game.map.rooms[i_room].type == Game.RoomType.Entrance) {
					//Game.activateRoom(scene.rooms[i_room]);
					scene.camera.target = new BABYLON.Vector3(scene.rooms[i_room].originOffset.x+scene.rooms[i_room].centerPosition.x, 0, scene.rooms[i_room].originOffset.z-scene.rooms[i_room].centerPosition.z);
					//set active room to entrance
					scene.activeRoom=Game.map.rooms[i_room];
					scene.indexOfEntrance=i_room;
					//activate torch lights
					for (doorIndex = 0; doorIndex < scene.activeRoom.doors.length; doorIndex++) {
						arrayLength = scene.activeRoom.doors[doorIndex].frame.length-1;
						scene.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].start();
						scene.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].start();
						scene.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(true);
						scene.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(true);
					}
					//Game.activateRoom(scene.activeRoom);
				}
				
			}
		}
		var entranceIndex=scene.activeRoom.index;
		x0=Game.map.rooms[entranceIndex].col*Game.map.rooms[entranceIndex].width*Game.map.rooms[entranceIndex].tiles[0].width+(Math.floor(Game.map.rooms[entranceIndex].width/2)*Game.map.rooms[entranceIndex].tiles[0].width);
		z0=-Game.map.rooms[entranceIndex].row*Game.map.rooms[entranceIndex].height*Game.map.rooms[entranceIndex].tiles[0].width-((Game.map.rooms[entranceIndex].height-1)*Game.map.rooms[entranceIndex].tiles[0].width);
		
		scene.player.mesh.position = new BABYLON.Vector3(x0, 50, z0+10);
		scene.player.mesh.applyGravity=true;
		scene.isLoaded=true;
	};
	
	//Load all tasks
	scene.assetsManager.load();
	
	if (Game.debug) {
		scene.joystick = {};
		scene.joystickAction = {};
		scene.joystick.deltaJoystickVector = new BABYLON.Vector2(0,0);
		scene.joystickAction._isPressed = false;
	}
	else {
		scene.joystick = new BABYLON.GameFX.VirtualJoystick(true,"white");
		scene.joystickAction = new BABYLON.GameFX.VirtualJoystick(false,"yellow");
	}

	scene.logicLoop = function () {
		var self = scene;
		switch (Game.engine.loopCounter) {   
			case 500:
				Game.engine.loopCounter=0;
				break;
			default:
				Game.engine.loopCounter++;
				break;
		}
		//check what room the player is in
		self.checkActiveRoom();
		$('#lps').text('LPS: ' + self.timedLogicLoop.getLoopTime().toFixed());
		if (!self.activeRoom.enemiesDead) {
			for (self.enemyCounter = 0; self.enemyCounter < self.activeRoom.enemy.length; self.enemyCounter++) {
				if (self.enemyCounter == 0 ) {
					self.activeRoom.enemiesDead = self.activeRoom.enemy[self.enemyCounter].isDead;
				}
				else {
					self.activeRoom.enemiesDead = (self.activeRoom.enemiesDead && self.activeRoom.enemy[self.enemyCounter].isDead);
				}
				self.activeRoom.enemy[self.enemyCounter].velocity = GetPathVector(self.activeRoom.enemy[self.enemyCounter].mesh.position,self.player.mesh.position,{speed: self.activeRoom.enemy[self.enemyCounter].speed, tolerance: 12});
				self.activeRoom.enemy[self.enemyCounter].mesh.rotation.y = -self.activeRoom.enemy[self.enemyCounter].velocity.angle;
				if (self.activeRoom.enemy[self.enemyCounter].velocity.direction.x == 0 && self.activeRoom.enemy[self.enemyCounter].mesh.enemyAnimations.animatable) {
					self.activeRoom.enemy[self.enemyCounter].mesh.enemyAnimations.animatable.stop();
					self.activeRoom.enemy[self.enemyCounter].mesh.enemyAnimations.animating=0;
				}
				else {
					self.activeRoom.enemy[self.enemyCounter].mesh.enemyAnimations.move.start(self,self.activeRoom.enemy[self.enemyCounter]);
				}
			}
			//open doors if all enemies are dead
			if (self.activeRoom.enemiesDead) {
				for (var doorLoop=0; doorLoop < self.activeRoom.doors.length; doorLoop++) {
					if (self.activeRoom.doors[doorLoop].isOpen == false) {
						self.activeRoom.doors[doorLoop].mesh.checkCollisions = false;
						self.activeRoom.doors[doorLoop].mesh.isVisible = false;
						self.activeRoom.doors[doorLoop].isOpen = true;
						//apply to matching door
						self.activeRoom.doors[doorLoop].pairedDoor.mesh.checkCollisions = false;
						self.activeRoom.doors[doorLoop].pairedDoor.mesh.isVisible = false;
						self.activeRoom.doors[doorLoop].pairedDoor.isOpen = true;
					}
				}
			}
		}
		processInput(self.player, self.player.speed);
	};
	
	scene.moveMeshes = function () {
		var self = scene;
		var i=0;
		
		$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
		//Need to update self every loop, I guess
		for (i=0; i < self.activeRoom.enemy.length;i++) {
			self.activeRoom.enemy[i].mesh.moveWithCollisions(self.activeRoom.enemy[i].velocity.direction);
		}
		self.player.mesh.moveWithCollisions(self.player.velocity.direction);
	}
	
    scene.registerBeforeRender(function(){
		scene.moveMeshes();
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

Game.restartPlayer = function (scene) {
	var i_room=scene.indexOfEntrance;
	//disable torch lights
	var arrayLength;
	for (var doorIndex = 0; doorIndex < scene.activeRoom.doors.length; doorIndex++) {
		arrayLength = scene.activeRoom.doors[doorIndex].frame.length-1;
		scene.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(false);
		scene.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(false);
	}
	//set active room to entrance
	scene.activeRoom=scene.rooms[i_room];
	for (doorIndex = 0; doorIndex < scene.activeRoom.doors.length; doorIndex++) {
		arrayLength = scene.activeRoom.doors[doorIndex].frame.length-1;
		scene.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(true);
		scene.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(true);
	}
	
	//set camera to new position
	scene.camera.target = new BABYLON.Vector3(scene.activeRoom.originOffset.x+scene.activeRoom.centerPosition.x, 0, scene.activeRoom.originOffset.z-scene.activeRoom.centerPosition.z);
	//reset player health and position
	scene.player.health=4;
	prepareHealthBars();
	scene.player.mesh.position = new BABYLON.Vector3(scene.activeRoom.originOffset.x+scene.activeRoom.centerPosition.x, 10, scene.activeRoom.originOffset.z-2*scene.activeRoom.centerPosition.z+10);
	scene.octree = scene.createOrUpdateSelectionOctree(64, 2);
}

this.getScale = function () {
    this.viewportScale = undefined;
    // Calculate viewport scale 
    this.viewportScale = screen.width / window.innerWidth;
    return this.viewportScale;
}

Game.createParentTiles = function (activeScene, type) {
	// create box for the specific tile and scale it
	activeScene.parentTile.mesh[type] = new BABYLON.Mesh.CreateBox(bjsHelper.tileType[type].name + '-' + parseInt(type), 1.0, activeScene);
    activeScene.parentTile.mesh[type].scaling = bjsHelper.tileType[type].scale;
    activeScene.parentTile.mesh[type].material = bjsHelper.tileType[type].material;
    activeScene.parentTile.mesh[type].isVisible = false;
	
	activeScene.parentTile.mesh[type].addLODLevel(Game.performance.viewDistance, null);
}

Game.drawTile = function(activeScene, tile, index) {
	// create instance based off of type
	var newInstance = activeScene.parentTile.mesh[tile.type].createInstance("mesh_" + parseInt(tile.type) + "-" + parseInt(index));
    newInstance.position = new BABYLON.Vector3(tile.col*tile.width, bjsHelper.tileType[tile.type].yOffset, -tile.row*tile.width);
	newInstance.isVisible = true;

    return newInstance;
}

Game.activateRoom = function (activeRoom, previousRoom) {
	// Turn collision checking on
	for (var i=0; i < activeRoom.tiles.length; i++) {
		activeRoom.tiles[i].mesh.checkCollisions = true;
		activeRoom.tiles[i].mesh.isVisible = true;
	}
	for (i=0; i < activeRoom.enemy.length; i++) {
		activeRoom.enemy[i].mesh.checkCollisions = true;
		activeRoom.enemy[i].mesh.applyGravity = true;
		activeRoom.enemy[i].mesh.isVisible = true;
	}
	for (i=0; i < activeRoom.doors.length; i++) {
		for (var j=0; j < activeRoom.doors[i].frame.length;j++) {
			activeRoom.doors[i].frame[j].isVisible = true;
		}
	}
	if (previousRoom != undefined) {
		// Turn collision checking on
		for (var i=0; i < previousRoom.tiles.length; i++) {
			previousRoom.tiles[i].mesh.checkCollisions = false;
			previousRoom.tiles[i].mesh.isVisible = false;
		}
		for (i=0; i < previousRoom.enemy.length; i++) {
			previousRoom.enemy[i].mesh.checkCollisions = false;
			previousRoom.enemy[i].mesh.applyGravity = false;
			previousRoom.enemy[i].mesh.isVisible = false;
		}
		for (i=0; i < previousRoom.doors.length; i++) {
			for (j=0; j < previousRoom.doors[i].frame.length;j++) {
				previousRoom.doors[i].frame[j].isVisible = false;
			}
		}
	}
}

Game.createTransportRing = function (activeScene, bossRoom) {
	//create Ring to make visible when the boss dies
	bossRoom.transportRing = new BABYLON.Mesh.CreateCylinder('transportRing', .1, 10, 10, 20, activeScene);
	bossRoom.transportRing.position = new BABYLON.Vector3(bossRoom.originOffset.x+bossRoom.centerPosition.x, .6, bossRoom.originOffset.z-2*bossRoom.centerPosition.z+10);
	bossRoom.transportRing.isVisible=false;
	bossRoom.transportRing.material = new activeScene.transportRingMaterial();
	bossRoom.transportRing.material.diffuseTexture.refreshRate = 0;
	bossRoom.transportRing.material.opacityTexture.refreshRate = 0;
	
	// create intersect action
	bossRoom.transportRing.actionManager = new BABYLON.ActionManager(activeScene);
	// detect collision between enemy and player's weapon for an attack
	this.enableIntersect = function () {
		bossRoom.transportRing.isVisible=true;
		bossRoom.transportRing.material.diffuseTexture.refreshRate = 1;
		bossRoom.transportRing.material.opacityTexture.refreshRate = 1;
		bossRoom.transportRing.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.bodyMesh}, function (data) {
			dungeonComplete();
		}));
	};
}

function spawnEnemy(activeScene, room) {
	//var activeScene = Game.scene[this.activeScene];
	//TO DO: Implement other enemy types, for now just a rolling ball, who has lost his chain
	var index = room.enemy.length;
	var enemyIndex = room.enemy.push(new Entity(new BABYLON.Mesh.CreateSphere("enemySphere-" + parseInt(index), 8.0, 8.0, activeScene), {type: EntityType.Sphere, health: 2, damage: 1, speed: .2})) - 1;
	room.enemy[enemyIndex].index = enemyIndex;
	
	var randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	while (room.tiles[randomTile].type != Game.TileType.Floor) {
		randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	}
	var tileIndex = room.tiles[randomTile].row*room.tiles[randomTile].width + room.tiles[randomTile].col;
	room.enemy[enemyIndex].mesh.position = new BABYLON.Vector3(room.tiles[randomTile].mesh.position.x, 2, room.tiles[randomTile].mesh.position.z);
	room.enemy[enemyIndex].mesh.scaling = new BABYLON.Vector3(1, 1, 1);
	room.enemy[enemyIndex].mesh.material = new activeScene.enemyMaterial();
	//room.enemy[enemyIndex].mesh.showBoundingBox = true;
	
	room.enemy[enemyIndex].mesh.checkCollisions = true;
	room.enemy[enemyIndex].mesh.applyGravity = true;
	//Set the ellipsoid around the camera (e.g. your player's size)
	room.enemy[enemyIndex].mesh.ellipsoid = new BABYLON.Vector3(4, 2, 4);
	
	//attach animations
	room.enemy[enemyIndex].mesh.enemyAnimations = new Game.enemyAnimations(room.enemy[enemyIndex].mesh);
	room.enemy[enemyIndex].mesh.enemyAnimations.init(activeScene);
	
	// create intersect action
	room.enemy[enemyIndex].mesh.actionManager = new BABYLON.ActionManager(activeScene);
	// detect collision between enemy and player's weapon for an attack
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.weaponMesh}, function (data) {
		var test = data;
		if (activeScene.player.attacking == true) {
			room.enemy[enemyIndex].health--;
			if (room.enemy[enemyIndex].health <=0) {
				room.enemy[enemyIndex].isDead=true;
				room.enemy[enemyIndex].mesh.enemyAnimations.die.start(activeScene,room.enemy[enemyIndex]);
			}
			else {
				room.enemy[enemyIndex].mesh.enemyAnimations.takeDmg.start(activeScene,room.enemy[enemyIndex]);
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
				activeScene.player.mesh.playerAnimations.die.start(activeScene,activeScene.player);
			}
			activeScene.player.mesh.playerAnimations.takeDmg.start(activeScene, activeScene.player);
		}
	}));
	
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.weaponMesh }, function (evt) {

	}));
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.bodyMesh }, function (evt) {

	}));

}


function spawnBoss(activeScene, room) {
	//var activeScene = Game.scene[this.activeScene];
	//TO DO: Implement other enemy types, for now just a rolling ball, who has lost his chain
	var index = room.enemy.length;
	var enemyIndex = room.enemy.push(new Entity(new BABYLON.Mesh.CreateSphere("enemySphere-" + parseInt(index), 12.0, 12.0, activeScene), {type: EntityType.Boss, health: 6, damage: 1, speed: .1})) - 1;
	room.enemy[enemyIndex].index = enemyIndex;
	
	var randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	while (room.tiles[randomTile].type != Game.TileType.Floor) {
		randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	}
	var tileIndex = room.tiles[randomTile].row*room.tiles[randomTile].width + room.tiles[randomTile].col;
	room.enemy[enemyIndex].mesh.position = new BABYLON.Vector3(room.tiles[randomTile].mesh.position.x, 4, room.tiles[randomTile].mesh.position.z);
	room.enemy[enemyIndex].mesh.scaling = new BABYLON.Vector3(1, 1, 1);
	room.enemy[enemyIndex].mesh.material =new activeScene.enemyMaterial();
	//room.enemy[enemyIndex].mesh.showBoundingBox = true;
	
	room.enemy[enemyIndex].mesh.checkCollisions = true;
	room.enemy[enemyIndex].mesh.applyGravity = true;
	//Set the ellipsoid around the camera (e.g. your player's size)
	room.enemy[enemyIndex].mesh.ellipsoid = new BABYLON.Vector3(3, 3, 3);
	
	//attach animations
	room.enemy[enemyIndex].mesh.enemyAnimations = new Game.enemyAnimations(room.enemy[enemyIndex].mesh);
	room.enemy[enemyIndex].mesh.enemyAnimations.init(activeScene);
	
	// create intersect action
	room.enemy[enemyIndex].mesh.actionManager = new BABYLON.ActionManager(activeScene);
	// detect collision between enemy and player's weapon for an attack
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.weaponMesh}, function (data) {
		var test = data;
		if (activeScene.player.attacking == true) {
			room.enemy[enemyIndex].health--;
			if (room.enemy[enemyIndex].health <=0) {
				room.enemy[enemyIndex].isDead=true;
				room.enemy[enemyIndex].mesh.enemyAnimations.die.start(activeScene,room.enemy[enemyIndex]);
				Game.transportRing.enableIntersect();
			}
			else {
				room.enemy[enemyIndex].mesh.enemyAnimations.takeDmg.start(activeScene,room.enemy[enemyIndex]);
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
				activeScene.player.mesh.playerAnimations.die.start(activeScene,activeScene.player);
			}
			activeScene.player.mesh.playerAnimations.takeDmg.start(activeScene,activeScene.player);
		}
	}));
	
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.weaponMesh }, function (evt) {

	}));
	room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	{ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.bodyMesh }, function (evt) {

	}));

}

Game.playerAnimations = function(activeScene) {
	var self = this;
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
	
	self.Attack = function(activeScene) {
		var calculateKeys = function (animation) {
			var keys = []
			// Animation keys
			keys.push({
				frame: 0,
				value: new BABYLON.Vector3(0, activeScene.player.mesh.currentFacingAngle.y + Math.PI/2.2, Math.PI/2)
			});
			keys.push({
				frame: 20,
				value: new BABYLON.Vector3(0, activeScene.player.mesh.currentFacingAngle.y - 0.8, Math.PI/2)
			});
			//Adding keys to the animation object
			animation.setKeys(keys);
		}
		var create = function () {
			//create animations for player
			self.Attack.animation = new BABYLON.Animation("attackAnimation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Attack.animation);
		}
		this.start = function (activeScene, entity) {
			if (self.animating == 0) {
				entity.attacking=true;
				self.animating = 1;
				//Attach animation to player mesh
				if (entity.mesh.animations == undefined) {
					entity.mesh.animations.push(self.Attack.animation);
				}
				else {
					entity.mesh.animations[0] = self.Attack.animation;
				}
				calculateKeys(self.Attack.animation);
				entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 20, false, 1.0, function () {
					entity.attacking=false;
					self.animating=0;
					// Scene.player.Attack=0;
					entity.mesh.rotation = new BABYLON.Vector3(Math.PI/6,entity.mesh.currentFacingAngle.y,Math.PI/8);
				});
			}
		}
		create(); // create animation
	};
	
	self.TakeDmg = function(activeScene) {
		var create = function () {
			//create animations for player
			self.TakeDmg.animation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 60, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);// Animation keys
			// create keys
			var keys = [];
			keys.push({
				frame: 0,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 10,
				value: new BABYLON.Color3(0,0,0)
			});
			keys.push({
				frame: 20,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 30,
				value: new BABYLON.Color3(0,0,0)
			});
			//Add keys to the animation object
			self.TakeDmg.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.TakeDmg.animation);
		}
		this.start = function (activeScene, entity) {
			if (self.animating == 0) {
				self.animating = 1;
				//Attach animation to player mesh
				if (entity.mesh.animations == undefined) {
					entity.mesh.animations.push(self.TakeDmg.animation);
				}
				else {
					entity.mesh.animations[0] = self.TakeDmg.animation;
				}
				entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 30, false, 1.0, function () {
					self.animating=0;
				});
			}
		}
		create(); // create animation
	};
	
	self.Die = function(activeScene) {
		var create = function () {
			//create animations for player
			self.Die.animation = new BABYLON.Animation("dieAnimation", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// create keys
			var keys = [];
			var startScaling = activeScene.player.mesh.scaling;
			var endScaling = activeScene.player.mesh.scaling;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
			});
			keys.push({
				frame: 10,
				value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			keys.push({
				frame: 20,
				value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
			});
			keys.push({
				frame: 30,
				value: endScaling
			});
			keys.push({
				frame: 60,
				value: endScaling
			});
			//Add keys to the animation object
			self.Die.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Die.animation);
		}
		this.start = function (activeScene, entity) {
			entity.mesh.animatable.stop();
			self.animating = 1;
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.Die.animation);
			}
			else {
				entity.mesh.animations[0] = self.Die.animation;
			}
			entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 60, false, 1.0, function () {
				self.animating = 0;
				Game.restartPlayer(activeScene);
			});
		}
		create(); // create animation
	};
	
	self.init = function (activeScene) {
		this.attack = new self.Attack(activeScene);
		this.takeDmg = new self.TakeDmg(activeScene);
		this.die = new self.Die(activeScene);
	}
}

Game.enemyAnimations = function(entityMesh) {
	var self = this;
	self.animating = 0;
	
	self.Die = function(activeScene, entityMesh) {
		var create = function () {
			//create animations for player
			self.Die.animation = new BABYLON.Animation("dieAnimation", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// create keys
			var keys = [];
			var startScaling = entityMesh.scaling;
			var endScaling = entityMesh.scaling;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
			});
			keys.push({
				frame: 10,
				value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			keys.push({
				frame: 20,
				value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
			});
			keys.push({
				frame: 30,
				value: endScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			//Add keys to the animation object
			self.Die.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Die.animation);
		}
		this.start = function (activeScene, entity, dieFunction) {
			self.animating = 1;
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.Die.animation);
			}
			else {
				entity.mesh.animations[0] = self.Die.animation;
				//entity.mesh.animatable.stop();
			}
			entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 30, false, 1.0, function () {
				entity.mesh.dispose();
				entity.mesh.actionManager.actions = []; // remove actions
				// activeScene.activeRoom.enemy.splice(entity.index, 1);
				if (dieFunction != undefined) {
					dieFunction(); // execute Callback function
				}
			});
		}
		create(); // create animation
	};
	
	self.Move = function(activeScene, entityMesh) {
		var calculateKeys = function (animation) {
			var keys = [];
			// Animation keys
			var startRotation = entityMesh.rotation;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startRotation
			});
			keys.push({
				frame: 240,
				value: startRotation.subtract(new BABYLON.Vector3(0, 0, 4*Math.PI))
			});
			//Adding keys to the animation object
			animation.setKeys(keys);
		}
		var create = function () {
			//create animations for player
			self.Move.animation = new BABYLON.Animation("moveAnimation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Attack.animation);
		}
		this.start = function (activeScene, entity, dieFunction) {
			self.animating = 1;
			calculateKeys(self.Move.animation);
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.Move.animation);
			}
			else {
				entity.mesh.animations[0] = self.Move.animation;
				//entity.mesh.animatable.stop();
			}
			self.animatable = activeScene.beginAnimation(entity.mesh, 0, 240, true, 1.0);
		}
		create(); // create animation
	};
	
	self.init = function (activeScene) {
		this.die = new self.Die(activeScene, entityMesh);
		this.move = new self.Move(activeScene, entityMesh);
		this.takeDmg = new self.TakeDmg(activeScene);
	}
	
	self.TakeDmg = function(activeScene) {
		var create = function () {
			//create animations for player
			self.TakeDmg.animation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 60, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);// Animation keys
			// create keys
			var keys = [];
			keys.push({
				frame: 0,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 10,
				value: new BABYLON.Color3(0,0,0)
			});
			keys.push({
				frame: 20,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 30,
				value: new BABYLON.Color3(0,0,0)
			});
			//Add keys to the animation object
			self.TakeDmg.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.TakeDmg.animation);
		}
		this.start = function (activeScene, entity) {
				//Attach animation to player mesh
				if (entity.mesh.animations == undefined) {
					entity.mesh.animations.push(self.TakeDmg.animation);
				}
				else {
					entity.mesh.animations[0] = self.TakeDmg.animation;
				}
				entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 30, false, 1.0, function () {
					//self.animating=0;
				});
		}
		create(); // create animation
	}
}

function createTorchFire(activeScene, attachTo) {
	//var activeScene = Game.scene[Game.activeScene];
	
	// Create a particle system
	var index = attachTo.torchFire.push(new BABYLON.ParticleSystem("particles", 512, activeScene)) - 1;

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
	var randomColor = new BABYLON.Color3(Game.getRandomInt(0,10)/10, Game.getRandomInt(0,10)/10, Game.getRandomInt(0,10)/10);
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
		var marbleTexture = new BABYLON.MarbleProceduralTexture("marble",  128, activeScene);
		marbleTexture.numberOfBricksHeight = Game.getRandomInt(1,5);
		marbleTexture.numberOfBricksWidth = Game.getRandomInt(1,5);
		
		$.extend(this,new BABYLON.StandardMaterial("enemyMaterial", activeScene));
		this.ambientTexture = marbleTexture;
	}
	activeScene.transportRingMaterial = function () {
		var fireTexture = new BABYLON.FireProceduralTexture("fire", 128, activeScene);
		fireTexture.fireColors = BABYLON.FireProceduralTexture.PurpleFireColors;
		
		$.extend(this,new BABYLON.StandardMaterial("transportRingMaterial", activeScene));
		this.diffuseTexture = fireTexture;
		this.opacityTexture = fireTexture;
	}
}
