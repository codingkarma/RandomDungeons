function dungeonComplete() {
	//stop logic Loop
	// Game.scene[Game.activeScene].timedLogicLoop.stop();
	timedLoop.stop();
	$('#modalDiv').html(' \
		<div class=\"modalText">You have completed the dungeon!</div><br /> \
		<div class=\"modalButton\" id=\"newDungeon\">New Dungeon</div><br /> \
		<div class=\"modalButton\" id=\"mainMenu\">Main Menu</div>'	);
	$('#modal').fadeIn(200, function () {
		Game.engine.stopRenderLoop();
	});
	$('#topMenu').fadeOut(200, function () {});
	$('#hotKeys').fadeOut(200, function () {});
	if (Game.debug) {
		$('#debugMenu').fadeOut(200, function () {	});
	}
	
	// create New Dungeon click function
	$('#newDungeon').click(function () 
		{$('#modal').fadeOut(50, function () {
			$('#modalDiv').html('');
			Game.activeScene=Game.sceneType.Game;
			
			Game.engine.scenes[Game.engine.scenes.length-1].dispose();
			Game.engine.scenes.splice(Game.engine.scenes.length-1, 1);
			//Game.scene[Game.scene.length-1].dispose();
			Game.scene.splice(Game.scene.length-1, 1);
			Game.map = {};
			
			Game.mapSize = Game.getRandomIntFromArray([2,3,5]);
			Game.map = Game.GenerateMap(Game.mapSize,Game.mapSize);
			Game.initGameScene();
			Game.runRenderLoop();
			$('#topMenu').fadeIn(200, function () {});
			$('#hotKeys').fadeIn(200, function () {});
			if (Game.debug) {
				$('#debugMenu').fadeIn(200, function () {	});
			}
		});
	});
	
	$('#mainMenu').click(function () {
		Game.activeScene = Game.sceneType.Start;
		$('#modalDiv').html(' \
			<div class=\"modalButton\" id=\"startGame\">Start Game</div><br /> \
			<div class=\"modalButton\" id=\"about\">About</div> \
		');
		
		Game.runRenderLoop();
		Game.engine.scenes[Game.engine.scenes.length-1].dispose();
		Game.engine.scenes.splice(Game.engine.scenes.length-1, 1);
		//Game.scene[Game.scene.length-1].dispose();
		Game.scene.splice(Game.scene.length-1, 1);
		Game.map = {};
		
		Game.mapSize = Game.getRandomIntFromArray([2,3,5]);
		Game.map = Game.GenerateMap(Game.mapSize,Game.mapSize);
		Game.initGameScene();
		
		$('#startGame').click(function () {
			$('#modal').fadeOut(50, function () {
				$('#modalDiv').html('');
				Game.activeScene=Game.sceneType.Game;
				Game.runRenderLoop();
				$('#topMenu').fadeIn(200, function () {	});
				$('#hotKeys').fadeIn(200, function () {	});
				if (Game.debug) {
					$('#debugMenu').fadeIn(200, function () {	});
				}
			});
		});
	});
}

function prepareHealthBars() {
	$('#hpDiv').html('HP: ');
	for (var i=1;i<=Game.scene[1].player.health;i++) {
		$('#hpDiv').append('<div class=\"healthBar\" id=\"healthBar-' + parseInt(i) + '\"></div>');
	}
}