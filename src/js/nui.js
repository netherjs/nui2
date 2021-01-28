let NUI;

import('./core/main.js')
.then(function(Import){
	NUI = Import.default;

	(NUI.Init(NUI))
	.then(function(){
		console.log(`NUI v${NUI.Version}`);
		document.dispatchEvent(new Event('NUI.Ready'));
		return;
	});

	return NUI;
});
