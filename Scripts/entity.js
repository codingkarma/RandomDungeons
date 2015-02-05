var EntityType = {
    Player: 0,
    Enemy: 1,
	Boss: 2
};

var WeaponType = {
	Melee: 0,
	Projectile: 1,
}

function Entity(mesh, options) {

	this.mesh = mesh;
	this.actionType = {
		Idle: 0,
		Move: 1,
		Attack: 2,
		TakeDmg: 3,
		Die: 4
	}

	$.extend(this,{
			weaponMesh: {},
			type: EntityType.Enemy,
			health: 1,
			damage: 1,
			weapon: {'name': 'Steel Sword', 'type': WeaponType.Melee, 'range': 16, 'dmgModifier': 0, 'speedModifier': 1},
			speed: 1,
			velocity: {'direction': new BABYLON.Vector3(0,0,0), 'angle': 0, 'magnitude': 0},
			attacking: 0,
			action: 0,
			isDead: false
		},options||{});
}