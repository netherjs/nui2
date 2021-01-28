export default class {

	static ModuleList = [ ];

	static async Init(Root) {
	/*//
	@dae 2021-01-2
	//*/

		let Loading = Object.keys(Root.ModuleList).length;

		return (new Promise(function(Next,Fail){
			console.log(`Library.Init: ${Loading} module(s) to load...`)

			for(let ModuleName in Root.ModuleList) {
				console.log(`Library.Init: Loading ${ModuleName} from ${Root.ModuleList[ModuleName]}`);

				import(Root.ModuleList[ModuleName])
				.then(function(Import){
					Root[ModuleName] = Import.default;

					if(Root[ModuleName] instanceof NUI.Library)
					Root[ModuleName].Init(Root[ModuleName]);

					if(--Loading === 0)
					Next();

					return;
				});
			}

			return;
		}));
	};

};
