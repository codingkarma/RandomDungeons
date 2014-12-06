
function startGame(whichScene) {  

        var canvas = document.getElementById("renderCanvas");

        // Check support
        if (!BABYLON.Engine.isSupported()) {
            window.alert('Browser not supported');
        } else {
            // Babylon
            var engine = new BABYLON.Engine(canvas, true);
			var loopCounter = 0;

            //Creating scene (in "BabylonScene.js")
			if (whichScene == 0) {
				scene = CreateStartScene(engine);
				scene.activeCamera.attachControl(canvas);
				
				engine.runRenderLoop(function () {//Render scene and any changes
					if (onStartScreen == 0) {
						engine.stopRenderLoop();
					}
					if (loopCounter > 1000) {
						loopCounter=0;
					}
					else {
						loopCounter++;
					}
					if (loopCounter % 10 == 0) {
						$('#fps').text('FPS: ' + BABYLON.Tools.GetFps().toFixed());
					}
					scene.render();
				});
			}
			else {
				scene = CreateScene(engine);
				scene.activeCamera.attachControl(canvas);
				
				var i;
				var enemyCounter=0;
				// Once the scene is loaded, register a render loop to render it
				engine.runRenderLoop(function () {
					// rotate to give some animation
					if (!scene.isErrthingReady) {
						if (scene.isReady() && scene.player) {
							scene.isErrthingReady = true;
						}
						//when everything is ready this gets executed once
						if (scene.isErrthingReady) {
							for (i=0; i < scene.activeRoom.enemy.length;i++) {
								scene.activeRoom.enemy[i].velocity = new BABYLON.Vector3(0,scene.gravity.y,0);
							}
							scene.player.Attack=0;
							scene.player.Attacking=0;
							scene.player.currentFacingAngle = new BABYLON.Vector3(scene.player.rotation.x, scene.player.rotation.y, scene.player.rotation.z);
						}
					}
					else {
						switch (loopCounter) {   
							case 1000:
								loopCounter=0;
								break;
							default:
								loopCounter++;
								break;
						}
						if (loopCounter % 5 == 0) {
							$('#fps').text('FPS: ' + BABYLON.Tools.GetFps().toFixed());
							//check what room the player is in
							checkActiveRoom(scene);
						}
						else if (loopCounter % (31 + enemyCounter) == 0) {
							if (enemyCounter >= scene.activeRoom.enemy.length) { 
								enemyCounter = 0;
							}
							else {
								scene.activeRoom.enemy[enemyCounter].velocity = GetPathVector(scene.activeRoom.enemy[enemyCounter].position,scene.player.position,{speed: 1.5, tolerance: 12});
								enemyCounter++;
							}
						}
						
						processInput(scene.player);
						//Need to update this every loop, I guess
						for (i=0; i < scene.activeRoom.enemy.length;i++) {
							scene.activeRoom.enemy[i].moveWithCollisions(scene.activeRoom.enemy[i].velocity);
						}
					}
					
					//Render scene and any changes
					scene.render();
				});
			}

            // Resize
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }

};

function animatePlayer(Scene) {
	
}

function checkActiveRoom(Scene) {
	if (Scene.player.position.z > (Scene.activeRoom.originOffset.z)) {
		//going north
		var i_room=(Scene.activeRoom.row-1) * map.width + Scene.activeRoom.col;
		//disable torch lights
		var arrayLength;
		for (var doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
		}
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		for (doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
		}
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
	else if (Scene.player.position.x > (Scene.activeRoom.originOffset.x+Scene.activeRoom.width*Scene.activeRoom.tiles[0].width)) {
		//going east
		var i_room=(Scene.activeRoom.row) * map.width + Scene.activeRoom.col+1;
		//disable torch lights
		var arrayLength;
		for (var doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
		}
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		for (doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
		}
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
	else if (Scene.player.position.z < (Scene.activeRoom.originOffset.z - Scene.activeRoom.height*Scene.activeRoom.tiles[0].width)) {
		//going south
		var i_room=(Scene.activeRoom.row+1) * map.width + Scene.activeRoom.col;
		//disable torch lights
		var arrayLength;
		for (var doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
		}
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		for (doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
		}
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
	else if (Scene.player.position.x < (Scene.activeRoom.originOffset.x)) {
		//going west
		var i_room=(Scene.activeRoom.row) * map.width + Scene.activeRoom.col-1;
		//disable torch lights
		var arrayLength;
		for (var doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
		}
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		for (doorIndex = 0; doorIndex < Scene.activeRoom.door.length; doorIndex++) {
			arrayLength = Scene.activeRoom.door[doorIndex].Frame.length-1;
			Scene.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
			Scene.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
		}
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
}