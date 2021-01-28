import NUI from "../nui.js";

export default class {

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	static CenterInParent(child,parent) {
	/*//
	@argv jQuery ChildObject, jQuery ParentObject
	given these two objects, we will attempt to center the child object
	in the parent object. this means that we are dealing with dom stuff
	and that they are CSS'd to allow positioning properly.
	//*/

		var cxoff = child.outerWidth(true) / 2 ;
		var cyoff = child.outerHeight(true) / 2;
		var pxcen = 0;
		var pycen = 0;
		var pxoff = 0;
		var pyoff = 0;

		if(!parent) {
			// if we didn't specify, find what the object is packed
			// inside of.
			parent = child.parent();
		}

		if(parent === window || parent[0] === jQuery('body')[0]) {
			// if it turns out its the body or the viewport, lets
			// use the viewport for math instead.
			parent = jQuery(window);

			if(child.css('position') === 'absolute') {
				// if we are using the window, and the item wants
				// to be positioned aboslute, add an offset so that
				// no matter where scrolled, it shows up in the center
				// of the viewport (rather than, the center of the
				// entire length of the body which could be off the
				// viewport completely).

				pyoff = jQuery(document).scrollTop();
			}
		}

		if(parent !== window) {
			pxcen = parent.width() / 2;
			pycen = parent.height() / 2;
		} else {
			pxcen = jQuery(window).width() / 2;
			pycen = jQuery(window).height() / 2;
		}

		child.css({
			'left': ((pxcen - cxoff) + pxoff) + 'px',
			'top': ((pycen - cyoff) + pyoff) + 'px'
		});

		return;
	};

	static MergeProperties(Dom,Sub) {
	/*//
	@argv object Override, object Original
	will overwrite the original properties from the original object with
	the properties from the Override object. of course, if they dont exist
	in the Original they will be created too.
	//*/

		if(typeof Dom !== 'object')
		return;

		jQuery.each(Dom,function(Prop,Val){
			Sub[Prop] = Val;
			return;
		});

		return;
	};

	static CopyToClipboard(What) {
	/*//
	@date 2021-01-09
	copy the specified text to the clipboard. the source element will have its content
	modified for a few seconds to visually demonstrate something has happened. generally
	we are expecting things calling this to be buttons.
	//*/

		let that = this;
		let Textbox;
		let OgText;

		// create a textbox that contains the content we want and add it to the dom.
		// we couldn't display none it or else the selection would not work. we can
		// however set it to 0x0.

		jQuery(that).append(
			Textbox = jQuery('<textarea />')
			.css({'width':'0px','height':'0px','border':'0px;'})
			.val(What)
		);

		Textbox.select();
		document.execCommand('copy');
		Textbox.remove();

		// make the button we clicked react to the click visually.

		OgText = jQuery(that).text();
		jQuery(that).text('Copied!');
		setTimeout(function(){ jQuery(that).text(OgText); },1000);

		return false;
	};

	static CopyElementToClipboard(e) {
	/*//
	@date 2021-01-09
	copy an element's text to the clipboard. the element that triggered this should have
	an attribute called data-copy-element that contains a selector to identify where to
	pull text data from.
	//*/

		e.preventDefault();

		let ElementID = jQuery(this).attr('data-copy-element');
		let Value = jQuery.trim(
			jQuery(ElementID).text()
		);

		(Toaster.CopyToClipboard)
		.call(this,Value);

		return false;
	};

	static CopyValueToClipboard(e) {
	/*//
	@date 2021-01-09
	copy an element's value to the clipboard. the element that triggered this should have
	an attribute called data-copy-value that contains the content that you want copied.
	//*/

		e.preventDefault();

		let Value = jQuery.trim(
			jQuery(this).attr('data-copy-value')
		);

		(Toaster.CopyToClipboard)
		.call(this,Value);

		return false;
	};

	static FilterArrayUnique(Input) {
	/*//
	@date 2021-01-09
	//*/

		return Input.filter(function(Val,Key,Input){
			return Input.indexOf(Val) === Key;
		});
	};

	static FilterArrayStrip(Input,ToRemove) {
	/*//
	@date 2021-01-09
	//*/

		return Input.filter(function(Val,Key,Input){
			return Val !== ToRemove;
		});
	};

	static ClearSelections() {
	/*//
	@date 2021-01-08
	tries to disable any text selections that currently exist, as they tend
	to make moving things a bit laggy.
	//*/

		if(window.getSelection)
		(window.getSelection())
		.removeAllRanges();

		else if(document.selection)
		(document.selection)
		.empty();

		return;
	};

	static Log(Msg,Key) {
	/*//
	@date 2021-01-08
	//*/

		let Now = new Date;
		let NowDate = Now.toLocaleDateString();
		let NowTime = Now.toLocaleTimeString();

		if(typeof Key !== 'undefined')
		return console.log(`[${NowDate} ${NowTime}] [${Key}] ${Msg}`);

		return console.log(`[${NowDate} ${NowTime}] ${Msg}`);
	};

};
