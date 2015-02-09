
Game.initStartScene = function() {
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
			if (Game.engine.loopCounter % 5 == 0) {
				$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
			}
			this.render();
		}
	};
}
	
Game.initGameScene = function() {
	var activeScene;
	
	// Create Game Scene
	activeScene = Game.scene.push(Game.CreateGameScene(Game.engine)) - 1;
	Game.scene[activeScene].enemyCounter=0;
	Game.scene[activeScene].renderLoop = function () {
			
		if (!this.isErrthingReady) {
			if (this.isReady() && this.isLoaded) {
				this.isErrthingReady = true;
			}
			//when everything is ready this gets executed once
			if (this.isErrthingReady) {
				for (var i=0; i < this.activeRoom.enemy.length; i++) {
					this.activeRoom.enemy[i].velocity = {'direction' : new BABYLON.Vector3(0,this.gravity.y,0), 'angle': 0};
				}
				this.player.attacking=false;
				this.player.mesh.currentFacingAngle = new BABYLON.Vector3(this.player.mesh.rotation.x, this.player.mesh.rotation.y, this.player.mesh.rotation.z);
				this.octree = this.createOrUpdateSelectionOctree(64, 2);
				if (Game.debug) {
					this.debugLayer.show();
					$('#DebugLayerStats').css({"bottom": "1em"});
					$('#DebugLayerStats').css({"right": "1em"});
					$('#DebugLayerDrawingCanvas').css({"width": "90%"});
					$('#DebugLayerDrawingCanvas').css({"height": "90%"});
				}
				
				//start game logic loop
				this.timedLogicLoop = new timedLoop(this.logicLoop,50);
				// setTimeout(function (activeScene) {
					// activeScene.timedLogicLoop.start();
				// },500, this);
				this.timedLogicLoop.start();
				
				// TO DO: Implement optimization (only availabe in BJS v2+)
				//BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[Game.activeScene]);
				// this.optimizeOptions = BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
				// this.optimizeOptions.targetFrameRate=60;
				// BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[activeScene], this.optimizeOptions, function() {
				   // // On success
				// }, function() {
				   // // FPS target not reached
				// });
			}
		}
		else {
			//Render scene and any changes
			this.render();
		}
	};
	
	Game.scene[activeScene].checkActiveRoom = function() {
		if (this.player.mesh.position.z > (this.activeRoom.originOffset.z)) {
			//going north
			var i_room=(this.activeRoom.row-1) * Game.map.width + this.activeRoom.col;
			this.changeActiveRoom(i_room);
		}
		else if (this.player.mesh.position.x > (this.activeRoom.originOffset.x+this.activeRoom.width*this.activeRoom.tiles[0].width)) {
			//going east
			var i_room=(this.activeRoom.row) * Game.map.width + this.activeRoom.col+1;
			this.changeActiveRoom(i_room);
		}
		else if (this.player.mesh.position.z < (this.activeRoom.originOffset.z - this.activeRoom.height*this.activeRoom.tiles[0].width)) {
			//going south
			var i_room=(this.activeRoom.row+1) * Game.map.width + this.activeRoom.col;
			this.changeActiveRoom(i_room);
		}
		else if (this.player.mesh.position.x < (this.activeRoom.originOffset.x)) {
			//going west
			var i_room=(this.activeRoom.row) * Game.map.width + this.activeRoom.col-1;
			this.changeActiveRoom(i_room);
		}
	};
	Game.scene[activeScene].changeActiveRoom = function (i_room) {
		var capacity = 64;
		//disable torch lights
		var arrayLength;
		for (var doorIndex = 0; doorIndex < this.activeRoom.doors.length; doorIndex++) {
			arrayLength = this.activeRoom.doors[doorIndex].frame.length-1;
			// Start the particle system
			this.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].stop();
			this.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].stop();
			this.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(false);
			this.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(false);
		}
		//set active room to entrance
		//Game.activateRoom(this.rooms[i_room],this.activeRoom);
		this.activeRoom=this.rooms[i_room];
		for (doorIndex = 0; doorIndex < this.activeRoom.doors.length; doorIndex++) {
			arrayLength = this.activeRoom.doors[doorIndex].frame.length-1;
			// Start the particle system
			this.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].start();
			this.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].start();
			this.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(true);
			this.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(true);
		}
		//set camera to new position
		this.camera.target = new BABYLON.Vector3(this.activeRoom.originOffset.x+this.activeRoom.centerPosition.x, 0, this.activeRoom.originOffset.z-this.activeRoom.centerPosition.z);
		this.octree = this.createOrUpdateSelectionOctree(capacity, 2);
		this.gravity.y = -9.81;
	}
	
	
}

Game.runRenderLoop = function () {
	Game.engine.stopRenderLoop();

	// Once the scene is loaded, register a render loop to render it
	setImmediate(function(){
		Game.engine.runRenderLoop(function () { 
			Game.scene[Game.activeScene].renderLoop();
		});
	});
}

Game.mergeMeshes = function (meshName, arrayObj, scene) {
    var arrayPos = [];
    var arrayNormal = [];
    var arrayUv = [];
    var arrayUv2 = [];
    var arrayColor = [];
    var arrayMatricesIndices = [];
    var arrayMatricesWeights = [];
    var arrayIndice = [];
    var savedPosition = [];
    var savedNormal = [];
    var newMesh = new BABYLON.Mesh(meshName, scene);
    var UVKind = true;
    var UV2Kind = true;
    var ColorKind = true;
    var MatricesIndicesKind = true;
    var MatricesWeightsKind = true;

    for (var i = 0; i != arrayObj.length ; i++) {
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UVKind]))
            UVKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UV2Kind]))
            UV2Kind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.ColorKind]))
            ColorKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesIndicesKind]))
            MatricesIndicesKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesWeightsKind]))
            MatricesWeightsKind = false;
    }

    for (i = 0; i != arrayObj.length ; i++) {
        var ite = 0;
        var iter = 0;
        arrayPos[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.PositionKind);
        arrayNormal[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.NormalKind);
        if (UVKind)
            arrayUv = arrayUv.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UVKind));
        if (UV2Kind)
            arrayUv2 = arrayUv2.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UV2Kind));
        if (ColorKind)
            arrayColor = arrayColor.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.ColorKind));
        if (MatricesIndicesKind)
            arrayMatricesIndices = arrayMatricesIndices.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind));
        if (MatricesWeightsKind)
            arrayMatricesWeights = arrayMatricesWeights.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind));

        var maxValue = savedPosition.length / 3;

        arrayObj[i].computeWorldMatrix(true);
        var worldMatrix = arrayObj[i].getWorldMatrix();

        for (var ite = 0 ; ite != arrayPos[i].length; ite += 3) {
            var vertex = new BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(arrayPos[i][ite], arrayPos[i][ite + 1], arrayPos[i][ite + 2]), worldMatrix);
            savedPosition.push(vertex.x);
            savedPosition.push(vertex.y);
            savedPosition.push(vertex.z);
        }

        for (var iter = 0 ; iter != arrayNormal[i].length; iter += 3) {
            var vertex = new BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(arrayNormal[i][iter], arrayNormal[i][iter + 1], arrayNormal[i][iter + 2]), worldMatrix);
            savedNormal.push(vertex.x);
            savedNormal.push(vertex.y);
            savedNormal.push(vertex.z);
        }

        var tmp = arrayObj[i].getIndices();
        for (it = 0 ; it != tmp.length; it++) {
            arrayIndice.push(tmp[it] + maxValue);
        }
        arrayIndice = arrayIndice.concat(tmp);

        arrayObj[i].dispose(false);
    }

    newMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, savedPosition, false);
    newMesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, savedNormal, false);
    if (arrayUv.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.UVKind, arrayUv, false);
    if (arrayUv2.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.UV2Kind, arrayUv, false);
    if (arrayColor.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, arrayUv, false);
    if (arrayMatricesIndices.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, arrayUv, false);
    if (arrayMatricesWeights.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, arrayUv, false);

    newMesh.setIndices(arrayIndice);
    return newMesh;
};