//TO DO: Need to do this a better way
var isWKey = 0;
var isAKey = 0;
var isSKey = 0;
var isDKey = 0;

$(document).ready(function () {

    
    $(document).keydown(function (e) {
        if (e.keyCode == 87) {
            isWKey=1;
        }
		else if (e.keyCode == 65) {
            isAKey=1;
        }
		else  if (e.keyCode == 83) {
            isSKey=1;
        }
		else  if (e.keyCode == 68) {
            isDKey=1;
        }
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 87) {
            isWKey=0;
        }
		else if (e.keyCode == 65) {
            isAKey=0;
        }
		else  if (e.keyCode == 83) {
            isSKey=0;
        }
		else  if (e.keyCode == 68) {
            isDKey=0;
        }
    });

	startMapEditor();
});