
Game.initScenes = function() { 
	var activeScene;
	
	// Create Start Scene
	activeScene = Game.scene.push(Game.CreateStartScene(Game.engine)) - 1;
	//Game.scene[activeScene].camera.attachControl(Game.canvas);
	Game.scene[activeScene].renderLoop = function () {
		//Render scene and any changes
		if (this.isLoaded) {
			if (Game.engine.loopCounter > 1000) {
				Game.engine.loopCounter=0;
			}
			else {
				Game.engine.loopCounter++;
			}
			this.render();
		}
	};
	
	// Create Game Scene
	activeScene = Game.scene.push(Game.CreateGameScene(Game.engine)) - 1;
	Game.scene[activeScene].enemyCounter=0;
	Game.scene[activeScene].renderLoop = function () {
		var i=0;
		// rotate to give some animation
		if (!this.isErrthingReady) {
			if (this.isReady() && this.isLoaded) {
				this.isErrthingReady = true;
			}
			//when everything is ready this gets executed once
			if (this.isErrthingReady) {
				for (i=0; i < this.activeRoom.enemy.length;i++) {
					this.activeRoom.enemy[i].velocity = new BABYLON.Vector3(0,this.gravity.y,0);
				}
				this.player.attacking=false;
				this.player.mesh.currentFacingAngle = new BABYLON.Vector3(this.player.mesh.rotation.x, this.player.mesh.rotation.y, this.player.mesh.rotation.z);
				this.octree = this.createOrUpdateSelectionOctree(18, 2);
				// TO DO: Implement optimization (only availabe in BJS v2+)
				// this.optimizeOptions = BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
				// this.optimizeOptions.targetFrameRate=30;
				// BABYLON.SceneOptimizer.OptimizeAsync(scene, this.optimizeOptions, function() {
				   // // On success
				// }, function() {
				   // // FPS target not reached
				// });
			}
		}
		else {
			switch (Game.engine.loopCounter) {   
				case 1000:
					Game.engine.loopCounter=0;
					break;
				default:
					Game.engine.loopCounter++;
					break;
			}
			if (Game.engine.loopCounter % 5 == 0) {
				$('#fps').text('FPS: ' + BABYLON.Tools.GetFps().toFixed());
				//check what room the player is in
				this.checkActiveRoom();
			}
			else if (Game.engine.loopCounter % (31 + this.enemyCounter) == 0) {
				if (this.enemyCounter >= this.activeRoom.enemy.length) { 
					this.enemyCounter = 0;
				}
				else {
					this.activeRoom.enemy[this.enemyCounter].velocity = GetPathVector(this.activeRoom.enemy[this.enemyCounter].mesh.position,this.player.mesh.position,{speed: this.activeRoom.enemy[this.enemyCounter].speed, tolerance: 12});
					this.enemyCounter++;
				}
			}
			
			processInput(this.player.mesh);
			//Need to update this every loop, I guess
			for (i=0; i < this.activeRoom.enemy.length;i++) {
				this.activeRoom.enemy[i].mesh.moveWithCollisions(this.activeRoom.enemy[i].velocity);
			}
			
			//Render scene and any changes
			this.render();
		}
	};
	
	Game.scene[activeScene].checkActiveRoom = function() {
		var capacity = 18;
		if (this.player.mesh.position.z > (this.activeRoom.originOffset.z)) {
			this.octree = this.createOrUpdateSelectionOctree(capacity, 2);
			//going north
			var i_room=(this.activeRoom.row-1) * Game.map.width + this.activeRoom.col;
			//disable torch lights
			var arrayLength;
			for (var doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
			}
			//set active room to entrance
			this.activeRoom=Game.map.rooms[i_room];
			for (doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
			}
			
			//set camera to new position
			this.camera.target = new BABYLON.Vector3(this.activeRoom.originOffset.x+this.activeRoom.centerPosition.x, 0, this.activeRoom.originOffset.z-this.activeRoom.centerPosition.z);
		}
		else if (this.player.mesh.position.x > (this.activeRoom.originOffset.x+this.activeRoom.width*this.activeRoom.tiles[0].width)) {
			this.octree = this.createOrUpdateSelectionOctree(capacity, 2);
			//going east
			var i_room=(this.activeRoom.row) * Game.map.width + this.activeRoom.col+1;
			//disable torch lights
			var arrayLength;
			for (var doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
			}
			//set active room to entrance
			this.activeRoom=Game.map.rooms[i_room];
			for (doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
			}
			
			//set camera to new position
			this.camera.target = new BABYLON.Vector3(this.activeRoom.originOffset.x+this.activeRoom.centerPosition.x, 0, this.activeRoom.originOffset.z-this.activeRoom.centerPosition.z);
		}
		else if (this.player.mesh.position.z < (this.activeRoom.originOffset.z - this.activeRoom.height*this.activeRoom.tiles[0].width)) {
			this.octree = this.createOrUpdateSelectionOctree(capacity, 2);
			//going south
			var i_room=(this.activeRoom.row+1) * Game.map.width + this.activeRoom.col;
			//disable torch lights
			var arrayLength;
			for (var doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
			}
			//set active room to entrance
			this.activeRoom=Game.map.rooms[i_room];
			for (doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
			}
			
			//set camera to new position
			this.camera.target = new BABYLON.Vector3(this.activeRoom.originOffset.x+this.activeRoom.centerPosition.x, 0, this.activeRoom.originOffset.z-this.activeRoom.centerPosition.z);
		}
		else if (this.player.mesh.position.x < (this.activeRoom.originOffset.x)) {
			this.octree = this.createOrUpdateSelectionOctree(capacity, 2);
			//going west
			var i_room=(this.activeRoom.row) * Game.map.width + this.activeRoom.col-1;
			//disable torch lights
			var arrayLength;
			for (var doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(false);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(false);
			}
			//set active room to entrance
			this.activeRoom=Game.map.rooms[i_room];
			for (doorIndex = 0; doorIndex < this.activeRoom.door.length; doorIndex++) {
				arrayLength = this.activeRoom.door[doorIndex].Frame.length-1;
				this.activeRoom.door[doorIndex].Frame[arrayLength].torchFire[0].light.setEnabled(true);
				this.activeRoom.door[doorIndex].Frame[arrayLength-1].torchFire[0].light.setEnabled(true);
			}
			
			//set camera to new position
			this.camera.target = new BABYLON.Vector3(this.activeRoom.originOffset.x+this.activeRoom.centerPosition.x, 0, this.activeRoom.originOffset.z-this.activeRoom.centerPosition.z);
		}
	};
	
	// Resize
	window.addEventListener("resize", function () {
		Game.engine.resize();
	});
	
}

Game.runRenderLoop = function () {
	Game.engine.stopRenderLoop();

	// Once the scene is loaded, register a render loop to render it
	Game.engine.runRenderLoop(function () { 
		Game.scene[Game.activeScene].renderLoop();
	});
}