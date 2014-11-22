
var map;

$(document).ready(function () {


	$('#startGame').click(function () {
		$('.container').html("<canvas class=\"renderCanvas\" id=\"renderCanvas\"></canvas>");
		$('#modal').fadeOut(50, function () {
			$('#modalDiv').html('');
			scene.dispose();
			startGame(1);
		});
		
	});
	
	map = GenerateMap(5,5);
	startGame(0);
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