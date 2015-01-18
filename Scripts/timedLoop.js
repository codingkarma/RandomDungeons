var timedLoop = function () {
	var logicLoopStart=0; // Initial Loop Time
	var logicLoopDeltaTime = 0; // Delta Time of loop
	var logicLoopTimeDiff = 0; // Difference between LoopTime and dT_Loop
	var logicLoopTIME = 100; // Desired loop time in milliseconds
	var logicLoopWait=4.20; // Wait time for setTimeout
	var logicLoopAverage=0; // Wait time for setTimeout
	var logicLoopId;
	
	this.start = function (logicFunction, functionData) {
		logicLoopStart = performance.now();
		logicLoopId = setTimeout(function () {
			//***LOGIC GOES HERE***//
			
			// Users function
			logicFunction(functionData);
			
			//***END LOGIC***//
			
			//*****NO LOGIC AFTER HERE******//
			//determine what the next wait time should be
			logicLoopDeltaTime = (performance.now() - logicLoopStart) - logicLoopTimeDiff; // Get approx. loop time
			logicLoopTimeDiff = logicLoopTIME - logicLoopDeltaTime; //Get different between Max LoopTime and Real Time dT_Loop
			
			if ( logicLoopTimeDiff > 0)  {
				logicLoopWait = logicLoopTimeDiff;
				logicLoopTimeDiff = 0;
			}
			else if (logicLoopTimeDiff > -1000) {
				logicLoopWait = 4.20;
				logicLoopTimeDiff+=4.20;
			}
			else {
				//something went wrong. reset vars
				logicLoopWait = 4.20;
				logicLoopTimeDiff = 0;
			}
			//**********END******************//
			// lastly call logic loop recursively
			timedLoop.start(logicFunction(functionData), functionData);
		},logicLoopWait);
	}
}