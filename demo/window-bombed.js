import Dialog from "../nui/element/dialog.js";
import Button from "../nui/element/button.js";

export default class extends Dialog {

	constructor() {
		super({
			'Title': 'Hello',
			'Content': 'Loading...',
			'Icon': 'fas fa-bomb',
			'Resizable': false,
			'Footer': false,
			'Buttons': [
				new Button({ 'Text':'Yah', 'Class': 'NUI-Action-Accept' }),
				new Button({ 'Text':'Nah', 'Class': 'NUI-Action-Accept' })
			],
			'Content': (
				'<span class="Rand1">Loading...</span>'+
				'<span class="Rand2"></span>'+
				'<span class="Rand3"></span>'
			)
		});

		(this)
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
			'Accept', 'AppOnAccept',
			function(){ this.Quit(); return; }
		)

		return;
	}

};