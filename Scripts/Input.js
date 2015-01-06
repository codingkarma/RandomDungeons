
//Key States
var LeftDown = false;
var RightDown = false;
var UpDown = false;
var DownDown = false;
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
}

function processInput(entity,speed) {
	var vX=0;
	var vZ=0;
	var activeScene = Game.scene[Game.activeScene];
	var delta = activeScene.joystick.deltaJoystickVector;
	
    if (UpDown && !DownDown || delta.y < -5) {
        vZ=1;
		// entity.rotation.y = Math.PI / 2;
		// entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, Math.PI / 2, entity.rotation.z);
    }
    else if (DownDown && !UpDown || delta.y > 5) {
        vZ=-1;
		// entity.rotation.y = -Math.PI / 2;
		// entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, -Math.PI / 2, entity.rotation.z);
    }
    if (LeftDown && !RightDown || delta.x < -5) {
        vX=-1;
		// entity.rotation.y = 0;
		// entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, 0, entity.rotation.z);
    }
    else if (RightDown && !LeftDown || delta.x > 5) {
        vX=1;
		// entity.rotation.y = Math.PI;
		// entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, Math.PI, entity.rotation.z);
    }
	if (vX || vZ) {
		var newRotation = -Math.atan2(vZ,vX) + Math.PI;
		entity.rotation.y = newRotation;
		entity.currentFacingAngle = new BABYLON.Vector3(entity.rotation.x, newRotation, entity.rotation.z);
		var waveValue = ((Game.engine.loopCounter*Game.engine.loopCounter) % 40)/40*Math.PI;
		var velocity=new BABYLON.Vector3(speed*vX, .6*(Math.cos(waveValue)-.5), speed*vZ);
	}
	else {
		var velocity=new BABYLON.Vector3(speed*vX, activeScene.gravity.y, speed*vZ);
	}
	entity.moveWithCollisions(velocity);
	
	
	if (activeScene.joystickAction._joystickPressed) {
		if (activeScene.player.attacking==false) {
			activeScene.player.mesh.playerAnimations.updateAttack(activeScene);
		}
	}

}

