/*// nether-onescript //
@date 2021-01-27 22:56:26
@files [
    "src\\\/\/src\/js\\nuijs"
]
//*/

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nuijs /////////////////////////////////////////////////////

let NUI = null;

import('./core/main.js')
.then(function(Import){
	NUI = Import.default;

	(NUI.Init(NUI))
	.then(function(){

		console.log("lets fukken goooooooo alredayyyyyyy");

		class App extends Game.Engine {
			constructor(Selector) {
				super(Selector);

				this.Scene = new Game.Scene(this.Engine);

				let Light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.Scene.Container);
				let Box = BABYLON.MeshBuilder.CreateBox("box", {}, this.Scene.Container);

				return;
			}
		}

		new App('#App');

		return;
	});

	return;
});

