
function GetPathVector(startPosition, endPosition, options)
{
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});
	
	var xDiff = startPosition.x-endPosition.x;
	var zDiff = startPosition.z-endPosition.z;

	if(Math.abs(xDiff*xDiff + zDiff*zDiff) < settings.tolerance)
	{
		return new BABYLON.Vector3(0, scene.gravity.y, 0);
	}
	else {
		return new BABYLON.Vector3(-1*settings.speed*xDiff/startPosition.x, scene.gravity.y, settings.speed*zDiff/startPosition.z);
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