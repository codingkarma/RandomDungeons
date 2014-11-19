function GetPathVector(startPosition, endPosition, options)
{
	var settings = $.extend({
		speed: 1.0,
		tolerance: 1.0
	},options||{});

	if(Math.abs(startPosition.x-endPosition.x) < settings.tolerance || Math.abs(startPosition.z-endPosition.z) < settings.tolerance)
	{
		return new BABYLON.Vector3(0, -10, 0);
	}
	else {
		return new BABYLON.Vector3(-1*settings.speed*(startPosition.x-endPosition.x)/startPosition.x, -10, settings.speed*(startPosition.z-endPosition.z)/startPosition.z);
	}
}