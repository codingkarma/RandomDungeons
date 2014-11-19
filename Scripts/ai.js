
function GetPathVector(startPosition, endPosition, options)
{
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});

	if(Math.abs(startPosition.x-endPosition.x) < settings.tolerance || Math.abs(startPosition.z-endPosition.z) < settings.tolerance)
	{
		return new BABYLON.Vector3(0, scene.gravity.y, 0);
	}
	else {
		return new BABYLON.Vector3(-1*settings.speed*(startPosition.x-endPosition.x)/startPosition.x, scene.gravity.y, settings.speed*(startPosition.z-endPosition.z)/startPosition.z);
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
		return {vector: new BABYLON.Vector3(0, scene.gravity.y, 0), angle: Math.acos((startX*endX + startZ*endZ)/(sqrt(startX^2 + endX^2) *sqrt(startZ^2 + endZ^2)))};
	}
	return {vector: new BABYLON.Vector3(startX-endX, scene.gravity.y, startZ-endZ), 
		angle:Math.acos((startX * endX + startZ * endZ)/(sqrt(startX^2 + endX^2) *sqrt(startZ^2 + endZ^2)))};
}
