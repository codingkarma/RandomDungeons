//Helpful Info
// X Z are analogous to x and y cartesian coor. 
//The Map gets drawn in the lower right quadrant, that is x > 0 and z < 0

var bjsHelper =  {
	tileType: [
		{name: "Wall", material: 0, scale: new BABYLON.Vector3(10, 30, 10)},
		{name: "Floor", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)},
		{name: "Pillar", material: 0, scale: new BABYLON.Vector3(10, 30, 10)},
		{name: "Fire",material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)},
		{name: "Door", material: 0, scale: new BABYLON.Vector3(10, 0.2, 10)}
	]
};

function MapEditor(engine) {
    //Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;

    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = Math.PI/16;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, RoomHeight*11, new BABYLON.Vector3.Zero(), scene);
    //set camera to not move
    // camera.lowerAlphaLimit = Alpha;
    // camera.upperAlphaLimit = Alpha;
    // camera.lowerBetaLimit = Beta;
    // camera.upperBetaLimit = Beta;

	//Create me some textures
	//Tile Type detailed materials
	//Wall
	bjsHelper.tileType[0].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[0].name, scene);
	bjsHelper.tileType[0].material.diffuseTexture = new BABYLON.Texture('./Models3D/Wall_Texture-2.png', scene);
	bjsHelper.tileType[0].material.diffuseTexture.wAng=0;
	bjsHelper.tileType[0].material.diffuseTexture.uScale=1;
	// bjsHelper.tileType[0].material.diffuseTexture.vOffset=-1;
	bjsHelper.tileType[0].material.bumpTexture = new BABYLON.Texture('./Models3D/Wall_BumpTexture-2.png', scene);
	bjsHelper.tileType[0].material.bumpTexture.uScale=1;
	bjsHelper.tileType[0].material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	//Floor
	bjsHelper.tileType[1].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[1].name, scene);
	bjsHelper.tileType[1].material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-2.png', scene);
	bjsHelper.tileType[1].material.bumpTexture = new BABYLON.Texture('./Models3D/Floor_Tile-bump.png', scene);
	bjsHelper.tileType[1].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Pillar
	bjsHelper.tileType[2].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[2].name, scene);
	bjsHelper.tileType[2].material.bumpTexture = new BABYLON.Texture('./Models3D/Wall_BumpTexture-2.png', scene);
	bjsHelper.tileType[2].material.diffuseTexture = new BABYLON.Texture('./Models3D/Wall_Texture-2.png', scene);
	bjsHelper.tileType[2].material.diffuseColor = new BABYLON.Color3(.5, 0.5, 0.5);
	//Fire
	bjsHelper.tileType[3].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[3].name, scene);
	bjsHelper.tileType[3].material.diffuseTexture = new BABYLON.Texture('./Models3D/Floor_Tile-2.png', scene);
	bjsHelper.tileType[3].material.bumpTexture = new BABYLON.Texture('./Models3D/Floor_Tile-bump.png', scene);
	bjsHelper.tileType[3].material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	//Door
	bjsHelper.tileType[4].material = new BABYLON.StandardMaterial("texture-" + bjsHelper.tileType[4].name, scene);
	bjsHelper.tileType[4].material.diffuseColor = new BABYLON.Color3(.7, 0.7, 0.7);
	
    scene.tileMaterialSword = new BABYLON.StandardMaterial("tile-texture-Sword", scene);
    scene.tileMaterialSword.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.7);
	// scene.tileMaterialSword.specularColor = new BABYLON.Color3(0, 0, 0);
	
	scene.BlobMaterial = new BABYLON.StandardMaterial("tile-texture-Blob", scene);
    scene.BlobMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.1);

    scene.rooms = map.rooms;
	//Draw Entrance Room
	var roomX0=0;
	var roomZ0=0;
	for (var i_room=0; i_room < map.rooms.length; i_room++) {
		roomX0=map.rooms[i_room].col*map.rooms[i_room].width*map.rooms[i_room].tiles[0].width;
		roomZ0=-map.rooms[i_room].row*map.rooms[i_room].height*map.rooms[i_room].tiles[0].width;
		if (map.rooms[i_room].type == RoomType.Entrance) {
			for (var i = 0; i < map.rooms[i_room].tiles.length ; i++) {
				scene.rooms[i_room].tiles[i].mesh = drawTile(scene, map.rooms[i_room].tiles[i],i);
				//reposition to room location
				scene.rooms[i_room].tiles[i].mesh.position.x=scene.rooms[i_room].tiles[i].mesh.position.x+roomX0;
				scene.rooms[i_room].tiles[i].mesh.position.z=scene.rooms[i_room].tiles[i].mesh.position.z+roomZ0;
				
				scene.rooms[i_room].tiles[i].mesh.checkCollisions = true;
				scene.rooms[i_room].tiles[i].mesh.tileId = i;
			}
			var centerX=map.rooms[i_room].width/2*map.rooms[i_room].tiles[0].width;
			var centerZ=map.rooms[i_room].height/2*map.rooms[i_room].tiles[0].width;
			scene.camera.target = new BABYLON.Vector3(roomX0+centerX, 0, roomZ0-centerZ);
			//set active room to entrance
			scene.activeRoom=map.rooms[i_room];
			scene.activeRoom.index=i_room;
			scene.activeRoom.roomX0=scene.activeRoom.col*scene.activeRoom.width*scene.activeRoom.tiles[0].width;
			scene.activeRoom.roomZ0=-scene.activeRoom.row*scene.activeRoom.height*scene.activeRoom.tiles[0].width;
			
			//Add a light to the room
			scene.rooms[i_room].light = [];
			scene.rooms[i_room].light[0] = new BABYLON.PointLight("Omni", new BABYLON.Vector3(roomX0+centerX, 200, roomZ0-centerZ), scene);
			scene.rooms[i_room].light[0].diffuse = new BABYLON.Color3(.98, .95, .9);
			scene.rooms[i_room].light[0].specular = new BABYLON.Color3(0, 0, 0);
			scene.rooms[i_room].light[1] = new BABYLON.PointLight("Omni-1", new BABYLON.Vector3(roomX0+centerX, 50, roomZ0-2*centerZ), scene);
			scene.rooms[i_room].light[1].diffuse = new BABYLON.Color3(.68, .65, .6);
			scene.rooms[i_room].light[1].specular = new BABYLON.Color3(0, 0, 0);
		}
		else if (map.rooms[i_room].type != RoomType.Empty) {
			for (var i = 0; i < map.rooms[i_room].tiles.length ; i++) {
				scene.rooms[i_room].tiles[i].mesh = drawTile(scene, map.rooms[i_room].tiles[i],i);
				//reposition to room location
				scene.rooms[i_room].tiles[i].mesh.position.x=scene.rooms[i_room].tiles[i].mesh.position.x+roomX0;
				scene.rooms[i_room].tiles[i].mesh.position.z=scene.rooms[i_room].tiles[i].mesh.position.z+roomZ0;
				
				scene.rooms[i_room].tiles[i].mesh.checkCollisions = true;
				scene.rooms[i_room].tiles[i].mesh.tileId = i;
			}
			var centerX=map.rooms[i_room].width/2*map.rooms[i_room].tiles[0].width;
			var centerZ=map.rooms[i_room].height/2*map.rooms[i_room].tiles[0].width;
			//Add a light to the room
			scene.rooms[i_room].light = [];
			scene.rooms[i_room].light[0] = new BABYLON.PointLight("Omni", new BABYLON.Vector3(roomX0+centerX, 200, roomZ0-centerZ), scene);
			scene.rooms[i_room].light[0].diffuse = new BABYLON.Color3(.98, .95, .9);
			scene.rooms[i_room].light[0].specular = new BABYLON.Color3(0, 0, 0);
			scene.rooms[i_room].light[1] = new BABYLON.PointLight("Omni-1", new BABYLON.Vector3(roomX0+centerX, 50, roomZ0-2*centerZ), scene);
			scene.rooms[i_room].light[1].diffuse = new BABYLON.Color3(.68, .65, .6);
			scene.rooms[i_room].light[1].specular = new BABYLON.Color3(0, 0, 0);
		}
	}
    
	
    // example of loading a mesh from blender export
    scene.Sword = 0;
    BABYLON.SceneLoader.ImportMesh("", "Models3D/", "FunSword.js", scene, function (meshes, particleSystems) {
        var m = meshes[0];
        m.isVisible = true;
		var entranceIndex = map.entranceRow*map.width+map.entranceCol;
		roomX0=map.rooms[entranceIndex].col*map.rooms[entranceIndex].width*map.rooms[entranceIndex].tiles[0].width+(Math.floor(map.rooms[entranceIndex].width/2)*map.rooms[entranceIndex].tiles[0].width);
		roomZ0=-map.rooms[entranceIndex].row*map.rooms[entranceIndex].height*map.rooms[entranceIndex].tiles[0].width-((map.rooms[entranceIndex].height-1)*map.rooms[entranceIndex].tiles[0].width);
		// roomX0=-150*2;
		// roomZ0=130;
        m.position = new BABYLON.Vector3(roomX0, 50, roomZ0+10);
        m.scaling = new BABYLON.Vector3(2, 2, 2);
        // m.rotation = new BABYLON.Vector3(Math.PI / 6, Math.PI / 6, Math.PI / 3);
        m.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4);
        // m.material = scene.tileMaterialSword;
        scene.Sword = m;
		scene.Sword.checkCollisions = true;
		scene.Sword.applyGravity=true;
		//Set the ellipsoid around the camera (e.g. your player's size)
		scene.Sword.ellipsoid = new BABYLON.Vector3(2, 1, 2);
    });
	
    // ground.checkCollisions = true;
	//Spawn a Blob on some random tile
	// BABYLON.SceneLoader.ImportMesh("", "Models3D/", "Blob.js", scene, function (newMesh) {
		// var entranceIndex = map.height-1 * map.width + Math.floor(map.width/2);
		
        // scene.Blob = newMesh[0];
		// var randomTile = getRandomInt(0, map.rooms[entranceIndex].width*map.rooms[entranceIndex].height);
		// while (map.rooms[entranceIndex].tiles[randomTile].type != TileType.Floor) {
			// randomTile = getRandomInt(0, map.rooms[entranceIndex].width*map.rooms[entranceIndex].height);
		// }
		// var tileIndex = map.rooms[entranceIndex].tiles[randomTile].row*map.rooms[entranceIndex].tiles[randomTile].width + map.rooms[entranceIndex].tiles[randomTile].col;
		// scene.Blob.position = new BABYLON.Vector3(scene.map.rooms[entranceIndex].tiles[randomTile].mesh.position.x, scene.map.rooms[entranceIndex].tiles[randomTile].mesh.position.y, scene.map.rooms[entranceIndex].tiles[randomTile].mesh.position.z);
		// scene.Blob.scaling = new BABYLON.Vector3(8, 8, 8);
        // scene.Blob.isVisible = true;
        // scene.Blob.material = scene.BlobMaterial;
    // });
    // BABYLON.SceneLoader.ImportMesh("", "Models3D/", "BookGolem.js", scene, function (newMesh) {
        // scene.BookGolem = newMesh;
        // scene.BookGolem[0].position.y += 4;
		// for (var i=1; i< newMesh.length;i++) {
			// scene.BookGolem[i].position.y += 4;
		// }
        // // m[0].isVisible = true;
        // // m.material = scene.tileMaterialSword;
    // });

    scene.registerBeforeRender(function(){	
		if(scene.isReady() && scene.Sword) {
			// var velocity = new BABYLON.Vector3(0, -10, 0);	
			// scene.Sword.moveWithCollisions(velocity);
		}
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
};

function drawTile(Scene, tile, index) {

    var newMesh = new BABYLON.Mesh.CreateBox(bjsHelper.tileType[tile.type].name + '-' + parseInt(index), 1.0, Scene);
    newMesh.scaling = bjsHelper.tileType[tile.type].scale;
    newMesh.position = new BABYLON.Vector3(tile.col*tile.width, 0, -tile.row*tile.width);
    newMesh.material = bjsHelper.tileType[tile.type].material;

    return newMesh;
};
