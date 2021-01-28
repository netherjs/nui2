import Desktop from "./nui/element/desktop.js";
import Window from "./nui/element/window.js";
import Dialog from "./nui/element/dialog.js";
import Button from "./nui/element/button.js";

(document)
.addEventListener('DOMContentLoaded',function(Ev){

	let Desk = new Desktop;

	let Demo1 = (
		new Window({
			'Title': 'Demo1',
			'Container': null,
			'Icon': 'fas fa-bomb',
			'Resizable': false,
			'Footer': false,
			'Buttons': [
				new Button({ 'Text':'Yah' }),
				new Button({ 'Text':'Nah' })
			],
			'Content': (
				'<span class="Rand1">Loading...</span>'+
				'<span class="Rand2"></span>'+
				'<span class="Rand3"></span>'
			)
		})
		.Register(
			'Load', 'Test',
			function(){
				let GetBinaryShit = function(){ return (
					parseInt(Math.random() * Number.MAX_SAFE_INTEGER)
					.toString(2)
					.replace(/(\d)/g,'$1 ')
				); };

				this.Timer = setInterval((function(){
					this.SetTitle(GetBinaryShit());

					for(let Iter=1; Iter<=3; Iter++)
					this.Content
					.find(`span.Rand${Iter}`)
					.text(GetBinaryShit());

					return;
				}).bind(this),150);
				return;
			}
		)
		.Register(
			'QuitPre', 'Test',
			function(){
				if(this.Timer)
				clearInterval(this.Timer);

				this.Timer = null;
				return;
			}
		)
	);

	let Demo2 = (
		new Dialog({
			'Modal': true,
			'Title': 'Do you?',
			'Container': null,
			'Icon': 'fas fa-question-circle',
			'Content': 'Well?',
			'Buttons': [
				new Button({ 'Text':'Probably', 'Class': 'NUI-Action-Accept' })
			]
		})
		.Register(
			'Accept', 'AppOnAccept',
			function(){ this.Close(); return; }
		)
	);

	Desk.MountWindow(Demo1,{Pinned:true});
	Desk.MountWindow(Demo2,{Pinned:true,Show:false});
	return;
});