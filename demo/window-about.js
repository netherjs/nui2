import NUI from "../nui/nui.js";
import Dialog from "../nui/element/dialog.js";
import Button from "../nui/element/button.js";

export default class extends Dialog {

	constructor() {
		super({
			'Modal': true,
			'Title': 'About NUI2',
			'Icon': 'fas fa-asterisk',
			'Class': 'Padded',
			'Content': (`
				<h4 class="font-weight-bold mb-2">Nether UI (NUI) v${NUI.Version}</h4>
				<div class="mb-4"><a href="https://github.com/netherjs/nui2" target="_blank"><i class="fa-fw fab fa-github"></i> Github</a></div>
				<div>NUI is a Javascript UI toolkit written by someone who hates Javascript.</div>
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
		.Register(
			'Cancel', 'AppOnCancel',
			function(){ this.Quit(); return; }
		)

		return;
	}

};