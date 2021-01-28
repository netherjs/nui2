import NUI from "../nui/nui.js";
import Dialog from "../nui/element/dialog.js";
import Button from "../nui/element/button.js";
import Vec2 from "../nui/util/vec2.js";

export default class extends Dialog {

	constructor() {
		super({
			'Modal': true,
			'Title': 'Hello',
			'Content': 'Loading...',
			'Icon': 'fas fa-bomb',
			'Buttons': [
				new Button({ 'Text':'Yah', 'Class': 'NUI-Action-Accept' }),
				new Button({ 'Text':'Nah', 'Class': 'NUI-Action-Cancel' })
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
				}).bind(this),250);
				return;
			}
		)
		.Register(
			'Accept', 'AppOnAccept',
			function(){ this.QuitHappy(); return; }
		)
		.Register(
			'Cancel', 'AppOnCancel',
			function(){ this.QuitSad(); return; }
		)

		return;
	}

	SpawnActionSticker(FaClass) {
	/*//
	@date 2021-01-28
	//*/

		let Pos = NUI.Mouse.GetPos();
		let Jitter = new Vec2(
			(Math.floor(Math.random() * 100) - 50),
			(Math.floor(Math.random() * 100) - 50)
		);

		let Sticker = (
			jQuery('<i />')
			.addClass(`fa-fw ${FaClass}`)
			.css({
				'color':'var(--NUI-Element-Window-Box-Colour)',
				'text-shadow': '0px 0px 30px var(--NUI-Element-Window-Text-Colour)',
				'position':'absolute',
				'left':`${(Pos.X - 32) + Jitter.X}px`,
				'top':`${(Pos.Y - 32) + Jitter.Y}px`,
				'z-index': (parseInt(this.Container.css('z-index')) + 42),
				'font-size': '64px',
				'transform': 'translate3d(0px,0px,1px)'
			})
		);

		(this.Container)
		.parent()
		.append(Sticker);

		Sticker.fadeOut('slow',function(){
			Sticker.remove();
			Sticker = null;
			return;
		});


		return Sticker;
	}

	QuitForReal() {
	/*//
	@date 2021-01-28
	//*/

		this.Close();
		return this;
	}

	QuitHappy() {
	/*//
	@date 2021-01-28
	//*/

		let Offset = 0;
		let Cranker = 50;

		this.QuitForReal();

		for(Offset = 10; Offset < 1500; Offset += Cranker) {
			Cranker += 25;

			setTimeout(
				(function(){
					this.SpawnActionSticker('far fa-laugh-squint');
				}).bind(this),
				Offset
			);
		}

		return this;
	}

	QuitSad() {
	/*//
	@date 2021-01-28
	//*/

		let Offset = 0;
		let Cranker = 50;

		this.QuitForReal();

		for(Offset = 10; Offset < 1500; Offset += Cranker) {
			Cranker += 25;

			setTimeout(
				(function(){
					this.SpawnActionSticker('far fa-sad-tear');
				}).bind(this),
				Offset
			);
		}

		return this;
	}

};