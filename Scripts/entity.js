var EntityType ={
    Player: 0,
    Sphere: 1,
};


function Entity(options) {
	return $.extend({
			type: EntityType.Sphere,
			health: 1,
			damage: 1,
			speed: 1
		},options||{});
}