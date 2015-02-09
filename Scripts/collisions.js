Game.sanitizeAngle = function (angle) {
	// Sanitizes value to be within 0 to +2*PI
	var quotient  = 0;
	if (angle < 0) {
		angle += (2*Math.PI);
	}
	quotient = Math.floor(angle/(2*Math.PI)) ;
	if(quotient >= 1) {
		angle -= (2*Math.PI*quotient);
	}
	return angle;
}

Game.detectCollision = function(source, target) {
	if (target.velocity.magnitude <= source.weapon[source.activeAttack].range) {
		// TODO: This is pretty much haxxord together, re-evaluate later
		var sourceAngle = source.velocity.angle;
		var targetAngle = target.velocity.angle;
		//flip angle
		targetAngle+=Math.PI;
		targetAngle = Game.sanitizeAngle(targetAngle);
		sourceAngle = Game.sanitizeAngle(sourceAngle);
		// Check if source is within sweep of melee weapon
		if (targetAngle > (3*Math.PI/2) && (targetAngle >= Game.sanitizeAngle(sourceAngle - .8*Math.PI/2))) {
			return true;
		}
		if ( Math.abs(targetAngle - sourceAngle) < .8*Math.PI/2 ) {
			return true;
		}
	}
	return false;
}

Game.detectEnemyHit = function(scene, activeEnemy) {
	if ((activeEnemy.velocity.magnitude <= activeEnemy.weapon[activeEnemy.activeAttack].range) && (activeEnemy.action != activeEnemy.actionType.Attack)) {
		if (!scene.player.isDead) {
			scene.player.health--;
			$('#dmg').text('Health: ' + parseInt(scene.player.health));
			//TO DO:this can be handled better if we use knockout.js
			if (scene.player.health == 3 ) {
				$('#healthBar-4').hide();
			}
			else if (scene.player.health == 2 ) {
				$('#healthBar-3').hide();
			}
			else if (scene.player.health == 1 ) {
				$('#healthBar-2').hide();
			}
			else if (scene.player.health <= 0 ) {
				$('#healthBar-1').hide();
				scene.player.mesh.playerAnimations.die.start(scene,scene.player);
			}
			scene.player.mesh.playerAnimations.takeDmg.start(scene,scene.player);
		}
	}
}