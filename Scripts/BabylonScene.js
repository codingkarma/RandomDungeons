function MapEditor(engine) {
    //Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    //Adding the light to the scene
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 100, 100), scene);

    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
	var Alpha = .000000001;
	var Beta = Math.PI/16;
    var camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, 130, new BABYLON.Vector3.Zero(), scene);
	//set camera to not move
	camera.lowerAlphaLimit=Alpha;
	camera.upperAlphaLimit=Alpha;
	camera.lowerBetaLimit=Beta;
	camera.upperBetaLimit=Beta;
    
    scene.tileMaterialFloor = new BABYLON.StandardMaterial("tile-texture-Floor", scene);
    scene.tileMaterialFloor.diffuseColor = new BABYLON.Color3(.6, 0.6, 0.7);

    scene.tileMaterialWall = new BABYLON.StandardMaterial("tile-texture-Wall", scene);
    scene.tileMaterialWall.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.18);
	
	var floorWidth=120;
	var floorHeight=100;
	var wallHeight=30;
	
	var floor = BABYLON.Mesh.CreateBox("floor", 1.0, scene);
	floor.scaling.x=floorHeight;
	floor.scaling.z=floorWidth;
	floor.material = scene.tileMaterialFloor;
	
	//create walls
	//North Wall
	var nWall = BABYLON.Mesh.CreateBox("northWall", 1.0, scene);
	nWall.scaling.x=5;
	nWall.scaling.y=wallHeight;
	nWall.scaling.z=floorWidth;
	nWall.position.x=-1*(floorHeight/2-2.5);
	nWall.position.y=5;
	nWall.material = scene.tileMaterialWall;
	
	//South Wall 
	var sWall = BABYLON.Mesh.CreateBox("southWall", 1.0, scene);
	sWall.scaling.x=5;
	sWall.scaling.y=wallHeight;
	sWall.scaling.z=floorWidth;
	sWall.position.x=floorHeight/2-2.5;
	sWall.position.y=5;
	sWall.material = scene.tileMaterialWall;
	
	var eWall = BABYLON.Mesh.CreateBox("eastWall", 1.0, scene);
	eWall.scaling.x=floorHeight;
	eWall.scaling.y=wallHeight;
	eWall.scaling.z=5;
	eWall.position.z=floorWidth/2-2.5;
	eWall.position.y=5;
	eWall.material = scene.tileMaterialWall;
	
	var wWall = BABYLON.Mesh.CreateBox("westWall", 1.0, scene);
	wWall.scaling.x=floorHeight;
	wWall.scaling.y=wallHeight;
	wWall.scaling.z=5;
	wWall.position.z=-1*(floorWidth/2-2.5);
	wWall.position.y=5;
	wWall.material = scene.tileMaterialWall;

	

    // scene.tile = [];
    // scene.updateQueue = [];
    // scene.loadMap = 0;
    // scene.updateQueue.tileId = [];
    // // gameStateHelper.gameMap.Tiles = [];
    // var MapHeight = 20;
    // var MapLength = 20
    // var tileZ = 0; var tileX = -(MapHeight/2 - 1) * 2.7;
    // zOffset = -(MapLength / 2 - 1) * 2.7;
    // for (var i = 0; i < (MapHeight*MapLength); i++) {
        // if (tileZ > (MapLength - 1)) {
            // tileZ = 0;
            // tileX += 2.7;
        // }
        // scene.tile[i] = BABYLON.Mesh.CreateCylinder("tile-" + i, .25, 3, 3, 6, scene, false);
        // scene.tile[i].material = scene.tileMaterialFloor;
        // scene.tile[i].tileId = i;
        // scene.tile[i].position = new BABYLON.Vector3(tileX - 1.35 * (tileZ % 2), 0, tileZ * 2.35 + zOffset);
        // // var mapTile = new MapTile();
        // // mapTile.insertTileData(scene.tile[i]);
        // // gameStateHelper.gameMap.Name = "Map-00";
        // // gameStateHelper.gameMap.Tiles.push(mapTile);
        // tileZ++;
    // }

		// example of loading a mesh from blender export
    // BABYLON.SceneLoader.ImportMesh("", "../BabylonModels/", "Sword.babylon", scene, function (meshes) {
        // var m = meshes[0];
        // m.isVisible = true;
        // //m.scaling = new BABYLON.Vector3(20, 20, 20);
        // m.position = new BABYLON.Vector3(2, 3, 0);
        // m.rotation.x =Math.PI;
        // m.material = scene.tileMaterialFloor;
        // WOLF_MODEL = m;
    // });

	//need to see what this does, don't remember
    scene.registerBeforeRender(function () {
        //if (box.intersectsMesh(plan, true)) {

        //} else {
        //    box.position.y -= 1;
        //}
    });

    //When click event is raised
    document.getElementById('renderCanvas').addEventListener("click", function (evt) {
        
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
};