import NUI from "../nui.js";
import Window from "../element/window.js";

export default class extends Window {
/*//
@date 2021-01-13
a version of the window class pretuned to work better for modal
dialog windows to ask simple questions.
//*/

	constructor(Opt) {

		let OptExtend = {
			'Footer': false,
			'Resizable': false
		};

		NUI.Util.MergeProperties(Opt,OptExtend);
		super(OptExtend);

		this.Container
		.on(
			'click',
			'.NUI-Action-Accept',
			(function(){
				this.CallEventHandlers('Accept');
				return false;
			}).bind(this)
		)
		.on(
			'click',
			'.NUI-Action-Cancel',
			(function(){
				this.CallEventHandlers('Cancel');
				return false;
			}).bind(this)
		)

		return;
	}

};
