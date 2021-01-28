export default class {

	static Version = '0.0.1';

	static ModuleList = {
		'Library': './library.js',
		'Util': './util.js',
		'Element': './element.js'
	};

	static async Init(Root) {
	/*//
	@dae 2021-01-2
	//*/

		let Loading = Object.keys(Root.ModuleList).length;

		return (new Promise(function(Next,Fail){
			console.log(`Main.Init: ${Loading} module(s) to load...`)

			for(let ModuleName in Root.ModuleList) {
				console.log(`Main.Init: Loading ${ModuleName} from ${Root.ModuleList[ModuleName]}`);

				import(Root.ModuleList[ModuleName])
				.then(function(Import){
					Root[ModuleName] = Import.default;

					if(Root[ModuleName] instanceof Root.Library)
					Root[ModuleName].Init(Root);

					if(--Loading === 0)
					Next();

					return;
				});
			}

			return;
		}));
	};

};
