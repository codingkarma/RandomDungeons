
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
	// if (evt.keyCode == KEYS.SPACE) {
		// SpaceBarDown = true;
	// }
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
	// if (evt.keyCode == KEYS.SPACE) {
		// SpaceBarDown = false;
	// }
}

function processInput(entity) {
	var vX=0;
	var vZ=0;
	var delta = (scene.joystick.deltaJoystickVector);
	
    if (UpDown && !DownDown || delta.y < -5) {
        vZ=1;
		entity.rotation.y = Math.PI / 2;
		entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, Math.PI / 2, entity.rotation.z);
    }
    else if (DownDown && !UpDown || delta.y > 5) {
        vZ=-1;
		entity.rotation.y = -Math.PI / 2;
		entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, -Math.PI / 2, entity.rotation.z);
    }
    if (LeftDown && !RightDown || delta.x < -5) {
        vX=-1;
		entity.rotation.y = 0;
		entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, 0, entity.rotation.z);
    }
    else if (RightDown && !LeftDown || delta.x > 5) {
        vX=1;
		entity.rotation.y = Math.PI;
		entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, Math.PI, entity.rotation.z);
    }
	var velocity=new BABYLON.Vector3(vX, scene.gravity.y, vZ);
	entity.moveWithCollisions(velocity);
	
	// if (SpaceBarDown == true) {
		// entity.Attack = 1;
	// }

}

