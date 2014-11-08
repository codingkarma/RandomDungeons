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

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function () {
                
                //Render scene and any changes
                scene.render();
            });

            // Resize
            window.addEventListener("resize", function () {
                engine.resize();
            });

            
        }

};