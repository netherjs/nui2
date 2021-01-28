import Desktop from "./nui/element/desktop.js";
import DemoWindowAbout from "./demo/window-about.js";
import DemoWindowBombed from "./demo/window-bombed.js";

(document)
.addEventListener('DOMContentLoaded',function(Ev){

	let Desk = new Desktop;

	Desk.MountWindow((new DemoWindowAbout),{Pinned:true,Show:false});
	Desk.MountWindow((new DemoWindowBombed),{Pinned:true,Show:true});

	return;
});