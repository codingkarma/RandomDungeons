function GetPathVector(startX, startZ, endX, endZ, tolerence)
{
	if(Math.abs(startX-endX) < tolerence || Math.abs(startZ-endZ) < tolerence)
	{
		new BABYLON.Vector3(0, 0, 0);
	}
	return new BABYLON.Vector3(startX-endX, 0, startZ-endZ);
}