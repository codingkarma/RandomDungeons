function startGame(whichScene) {  

        var canvas = document.getElementById("renderCanvas");

        // Check support
        if (!BABYLON.Engine.isSupported()) {
            window.alert('Browser not supported');
        } else {
            // Babylon
            var engine = new BABYLON.Engine(canvas, true);

            //Creating scene (in "BabylonScene.js")
			if (whichScene == 0) {
				scene = CreateStartScene(engine);
			}
			else {
				scene = CreateScene(engine);
			}

            scene.activeCamera.attachControl(canvas);
			
			var animationIter = -.0075;
			var loopCounter = 0;
			var firstTime=1;

			var i;
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
					if (scene.player.Attack == 1) {
						if (scene.player.Attacking==0) {
							scene.player.playerAnimations.updateAttack(scene);
							scene.player.Attacking=1;
						}
					}
					else {						
						if (loopCounter > 1000) {
							loopCounter=0;
						}
						else {
							loopCounter++;
						}
						if (loopCounter % 10 == 0) {
							$('#fps').text('FPS: ' + BABYLON.Tools.GetFps().toFixed());
							//check what room the player is in
							checkActiveRoom(scene);
						}
						else if (loopCounter % 31 == 0) {
							for (i=0; i < scene.activeRoom.enemy.length;i++) {
								scene.activeRoom.enemy[i].velocity = GetPathVector(scene.activeRoom.enemy[i].position,scene.player.position,{speed: 1.5, tolerance: 5});
							}
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
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
	else if (Scene.player.position.x > (Scene.activeRoom.originOffset.x+Scene.activeRoom.width*Scene.activeRoom.tiles[0].width)) {
		//going east
		var i_room=(Scene.activeRoom.row) * map.width + Scene.activeRoom.col+1;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
	else if (Scene.player.position.z < (Scene.activeRoom.originOffset.z - Scene.activeRoom.height*Scene.activeRoom.tiles[0].width)) {
		//going south
		var i_room=(Scene.activeRoom.row+1) * map.width + Scene.activeRoom.col;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
	else if (Scene.player.position.x < (Scene.activeRoom.originOffset.x)) {
		//going west
		var i_room=(Scene.activeRoom.row) * map.width + Scene.activeRoom.col-1;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		
		//set camera to new position
		Scene.camera.target = new BABYLON.Vector3(Scene.activeRoom.originOffset.x+Scene.activeRoom.centerPosition.x, 0, Scene.activeRoom.originOffset.z-Scene.activeRoom.centerPosition.z);
	}
}