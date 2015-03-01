(function(window){
	
	'use strict';
	
    function _timedLoop(){
        var timedLoop = {};
		
		// private variables
		var logicFunctions = [];
		var loopStart = 0; // Initial Loop Time
		var loopDeltaTime = 0; // Delta Time of loop
		var loopTimeDiff = 0; // Difference between LoopTime and dT_Loop
		var loopTIME = 50; // Desired loop time in milliseconds
		var loopWait = 50; // Wait time for setTimeout
		var loopAverage = 0; // Wait time for setTimeout
		var actualWait = 0; // time elapsed until setTimeout actual calls function, this takes into account that other functions and actions are happening
		var waitDifference = 0;
		var previousTime = 0;
		var nowTime = 0;
		
		// exposed variables
		timedLoop.loopId = 0;
		
		timedLoop.setLoopTime = function (desiredLoopTime) {
			// Browser does not allow lower than 4ms delay, check for that condition
			if (desiredLoopTime >= 4) {
				loopTIME=desiredLoopTime;
				loopWait=desiredLoopTime;
			}
		}
		
		timedLoop.registerFunction = function(newFunction, newData, priority) {
			var NewFunction = {};
			
			NewFunction.pointer = newFunction;
			if (newData == undefined) {
				NewFunction.data = {};
			}
			else {
				NewFunction.data = newData;
			}
			if (priority == undefined) {
				NewFunction.priority = 1;
			}
			else {
				NewFunction.data = priority;
			}
			
			logicFunctions.push(NewFunction);
		}
		
		timedLoop.start = function () {
			loopStart = performance.now();
			timedLoop.loopId = setTimeout(function () {
				actualWait = performance.now() - loopStart;
				// Apply first order filter to reduce spikes in average
				// Note: waitDifference is accumulative 
				waitDifference = waitDifference*.6 + .4*(actualWait - loopWait);
				//don't let waitDifference grow larger than the loopWait
				if (Math.abs(waitDifference) > loopWait*3) {
					waitDifference = 0; // reset it
				}
				
				//***LOGIC GOES HERE***//
				for (var iLoop = 0; iLoop < logicFunctions.length; iLoop++) {
					logicFunctions[iLoop].pointer(logicFunctions[iLoop].data);
				}
				//***END LOGIC***//
				
				//*****NO LOGIC AFTER HERE******//
				// Get total elapsed time in between calls and get average
				previousTime = nowTime;
				nowTime = performance.now();
				// Apply first order filter to reduce spikes in average
				loopAverage = loopAverage*.8 + .2*(nowTime - previousTime);
				
				//determine what the next wait time should be
				loopWait = loopTIME - waitDifference;
				//**********END******************//
				timedLoop.start(); // lastly call logic loop recursively
			},loopWait);
		}
		
		timedLoop.stop = function() {
			clearTimeout(timedLoop.loopId);
		}
		
		timedLoop.getLoopTime = function () {
			return loopAverage; // in ms
		}
        return timedLoop;
    }
	//define globally if it doesn't already exist
    if(typeof(timedLoop) === 'undefined'){
        window.timedLoop = _timedLoop();
    }
    else{
        console.log("timedLoop is already defined.");
    }
})(window);