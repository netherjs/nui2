import Util from "../core/util.js";
import Window from "../element/window.js";

export default class extends Window {
/*//
@date 2021-01-13
a version of the window class pretuned to work better for modal
dialog windows to ask simple questions. the close button will
emit the NUI-Action-Cancel event rather than actually close the
window. to make the most use you would want to pack it with buttons
that have an NUI-Action class on them.

* NUI-Action-Accept
  when the user has decided to accept whatever the dialog is
  trying to get them to accept.

* NUI-Action-Cancel
  when the user does not accept whatever the dialog is trying
  to get them to accept.

//*/

	constructor(Opt) {

		let OptExtend = {
			'Footer': false,
			'Resizable': false
		};

		Util.MergeProperties(Opt,OptExtend);
		super(OptExtend);

		(this.Container)
		.on(
			'click', '.NUI-Action-Accept',
			(function(){
				this.CallEventHandlers('Accept');
				return false;
			}).bind(this)
		)
		.on(
			'click', '.NUI-Action-Cancel',
			(function(){
				this.CallEventHandlers('Cancel');
				return false;
			}).bind(this)
		);

		// make the close btn emit cancel instead of
		// its default quit behaviour.

		(this.HeaderBtnClose)
		.off('click')
		.addClass('NUI-Action-Cancel');

		return;
	}

};
