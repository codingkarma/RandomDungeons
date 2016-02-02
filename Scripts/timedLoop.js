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
				var beforeFunctionCall = performance.now();
				actualWait = beforeFunctionCall - loopStart;
				// get difference between actual wait and expected wait,
				// this is on a per loop basis
				waitDifference = (actualWait - loopWait);
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
				var funcCallTime = nowTime - beforeFunctionCall;
				var timeDiff = nowTime - previousTime;
				// Apply first order filter to smooth out average
				if (timeDiff < 200) {
					loopAverage = loopAverage*.9 + .1*(timeDiff);
				}
				
				//determine what the next wait time should be
				loopWait = loopTIME - funcCallTime - waitDifference;
				if (loopWait < 2) {
					loopWait = 2; // don't let loop time lower than 1 ms
				}
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