import NUI from "../nui/nui.js";
import Dialog from "../nui/element/dialog.js";
import Button from "../nui/element/button.js";

export default class extends Dialog {

	constructor() {
		super({
			'Modal': true,
			'Title': 'About NUI2',
			'Icon': 'fas fa-laugh-squint',
			'Content': (`
				<div class="text-center">Nether UI (NUI) v${NUI.Version}</div>
			`),
			'ButtonPacking': 'End',
			'Buttons': [
				new Button({ 'Text':'Nice', 'Class': 'NUI-Action-Accept' })
			]
		});

		(this)
		.Register(
			'Accept', 'AppOnAccept',
			function(){ this.Quit(); return; }
		)

		return;
	}

};