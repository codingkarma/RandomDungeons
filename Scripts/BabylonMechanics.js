function startGame() {  

        var canvas = document.getElementById("renderCanvas");

        // Check support
        if (!BABYLON.Engine.isSupported()) {
            window.alert('Browser not supported');
        } else {
            // Babylon
            var engine = new BABYLON.Engine(canvas, true);

            //Creating scene (in "BabylonScene.js")
            scene = CreateScene(engine);

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
						for (i=0; i < scene.enemy.length;i++) {
							scene.enemy[i].velocity = new BABYLON.Vector3(0,scene.gravity.y,0);
						}
						scene.player.Attack=0;
					}
				}
				else {
					if (scene.player.Attack == 1) {
						if (firstTime == 1) {
							// scene.player.rotation = new BABYLON.Vector3(Math.PI/1.5, 0, Math.PI/2.2);
							scene.player.rotation = new BABYLON.Vector3(0, Math.PI/1.2, Math.PI/2);
							firstTime=0;
							loopCounter=0;
							animationIter = .08;
						}
						else {
							scene.player.rotation.y=scene.player.rotation.y-1.8*animationIter;
							// scene.player.rotation.x=scene.player.rotation.x-2*animationIter;
							// scene.player.rotation.z=scene.player.rotation.z-2*animationIter;
							
							if (loopCounter > 12) {
								loopCounter=0;
								scene.player.Attack=0;
								firstTime=1;
								animationIter = -.0075;
								scene.player.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4);
							}
							else {
								loopCounter++;
							}
						}
						
					}
					else {						
						if (loopCounter > 50) {
							loopCounter=0;
							animationIter=animationIter*-1;
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
							for (i=0; i < scene.enemy.length;i++) {
								scene.enemy[i].velocity = GetPathVector(scene.enemy[i].position,scene.player.position,{speed: 1.5, tolerance: 5});
							}
						}
					}
					processInput(scene.player);
					//Need to update this every loop, I guess
					for (i=0; i < scene.enemy.length;i++) {
						scene.enemy[i].moveWithCollisions(scene.enemy[i].velocity);
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
	if (Scene.player.position.z > (Scene.activeRoom.roomZ0)) {
		//going north
		var i_room=(Scene.activeRoom.row-1) * map.width + Scene.activeRoom.col;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		Scene.activeRoom.index=i_room;
		Scene.activeRoom.roomX0=Scene.activeRoom.col*Scene.activeRoom.width*Scene.activeRoom.tiles[0].width;
		Scene.activeRoom.roomZ0=-Scene.activeRoom.row*Scene.activeRoom.height*Scene.activeRoom.tiles[0].width;
		//set camera to new position
		var centerX=Scene.activeRoom.roomX0+Scene.activeRoom.width/2*Scene.activeRoom.tiles[0].width;
		var centerZ=Scene.activeRoom.roomZ0-Scene.activeRoom.height/2*Scene.activeRoom.tiles[0].width;
		Scene.camera.target = new BABYLON.Vector3(centerX, 0, centerZ);
	}
	else if (Scene.player.position.x > (Scene.activeRoom.roomX0+Scene.activeRoom.width*Scene.activeRoom.tiles[0].width)) {
		//going east
		var i_room=(Scene.activeRoom.row) * map.width + Scene.activeRoom.col+1;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		Scene.activeRoom.index=i_room;
		Scene.activeRoom.roomX0=Scene.activeRoom.col*Scene.activeRoom.width*Scene.activeRoom.tiles[0].width;
		Scene.activeRoom.roomZ0=-Scene.activeRoom.row*Scene.activeRoom.height*Scene.activeRoom.tiles[0].width;
		//set camera to new position
		var centerX=Scene.activeRoom.roomX0+Scene.activeRoom.width/2*Scene.activeRoom.tiles[0].width;
		var centerZ=Scene.activeRoom.roomZ0-Scene.activeRoom.height/2*Scene.activeRoom.tiles[0].width;
		Scene.camera.target = new BABYLON.Vector3(centerX, 0, centerZ);
	}
	else if (Scene.player.position.z < (Scene.activeRoom.roomZ0 - Scene.activeRoom.height*Scene.activeRoom.tiles[0].width)) {
		//going south
		var i_room=(Scene.activeRoom.row+1) * map.width + Scene.activeRoom.col;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		Scene.activeRoom.index=i_room;
		Scene.activeRoom.roomX0=Scene.activeRoom.col*Scene.activeRoom.width*Scene.activeRoom.tiles[0].width;
		Scene.activeRoom.roomZ0=-Scene.activeRoom.row*Scene.activeRoom.height*Scene.activeRoom.tiles[0].width;
		//set camera to new position
		var centerX=Scene.activeRoom.roomX0+Scene.activeRoom.width/2*Scene.activeRoom.tiles[0].width;
		var centerZ=Scene.activeRoom.roomZ0-Scene.activeRoom.height/2*Scene.activeRoom.tiles[0].width;
		Scene.camera.target = new BABYLON.Vector3(centerX, 0, centerZ);
	}
	else if (Scene.player.position.x < (Scene.activeRoom.roomX0)) {
		//going west
		var i_room=(Scene.activeRoom.row) * map.width + Scene.activeRoom.col-1;
		//set active room to entrance
		Scene.activeRoom=map.rooms[i_room];
		Scene.activeRoom.index=i_room;
		Scene.activeRoom.roomX0=Scene.activeRoom.col*Scene.activeRoom.width*Scene.activeRoom.tiles[0].width;
		Scene.activeRoom.roomZ0=-Scene.activeRoom.row*Scene.activeRoom.height*Scene.activeRoom.tiles[0].width;
		//set camera to new position
		var centerX=Scene.activeRoom.roomX0+Scene.activeRoom.width/2*Scene.activeRoom.tiles[0].width;
		var centerZ=Scene.activeRoom.roomZ0-Scene.activeRoom.height/2*Scene.activeRoom.tiles[0].width;
		Scene.camera.target = new BABYLON.Vector3(centerX, 0, centerZ);
	}
}