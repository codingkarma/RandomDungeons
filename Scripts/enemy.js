Game.EnemyType = {
	StoneBall: 0,
	FlyingBook: 1
	//Skeleton: 2
}

Game.BossType = {
	StoneBall: 0,
	FlyingBook: 1
	//Skeleton: 2
}

Game.enemyFactory = function(activeScene, enemyType) {
	switch(enemyType) {
		case Game.EnemyType.FlyingBook:
			// New up entity with params
			var newEntity = new Entity(activeScene.enemies[0].meshes[0].clone("enemyMesh-" + Game.enemyCount), {type: EntityType.Enemy, health: 2, damage: 1, speed: .2, action: 0, weapon: {'name': 'Self', 'type': WeaponType.Melee, 'range': 8, 'dmgModifier': 0, 'speedModifier': .75}});
			newEntity.mesh.skeleton = activeScene.enemies[0].skeletons[0].clone("enemySkeleton-" + Game.enemyCount);
			newEntity.skeletons = newEntity.mesh.skeleton;
			newEntity.mesh.material = activeScene.enemies[0].meshes[0].material.clone();
			newEntity.mesh.scaling = new BABYLON.Vector3(2, 2, 2);
			newEntity.mesh.ellipsoid = new BABYLON.Vector3(4, 4, 4);
			// Assign Rotation Offset
			newEntity.mesh.rotationOffset = new BABYLON.Vector3(0,-Math.PI/2,0);
			
			newEntity.mesh.type = Game.EnemyType.FlyingBook;
			//attach animations
			newEntity.mesh.enemyAnimations = new Game.importedAnimations(newEntity);
			newEntity.mesh.enemyAnimations.init(activeScene);
			newEntity.moveKeys = [];
			newEntity.moveKeys.push(0);
			newEntity.moveKeys.push(30);
			newEntity.attackKeys = [];
			newEntity.attackKeys.push(100);
			newEntity.attackKeys.push(130);
			break;
		default:
			// Enemy Sphere
			var newEntity = new Entity(activeScene.enemies[activeScene.enemies.length-1].meshes[0].clone(), {type: EntityType.Enemy, health: 2, damage: 1, speed: .2, action: 1, weapon: {'name': 'None', 'type': WeaponType.Melee, 'range': 0, 'dmgModifier': 0, 'speedModifier': 1}});
			newEntity.mesh.material = activeScene.enemies[[activeScene.enemies.length-1]].meshes[0].material.clone();
			newEntity.mesh.type = Game.EnemyType.StoneBall;
			newEntity.mesh.rotationOffset = new BABYLON.Vector3(0,0,0);
			//attach animations
			newEntity.mesh.enemyAnimations = new Game.animationsStoneBall(newEntity.mesh);
			newEntity.mesh.enemyAnimations.init(activeScene);
	}
	// Make sure important properties are set
	newEntity.mesh.isVisible = true;
	newEntity.mesh.checkCollisions = true;
	newEntity.mesh.applyGravity = true;
	
	Game.enemyCount++;
	
	return newEntity;
}

Game.bossFactory = function(activeScene, bossType) {
	switch(bossType) {
		case Game.BossType.FlyingBook:
			// New up entity with params
			var newEntity = new Entity(activeScene.bosses[0].meshes[0].clone("bossMesh-" + Game.bossCount), {type: EntityType.Boss, health: 6, damage: 1, speed: .2, action: 0, weapon: {'name': 'Fists', 'type': WeaponType.Melee, 'range': 10, 'dmgModifier': 0, 'speedModifier': .5}});
			newEntity.mesh.skeleton = activeScene.bosses[0].skeletons[0].clone("bossSkeleton-" + Game.bossCount);
			newEntity.skeletons = newEntity.mesh.skeleton;
			newEntity.meshes = [];
			for (var i = 1; i < activeScene.bosses[0].meshes.length; i++) {
				newEntity.meshes.push(activeScene.bosses[0].meshes[i].clone());
				newEntity.meshes[i-1].parent = newEntity.mesh;
				newEntity.meshes[i-1].skeleton = newEntity.mesh.skeleton;
			}
			newEntity.mesh.material = activeScene.bosses[0].meshes[0].material.clone();
			newEntity.mesh.scaling = new BABYLON.Vector3(3, 3, 3);
			newEntity.mesh.ellipsoid = new BABYLON.Vector3(6, 2, 4);
			// Assign Rotation Offset
			newEntity.mesh.rotationOffset = new BABYLON.Vector3(0,-Math.PI/2,0);
			
			newEntity.mesh.type = Game.BossType.FlyingBook;
			//attach animations
			newEntity.mesh.enemyAnimations = new Game.importedAnimations(newEntity);
			newEntity.mesh.enemyAnimations.init(activeScene);
			// set keys for animations
			newEntity.moveKeys = [];
			newEntity.moveKeys.push(0);
			newEntity.moveKeys.push(40);
			newEntity.attackKeys = [];
			newEntity.attackKeys.push(50);
			newEntity.attackKeys.push(80);
			break;
		default:
			// Enemy Sphere
			var newEntity = new Entity(activeScene.bosses[activeScene.bosses.length-1].meshes[0].clone(), {type: EntityType.Boss, health: 6, damage: 1, speed: .1, action: 1, weapon: {'name': 'None', 'type': WeaponType.Melee, 'range': 0, 'dmgModifier': 0, 'speedModifier': 1}});
			newEntity.mesh.material = activeScene.bosses[[activeScene.bosses.length-1]].meshes[0].material.clone();
			newEntity.mesh.type = Game.BossType.StoneBall;
			newEntity.mesh.rotationOffset = new BABYLON.Vector3(0,0,0);
			//attach animations
			newEntity.mesh.enemyAnimations = new Game.animationsStoneBall(newEntity.mesh);
			newEntity.mesh.enemyAnimations.init(activeScene);
	}
	// Make sure important properties are set
	newEntity.mesh.isVisible = true;
	newEntity.mesh.checkCollisions = true;
	newEntity.mesh.applyGravity = true;
	
	Game.bossCount++;
	
	return newEntity;
}

Game.createNativeEnemies = function(scene) {
	// Create small stone ball
	var index = scene.enemies.push({ meshes: [] }) - 1;
	scene.enemies[index].meshes[0] = new BABYLON.Mesh.CreateSphere("enemyStoneBall", 8.0, 8.0, scene);
	scene.enemies[index].meshes[0].material = new scene.enemyMaterial();
	scene.enemies[index].meshes[0].ellipsoid = new BABYLON.Vector3(4, 2, 4);
	
	// Create Big Boss stone ball
	var index = scene.bosses.push({ meshes: [] }) - 1;
	scene.bosses[index].meshes[0] = new BABYLON.Mesh.CreateSphere("bossStoneBall", 12.0, 12.0, scene);
	scene.bosses[index].meshes[0].material = new scene.enemyMaterial();
	scene.bosses[index].meshes[0].ellipsoid = new BABYLON.Vector3(10, 5, 10);
}

Game.spawnEnemy = function(activeScene, room) {
	// Determine which enemy to spawn (for now 1 enemy per room)
	var enemyType = Game.getRandomInt(0,1);
	
	//Get Room details
	var enemyIndex = room.enemy.push(Game.enemyFactory(activeScene, enemyType)) - 1;
	room.enemy[enemyIndex].index = enemyIndex;
	
	var randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	// TO DO: Make sure enemy doesn't spawn on top of player
	while (room.tiles[randomTile].type != Game.TileType.Floor) {
		randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	}
	var tileIndex = room.tiles[randomTile].row*room.tiles[randomTile].width + room.tiles[randomTile].col;
	room.enemy[enemyIndex].mesh.position = new BABYLON.Vector3(room.tiles[randomTile].mesh.position.x, 2, room.tiles[randomTile].mesh.position.z);
}

Game.spawnBoss = function(activeScene, room) {
	// Determine which enemy to spawn (for now 1 enemy per room)
	var bossType = Game.getRandomInt(0,1);
	
	//Get Room details
	var enemyIndex = room.enemy.push(Game.bossFactory(activeScene, bossType)) - 1;
	room.enemy[enemyIndex].index = enemyIndex;
	
	var randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	while (room.tiles[randomTile].type != Game.TileType.Floor) {
		randomTile = Game.getRandomInt(0, (room.width*room.height)-1);
	}
	var tileIndex = room.tiles[randomTile].row*room.tiles[randomTile].width + room.tiles[randomTile].col;
	room.enemy[enemyIndex].mesh.position = new BABYLON.Vector3(room.tiles[randomTile].mesh.position.x, 4, room.tiles[randomTile].mesh.position.z);
	
	// // create intersect action
	// room.enemy[enemyIndex].mesh.actionManager = new BABYLON.ActionManager(activeScene);
	// // detect collision between enemy and player's weapon for an attack
	// room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	// { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.weaponCollisionMesh}, function (data) {
		// if (activeScene.player.action == activeScene.player.actionType.Attack) {
			// room.enemy[enemyIndex].health--;
			// if (room.enemy[enemyIndex].health <=0) {
				// room.enemy[enemyIndex].isDead=true;
				// room.enemy[enemyIndex].mesh.enemyAnimations.die.start(activeScene,room.enemy[enemyIndex]);
				// Game.transportRing.enableIntersect();
			// }
			// else {
				// room.enemy[enemyIndex].mesh.enemyAnimations.takeDmg.start(activeScene,room.enemy[enemyIndex]);
			// }
		// }
	// }));
	
	// // Detect intersect between enemy and player's bodyMesh for an attack on player
	// room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	// { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: activeScene.player.mesh}, function (data) {
		// var test = data;
		// if (activeScene.player.action != activeScene.player.actionType.Attack) {
			// activeScene.player.health--;
			// $('#dmg').text('Health: ' + parseInt(activeScene.player.health));
			// //TO DO:this can be handled better if we use knockout.js
			// if (activeScene.player.health == 3 ) {
				// $('#healthBar-4').hide();
			// }
			// else if (activeScene.player.health == 2 ) {
				// $('#healthBar-3').hide();
			// }
			// else if (activeScene.player.health == 1 ) {
				// $('#healthBar-2').hide();
			// }
			// else if (activeScene.player.health <= 0 ) {
				// $('#healthBar-1').hide();
				// activeScene.player.mesh.playerAnimations.die.start(activeScene,activeScene.player);
			// }
			// activeScene.player.mesh.playerAnimations.takeDmg.start(activeScene,activeScene.player);
		// }
	// }));
	
	// room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	// { trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.weaponCollisionMesh }, function (evt) {

	// }));
	// room.enemy[enemyIndex].mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	// { trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: activeScene.player.mesh }, function (evt) {

	// }));

}

Game.animationsStoneBall = function(entityMesh) {
	var self = this;
	self.animating = 0;
	
	self.Idle = function(activeScene) {
		var create = function () {
			// Use imported skeleton
		}
		this.start = function (activeScene, entity) {
			// Only play animation if previous state was idle
			if (entity.action == entity.actionType.Idle) {
				// Make sure no other animations are running
				if (entity.mesh.animatable) {
					entity.mesh.animatable.stop();
				}
				entity.action = entity.actionType.Idle;
				// TO DO: Add idle animation
				//entity.mesh.animatable = activeScene.beginAnimation(self.Move.animation, 0, 40, true, 1.0);
			}
		}
		create(); // create animation
	};
	
	self.Die = function(activeScene, entityMesh) {
		var create = function () {
			//create animations for player
			self.Die.animation = new BABYLON.Animation("dieAnimation", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// create keys
			var keys = [];
			var startScaling = entityMesh.scaling;
			var endScaling = entityMesh.scaling;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
			});
			keys.push({
				frame: 10,
				value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			keys.push({
				frame: 20,
				value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
			});
			keys.push({
				frame: 30,
				value: endScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			//Add keys to the animation object
			self.Die.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Die.animation);
		}
		this.start = function (activeScene, entity, dieFunction) {
			self.animatable.stop();
			entity.action = entity.actionType.Die;
			self.animating = 1;
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.Die.animation);
			}
			else {
				entity.mesh.animations[0] = self.Die.animation;
				//entity.mesh.animatable.stop();
			}
			self.animatable = activeScene.beginAnimation(entity.mesh, 0, 30, false, 1.0, function () {
				entity.mesh.dispose();
				if (entity.mesh.actionManager) {
					entity.mesh.actionManager.actions = []; // remove actions
				} 
				// activeScene.activeRoom.enemy.splice(entity.index, 1);
				if (dieFunction != undefined) {
					dieFunction(); // execute Callback function
				}
			});
		}
		create(); // create animation
	};
	
	self.Move = function(activeScene, entityMesh) {
		var calculateKeys = function (animation) {
			var keys = [];
			// Animation keys
			var startRotation = entityMesh.rotation;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startRotation
			});
			keys.push({
				frame: 240,
				value: startRotation.subtract(new BABYLON.Vector3(0, 0, 4*Math.PI))
			});
			//Adding keys to the animation object
			animation.setKeys(keys);
		}
		var create = function () {
			//create animations for player
			self.Move.animation = new BABYLON.Animation("moveAnimation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Attack.animation);
		}
		this.start = function (activeScene, entity, dieFunction) {
			entity.action = entity.actionType.Move;
			self.animating = 1;
			calculateKeys(self.Move.animation);
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.Move.animation);
			}
			else {
				entity.mesh.animations[0] = self.Move.animation;
				//entity.mesh.animatable.stop();
			}
			self.animatable = activeScene.beginAnimation(entity.mesh, 0, 240, true, 1.0, function () {
				self.animating = 0;
			});
		}
		create(); // create animation
	};
	
	self.TakeDmg = function(activeScene) {
		var create = function () {
			//create animations for player
			self.TakeDmg.animation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 60, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);// Animation keys
			// create keys
			var keys = [];
			keys.push({
				frame: 0,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 20,
				value: new BABYLON.Color3(0,0,0)
			});
			keys.push({
				frame: 40,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 60,
				value: new BABYLON.Color3(0,0,0)
			});
			//Add keys to the animation object
			self.TakeDmg.animation.setKeys(keys);
			//create animations for player
			//self.TakeDmg.animationKnockback = new BABYLON.Animation("knockbackAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		}
		this.start = function (activeScene, entity) {
			self.animatable.stop();
			entity.action = entity.actionType.TakeDmg;
			self.animating = 1;
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.TakeDmg.animation);
			}
			else {
				entity.mesh.animations[0] = self.TakeDmg.animation;
			}
			self.animatable = activeScene.beginAnimation(entity.mesh, 0, 60, false, 1.0, function () {
				entity.action = entity.actionType.Move;
			});
		}
		create(); // create animation
	}
	
	self.init = function (activeScene) {
		this.die = new self.Die(activeScene, entityMesh);
		this.move = new self.Move(activeScene, entityMesh);
		this.idle = new self.Idle(activeScene);
		this.takeDmg = new self.TakeDmg(activeScene);
	}
}

Game.importedAnimations = function(entity) {
	var self = this;
	self.animating = 0;
	
	self.Move = function(activeScene, entity) {
		var create = function () {
			// find and set keys 0 - 100
			// entity.moveKeys = [];
			// entity.moveKeys.push(0);
			// entity.moveKeys.push(40);
		}
		this.start = function (activeScene, entity) {
			// Only play animation if previous state was idle
			if (entity.action == entity.actionType.Idle) {
				// Make sure no other animations are running
				if (entity.mesh.animatable) {
					entity.mesh.animatable.stop();
				}
				entity.action = entity.actionType.Move;
				entity.mesh.animatable = activeScene.beginAnimation(entity.skeletons, entity.moveKeys[0], entity.moveKeys[1], false, 1, function () {
					entity.action=entity.actionType.Idle;
					// entity.weaponMesh.rotation = new BABYLON.Vector3(Math.PI/6,entity.mesh.currentFacingAngle.y + Math.PI/2,Math.PI/8);
				});
			}
		}
		create(); // create animation
	};
	
	self.Idle = function(activeScene) {
		var create = function () {
			// Use imported skeleton
			self.Idle.animation = activeScene.player.skeletons;
		}
		this.start = function (activeScene, entity) {
			// Only play animation if previous state was idle
			if (entity.action == entity.actionType.Idle) {
				// Make sure no other animations are running
				if (entity.mesh.animatable) {
					entity.mesh.animatable.stop();
				}
				entity.action = entity.actionType.Idle;
				// TO DO: Add idle animation
				//entity.mesh.animatable = activeScene.beginAnimation(self.Move.animation, 0, 40, true, 1.0);
			}
		}
		create(); // create animation
	};
	
	self.Attack = function(activeScene) {
		var create = function () {
			// Use imported skeleton
			//self.Attack.animation = activeScene.player.skeletons;
		}
		this.start = function (activeScene, entity) {
			// Only play animation if previous state was idle
			if (entity.action != entity.actionType.Attack) {
				// Make sure no other animations are running
				if (entity.mesh.animatable) {
					entity.mesh.animatable.stop();
				}
				entity.action=entity.actionType.Attack;
				entity.mesh.animatable = activeScene.beginAnimation(entity.skeletons, entity.attackKeys[0], entity.attackKeys[1], false, 1*entity.weapon.speedModifier, function () {
					Game.detectEnemyHit(activeScene, entity);
					entity.action=entity.actionType.Idle;
				});
			}
		}
		create(); // create animation
	};
	
	self.TakeDmg = function(activeScene) {
		var create = function () {
			//create animations for player
			self.TakeDmg.animation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 60, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);// Animation keys
			// create keys
			var keys = [];
			keys.push({
				frame: 0,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 20,
				value: new BABYLON.Color3(0,0,0)
			});
			keys.push({
				frame: 40,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 60,
				value: new BABYLON.Color3(0,0,0)
			});
			//Add keys to the animation object
			self.TakeDmg.animation.setKeys(keys);
			//create animations for player
			//self.TakeDmg.animationKnockback = new BABYLON.Animation("knockbackAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		}
		this.start = function (activeScene, entity) {
			// Make sure no other animations are running
			if (entity.mesh.animatable) {
				entity.mesh.animatable.stop();
			}
			entity.action = entity.actionType.TakeDmg;
			self.animating = 1;
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.TakeDmg.animation);
			}
			else {
				entity.mesh.animations[0] = self.TakeDmg.animation;
			}
			entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 60, false, 1.0, function () {
				entity.action = entity.actionType.Move;
			});
		}
		create(); // create animation
	}
	
	self.Die = function(activeScene, entity) {
		var create = function () {
			//create animations for player
			self.Die.animation = new BABYLON.Animation("dieAnimation", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// create keys
			var keys = [];
			var startScaling = entity.mesh.scaling;
			var endScaling = entity.mesh.scaling;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
			});
			keys.push({
				frame: 10,
				value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			keys.push({
				frame: 20,
				value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
			});
			keys.push({
				frame: 30,
				value: endScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			//Add keys to the animation object
			self.Die.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Die.animation);
		}
		this.start = function (activeScene, entity, dieFunction) {
			// Make sure no other animations are running
			if (entity.mesh.animatable) {
				entity.mesh.animatable.stop();
			}
			entity.action = entity.actionType.Die;
			self.animating = 1;
			//Attach animation to player mesh
			if (entity.mesh.animations == undefined) {
				entity.mesh.animations.push(self.Die.animation);
			}
			else {
				entity.mesh.animations[0] = self.Die.animation;
				//entity.mesh.animatable.stop();
			}
			entity.mesh.animatable = activeScene.beginAnimation(entity.mesh, 0, 30, false, 1.0, function () {
				entity.mesh.dispose();
				if (entity.mesh.actionManager) {
					entity.mesh.actionManager.actions = []; // remove actions
				} 
				// activeScene.activeRoom.enemy.splice(entity.index, 1);
				if (dieFunction != undefined) {
					dieFunction(); // execute Callback function
				}
			});
		}
		create(); // create animation
	};
	
	self.init = function (activeScene) {
		this.idle = new self.Idle(activeScene, entity);
		this.move = new self.Move(activeScene, entity);
		this.attack = new self.Attack(activeScene);
		this.die = new self.Die(activeScene, entity);
		this.takeDmg = new self.TakeDmg(activeScene);
	}
}
