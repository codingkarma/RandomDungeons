(function(window, undefined){
	
	'use strict';
	
	//define globally if it doesn't already exist
    if(typeof(TimedLoop) === undefined){
		var TimedLoop = (function() {
			
			function _timedLoop(name) {
				
				// public variables
				this.loopId = 0;
				this.name = name;
				
				// private variables - not really, but shhh don't tell anyone
				this._logicFunctions = new Array();
				this._loopTIME = 50; // Desired loop time in milliseconds
				this._loopWait = 50; // Wait time for setTimeout
				this._loopAverage = 0; // Wait time for setTimeout
				this._waitDifference = 0;
				this._nowTime = 0;
				this.previousTime;
				this.actualWait = 0; // time elapsed until setTimeout actual calls function, this takes into account that other functions and actions are happening
				this.loopStart = 0; // Initial Loop Time
				//var loopDeltaTime = 0; // Delta Time of loop
				//var loopTimeDiff = 0; // Difference between LoopTime and dT_Loop
			}
			
			// Object.defineProperty(_timedLoop.prototype, "loopId", {
				// get: function () {
					// return this.loopId;
				// },
				// set: function(value) {
					// this.loopId = value;
				// },
				// enumerable: true,
				// configurable: true
			// });
			
			_timedLoop.prototype.setLoopTime = function (desiredLoopTime) {
				// Browser does not allow lower than 4ms delay, check for that condition
				if (desiredLoopTime >= 4) {
					this._loopTIME=desiredLoopTime;
					this._loopWait=desiredLoopTime;
				}
				return null;
			}
			
			_timedLoop.prototype.registerFunction = function(newFunction, newData, priority) {
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
				
				this._logicFunctions.push(NewFunction);
				
				return null;
			}
			
			_timedLoop.prototype.start = function () {
				
				this.loopStart = performance.now();
				this.loopId = setTimeout(function (self) {
					
					self.actualWait = performance.now() - self.loopStart;
					// Apply first order filter to reduce spikes in average
					// Note: self._waitDifference is accumulative 
					self._waitDifference = self._waitDifference*.6 + .4*(self.actualWait - self._loopWait);
					//don't let self._waitDifference grow larger than the self._loopWait
					if (Math.abs( self._waitDifference) > self._loopWait*3) {
						 self._waitDifference = 0; // reset it
					}
					
					//***LOGIC GOES HERE***//
					for (var iLoop = 0; iLoop < self._logicFunctions.length; iLoop++) {
						self._logicFunctions[iLoop].pointer(self._logicFunctions[iLoop].data);
					}
					//***END LOGIC***//
					
					//*****NO LOGIC AFTER HERE******//
					// Get total elapsed time in between calls and get average
					self.previousTime = self._nowTime;
					self._nowTime = performance.now();
					// Apply first order filter to reduce spikes in average
					self._loopAverage = self._loopAverage*.8 + .2*(self._nowTime - self.previousTime);
					
					//determine what the next wait time should be
					self._loopWait = self._loopTIME -  self._waitDifference;
					//**********END******************//
					_timedLoop.prototype.start(); // lastly call logic loop recursively
				},this._loopWait, this);
				return null;
			}
			
			_timedLoop.prototype.stop = function() {
				clearTimeout(this.loopId);
				return null;
			}
			
			_timedLoop.prototype.getLoopTime = function () {
				return this._loopAverage; // in ms
			}
			
			return _timedLoop;
		})();
		
		// expose constructor
		window.TimedLoop = TimedLoop;
    }
    else{
        console.log("TimedLoop is already defined.");
    }
})(window);