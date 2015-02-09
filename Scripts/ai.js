
function GetPathVector0(startPosition, endPosition, options)
{
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});
	
	var xDiff = startPosition.x-endPosition.x;
	var zDiff = startPosition.z-endPosition.z;

	if(Math.sqrt(xDiff*xDiff + zDiff*zDiff) < settings.tolerance)
	{
		return new BABYLON.Vector3(0, Game.scene[Game.activeScene].gravity.y, 0);
	}
	else {
		return new BABYLON.Vector3(-1*settings.speed*xDiff/startPosition.x, Game.scene[Game.activeScene].gravity.y, settings.speed*zDiff/startPosition.z);
	}
}

function GetPathVector(startPosition, endPosition, options) {
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});
	
	var xDiff = endPosition.x-startPosition.x;
	var zDiff = endPosition.z-startPosition.z;
	var radius = Math.sqrt(xDiff*xDiff + zDiff*zDiff);
	var angle = Math.atan2(zDiff, xDiff);

	if(radius < settings.tolerance)
	{
		return {'direction': new BABYLON.Vector3(0, Game.scene[Game.activeScene].gravity.y, 0), 'angle': angle, 'magnitude': radius};
	}
	else {
		return {'direction': new BABYLON.Vector3(settings.speed*Math.cos(angle), Game.scene[Game.activeScene].gravity.y, settings.speed*Math.sin(angle)), 'angle': angle, 'magnitude': radius};
	}
}

function getPointingVector(sourceMesh, targetMesh) {
	var xDiff = targetMesh.position.x-sourceMesh.position.x;
	var zDiff = targetMesh.position.z-sourceMesh.position.z;
	var radius = Math.sqrt(xDiff*xDiff + zDiff*zDiff);
	var angle = Math.atan2(zDiff, xDiff);

	return {'angle': angle, 'magnitude': radius};
}

function GetPathVectorScatter(startPosition, endPosition, options) {
	//Uses Angle in degrees instead of radians to give some randomness
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});
	
	var xDiff = endPosition.x-startPosition.x;
	var zDiff = endPosition.z-startPosition.z;
	var radius = Math.sqrt(xDiff*xDiff + zDiff*zDiff);
	var angle = Math.atan(zDiff/xDiff)*(180/Math.PI); + (xDiff < 0)*180 + ((zDiff < 0) && (xDiff > 0))*180;
	
	if(radius < settings.tolerance)
	{
		return new BABYLON.Vector3(0, Game.scene[Game.activeScene].gravity.y, 0);
	}
	else {
		return new BABYLON.Vector3(settings.speed*Math.cos(angle), Game.scene[Game.activeScene].gravity.y, settings.speed*Math.sin(angle));
	}
}

function GetDirectionAndAngle(startX, startZ, endX, endZ, options)
{
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});

	if(Math.abs(startPosition.x-endPosition.x) < settings.tolerance || Math.abs(startPosition.z-endPosition.z) < settings.tolerance)
	{
		return {vector: GetPathVector(startPosition, endPosition, options), angle: Math.acos((startX*endX + startZ*endZ)/(sqrt(startX^2 + endX^2) *sqrt(startZ^2 + endZ^2)))};
	}
	return {vector: GetPathVector(startPosition, endPosition, options), 
		angle:Math.acos((startX * endX + startZ * endZ)/(sqrt(startX^2 + endX^2) *sqrt(startZ^2 + endZ^2)))};
}

function GetTileIndex(entity, currentRoom)
{
	var row = Math.floor((entity.z-room.originOffset.z)/TileWidth);
	var col = Math.floor((entity.x-room.originOffset.x)/TileWidth);

	return row * currentRoom.width + col;
}