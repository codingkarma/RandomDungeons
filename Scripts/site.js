
var onStartScreen=1;
var Game = new function () {
	this.debug = false;
	this.map = {};
	this.canvas = document.getElementById("renderCanvas");
	this.engine = new BABYLON.Engine(this.canvas, true);
	//this.engine.renderEvenInBackground = false;
	this.engine.loopCounter = 0;
	this.scene = [];
	this.sceneType = {
		Start: 0,
		Game: 1
	};
	this.activeScene = this.sceneType.Start;
}

$(document).ready(function () {

	// Check support
	if (!BABYLON.Engine.isSupported()) {
		window.alert('Browser not supported');
		//TO DO: Display a different screen
	} 
	else {
		Game.map = Game.GenerateMap(5,5);
		Game.initScenes();
		Game.runRenderLoop();
		
		$('#startGame').click(function () {
			$('#modal').fadeOut(50, function () {
					$('#modalDiv').html('');
					Game.activeScene=Game.sceneType.Game;
					Game.runRenderLoop();
				});
			$('#topMenu').fadeIn(200, function () {	});
			$('#hotKeys').fadeIn(200, function () {	});
		});
	};
});

//function for modal pop-up
function modal(Html,okFunction,data) {

    $('#modalDiv').html(Html);

    //Fade in Div and foreground overlay
    $('#modal').fadeIn(100, function () {
        $('#modalButtons').html(templateHelper.alertBoxDefault());
        $('#modalCancel').click(function () {
            // Close alert Box
            $('#modal').fadeOut(50, function () {
                $('#modalDiv').html('');
            });
        });
        $('#modalConfirm').click(function () {
            var closeModal;
            if (okFunction != undefined) {
                closeModal = okFunction(data); // execute Callback function
                //Allows function to return a value to defer closing modal
                if (closeModal == undefined) {
                    closeModal = 1;
                }
            }
            // Close alert Box
            if (closeModal == 1) {
                $('#modal').fadeOut(50, function () {
                    $('#modalDiv').html('');
                });
            }
        });
    });
}