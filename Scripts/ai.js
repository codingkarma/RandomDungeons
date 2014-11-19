function GetDirectionAndAngle(startX, startZ, endX, endZ, tolerence)
{
	if(Math.abs(startX-endX) < tolerence || Math.abs(startZ-endZ) < tolerence)
	{
		return {vector: new BABYLON.Vector3(0, 0, 0), angle: Math.acos((startX*endX + startZ*endZ)/(sqrt(startX^2 + endX^2) *sqrt(startZ^2 + endZ^2)));
	}
	return {vector: new BABYLON.Vector3(startX-endX, 0, startZ-endZ), 
		angle:Math.acos((startX * endX + startZ * endZ)/(sqrt(startX^2 + endX^2) *sqrt(startZ^2 + endZ^2)));
}
