
//Key States
var LeftDown = false;
var RightDown = false;
var UpDown = false;
var DownDown = false;
var SpaceBarDown = false;
//KEYS
var KEYS = {
    SPACE: 32,
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    DOWN: 83,
    P: 80
};

//Key Listeners
window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);

function doKeyDown(evt) {
    switch (evt.keyCode) {   
        case KEYS.LEFT:
            LeftDown = true;
            break;
            //right      
        case KEYS.RIGHT:
            RightDown = true;
            break;
        case KEYS.UP:
            UpDown = true;
            break;
        case KEYS.DOWN:
            DownDown = true;
            break;
    }
	if (evt.keyCode == KEYS.SPACE) {
		SpaceBarDown = true;
	}
}

function doKeyUp(evt) {
    switch (evt.keyCode) {   
        case KEYS.LEFT:
            LeftDown = false;
            break;
            //right      
        case KEYS.RIGHT:
            RightDown = false;
            break;
        case KEYS.UP:
            UpDown = false;
            break;
        case KEYS.DOWN:
            DownDown = false;
            break;
    }
	if (evt.keyCode == KEYS.SPACE) {
		SpaceBarDown = false;
	}
}

function processInput(entity) {
	var vX=0;
	var vZ=0;
	
    if (UpDown && !DownDown) {
        vZ=1;
		entity.rotation.y = Math.PI / 2;
    }
    else if (DownDown && !UpDown) {
        vZ=-1;
		entity.rotation.y = -Math.PI / 2;
    }
    if (LeftDown && !RightDown) {
        vX=-1;
		entity.rotation.y = 0;
    }
    else if (RightDown && !LeftDown) {
        vX=1;
		entity.rotation.y = Math.PI;
    }
	var velocity=new BABYLON.Vector3(vX, scene.gravity.y, vZ);
	entity.moveWithCollisions(velocity);
	
	if (SpaceBarDown == true) {
		entity.Attack = 1;
	}

}

