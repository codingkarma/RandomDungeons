var EntityType = {
    Player: 0,
    Sphere: 1
};

function Entity(options) {
	$.extend(this,{
			type: EntityType.Sphere,
			health: 1,
			damage: 1,
			speed: 1,
			velocity: new BABYLON.Vector3(0,0,0),
			mesh: {},
			attacking: 0
		},options||{});
}