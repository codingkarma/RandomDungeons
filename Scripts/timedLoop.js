timedLoop = function(logicFunction, desiredLoopTime, functionData) {
	var self = this;
	var loopStart = 0; // Initial Loop Time
	var loopDeltaTime = 0; // Delta Time of loop
	var loopTimeDiff = 0; // Difference between LoopTime and dT_Loop
	var loopTIME = 100; // Desired loop time in milliseconds
	var loopWait = 100; // Wait time for setTimeout
	var loopAverage = 0; // Wait time for setTimeout
	var actualWait = 0; // time elapsed until setTimeout actual calls function, this takes into account that other functions and actions are happening
	var waitDifference = 0;
	self.loopId;
	
	var previousTime = 0;
	var nowTime = 0;
	
	if (desiredLoopTime && desiredLoopTime >= 4) {
		loopTIME=desiredLoopTime;
		loopWait=desiredLoopTime;
	}
	
	self.start = function () {
		loopStart = performance.now();
		self.loopId = setTimeout(function () {
			actualWait = performance.now() - loopStart;
			waitDifference = waitDifference*.6 + .4*(actualWait - loopWait);
			//don't let waitDifference grow larger than the loopWait
			if (Math.abs(waitDifference) > loopWait*3) {
				waitDifference = 0; // reset it
			}
			
			//***LOGIC GOES HERE***//
			logicFunction(functionData); // Users function
			//***END LOGIC***//
			
			//*****NO LOGIC AFTER HERE******//
			// Get total elapsed time in between calls and get average
			previousTime = nowTime;
			nowTime = performance.now();
			loopAverage = loopAverage*.8 + .2*(nowTime - previousTime);
			
			//determine what the next wait time should be
			//loopDeltaTime = (performance.now() - loopStart); //- loopTimeDiff; // Get approx. loop time
			loopWait = loopTIME - waitDifference;
			//**********END******************//
			self.start(); // lastly call logic loop recursively
		},loopWait);
	}
	
	self.stop = function() {
		clearTimeout(self.loopId);
	}
	self.getLoopTime = function () {
		return loopAverage; // in ms
	}
}

//originally used to modify the wait time if the loop is running slow
//**start***NEED TO INVESTIGATE THIS***//
// loopTimeDiff = loopTIME; // - loopDeltaTime; //Get different between Max LoopTime and Real Time dT_Loop

// if ( loopTimeDiff > 4)  {
	// loopWait = loopTimeDiff - waitDifference;
	// loopTimeDiff = 0;
// }
// else if (loopTimeDiff > -1000) {
	// loopWait = 4.20;
	// loopTimeDiff-=4.20;
// }
// else {
	// //something went wrong. reset vars
	// loopWait = 4.20;
	// loopTimeDiff = 0;
// }
//**end**********************************//