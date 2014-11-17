function startMapEditor() {  

        var canvas = document.getElementById("renderCanvas");

        // Check support
        if (!BABYLON.Engine.isSupported()) {
            window.alert('Browser not supported');
        } else {
            // Babylon
            var engine = new BABYLON.Engine(canvas, true);

            //Creating scene (in "scene_tuto.js")
            scene = MapEditor(engine);

            scene.activeCamera.attachControl(canvas);
			
			var animationIter = -.0075;
			var loopCounter = 0;
			var firstTime=1;
            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function () {
				// rotate to give some animation
				if(scene.isReady() && scene.Sword) {
					if (Attack == 1) {
						if (firstTime == 1) {
							// scene.Sword.rotation = new BABYLON.Vector3(Math.PI/1.5, 0, Math.PI/2.2);
							scene.Sword.rotation = new BABYLON.Vector3(0, Math.PI/1.2, Math.PI/2);
							firstTime=0;
							loopCounter=0;
							animationIter = .08;
						}
						else {
							scene.Sword.rotation.y=scene.Sword.rotation.y-1.8*animationIter;
							// scene.Sword.rotation.x=scene.Sword.rotation.x-2*animationIter;
							// scene.Sword.rotation.z=scene.Sword.rotation.z-2*animationIter;
							
							if (loopCounter > 12) {
								loopCounter=0;
								Attack=0;
								firstTime=1;
								animationIter = -.0075;
								scene.Sword.rotation = new BABYLON.Vector3(Math.PI/6, Math.PI/2, Math.PI/4);
							}
							else {
								loopCounter++;
							}
						}
						
					}
					else {
						// scene.Sword.rotation.y=scene.Sword.rotation.y+1.25*animationIter;
						// scene.Sword.rotation.x=scene.Sword.rotation.x+.8*animationIter;
						// scene.Sword.rotation.z=scene.Sword.rotation.z+animationIter;
						
						// scene.Blob.position.y=scene.Blob.position.y+2*animationIter;
						
						if (loopCounter > 50) {
							loopCounter=0;
							animationIter=animationIter*-1;
						}
						else {
							loopCounter++;
						}
					}
					if (loopCounter % 10 == 0) {
						$('#fps').text('FPS: ' + BABYLON.Tools.GetFps().toFixed());
					}
					var vX=0; var vZ=0;
					if (isWKey >0) {
						vZ=1;
					}
					if (isSKey >0) {
						vZ=-1;
					}
					if (isAKey >0) {
						vX=-1;
					}
					if (isDKey >0) {
						vX=1;
					}
					var velocity=new BABYLON.Vector3(vX, -10, vZ);
					scene.Sword.moveWithCollisions(velocity);
				}
				
                //Render scene and any changes
                scene.render();
            });

            // Resize
            window.addEventListener("resize", function () {
                engine.resize();
            });

            
        }

};