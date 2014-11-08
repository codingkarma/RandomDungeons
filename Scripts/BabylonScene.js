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
    
	//lazy way for handling materials
    scene.tileMaterialFloor = new BABYLON.StandardMaterial("tile-texture-Floor", scene);
    scene.tileMaterialFloor.diffuseColor = new BABYLON.Color3(.5, 0.5, 0.5);

    scene.tileMaterialWall = new BABYLON.StandardMaterial("tile-texture-Wall", scene);
    scene.tileMaterialWall.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.18);
	
    scene.tileMaterialSeal = new BABYLON.StandardMaterial("tile-texture-Seal", scene);
    scene.tileMaterialSeal.diffuseColor = new BABYLON.Color3(0.1, 0.3, 0.1);
	
    scene.tileMaterialSword = new BABYLON.StandardMaterial("tile-texture-Sword", scene);
    scene.tileMaterialSword.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.7);
	
	var floorWidth=120;
	var floorHeight=100;
	var wallHeight=30;
	
	scene.tile = [];
	//bottom tile for "sealing"
	drawTile(scene,new BABYLON.Vector3(0, -.1, 0),new BABYLON.Vector3(floorHeight, 0.2, floorWidth),scene.tileMaterialSeal);
	var tileWidth=10;
	var MapHeight = floorHeight/tileWidth;
    var MapLength = floorWidth/tileWidth;
    var tileZ = 0; var tileX = -(MapHeight/2 - 1) * tileWidth;
    zOffset = -(MapLength / 2 - 1) * tileWidth;
    for (var i = 0; i < (MapHeight*MapLength); i++) {
        if (tileZ > (MapLength - 1)) {
            tileZ = 0;
            tileX += tileWidth;
        }
		scene.tile[i] = drawTile(scene,new BABYLON.Vector3(tileX, 0, tileZ * tileWidth + zOffset),0,scene.tileMaterialFloor);
        scene.tile[i].tileId = i;
        tileZ++;
    }
	
	//create walls
	//North Wall
	var northWall = drawWall(scene,new BABYLON.Vector3(-1*(floorHeight/2-2.5), 5, 0),new BABYLON.Vector3(5, wallHeight, floorWidth),scene.tileMaterialWall);
	var southWall = drawWall(scene,new BABYLON.Vector3(floorHeight/2-2.5, 5, 0),new BABYLON.Vector3(5, wallHeight, floorWidth),scene.tileMaterialWall);
	var eastWall = drawWall(scene,new BABYLON.Vector3(0, 5, floorWidth/2-2.5),new BABYLON.Vector3(floorHeight, wallHeight, 5),scene.tileMaterialWall);
	var westWall = drawWall(scene,new BABYLON.Vector3(0, 5, -1*(floorWidth/2-2.5)),new BABYLON.Vector3(floorHeight, wallHeight, 5),scene.tileMaterialWall);

		// example of loading a mesh from blender export
		scene.Sword=0;
    BABYLON.SceneLoader.ImportMesh("", "Models3D/", "Sword.babylon", scene, function (meshes) {
        var m = meshes[0];
        m.isVisible = true;
        m.position = new BABYLON.Vector3(2, 3, 0);
		m.scaling= new BABYLON.Vector3(2,2,2);
        m.rotation.x =Math.PI/6;
        m.rotation.y =Math.PI/6;
		m.rotation.z=Math.PI/3;
        m.material = scene.tileMaterialSword;
		scene.Sword = m;
    });

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

function drawTile(Scene,tilePosition,tileScale,tileMaterial) {
	//if tileScale is 0 or undefined, use default
	if (tileScale == undefined || tileScale == 0) {
		//x, z is planer, y is height
		var tileScale = new BABYLON.Vector3(9.8, 0.2, 9.8);
	}
	
	var newMesh = new BABYLON.Mesh.CreateBox("floor", 1.0, Scene);
	newMesh.scaling=tileScale;
	newMesh.position=tilePosition;
	newMesh.material = tileMaterial;
	
	return newMesh;
};

function drawWall(Scene,tilePosition,tileScale,tileMaterial) {
	//if tileScale is 0 or undefined, use default
	if (tileScale == undefined || tileScale == 0) {
		//x, z is planer, y is height
		var tileScale = new BABYLON.Vector3(9.8, 0.2, 9.8);
	}
	
	var newMesh = new BABYLON.Mesh.CreateBox("wall", 1.0, Scene);
	newMesh.scaling=tileScale;
	newMesh.position=tilePosition;
	newMesh.material = tileMaterial;
	
	return newMesh;
};
