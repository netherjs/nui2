/*// nether-onescript //
@date 2021-01-10 00:40:09
@files [
    "src\\\/\/src\/js\\nui-00-mainjs",
    "src\\\/\/src\/js\\nui-10-elementjs",
    "src\\\/\/src\/js\\nui-10-mousejs",
    "src\\\/\/src\/js\\nui-10-utiljs",
    "src\\\/\/src\/js\\nui-15-element-basejs",
    "src\\\/\/src\/js\\nui-20-element-desktopjs",
    "src\\\/\/src\/js\\nui-20-element-overlayjs",
    "src\\\/\/src\/js\\nui-20-element-terminaljs",
    "src\\\/\/src\/js\\nui-20-element-windowjs"
]
//*/

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-00-mainjs /////////////////////////////////////////////

NUI = new class {

};

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-10-elementjs //////////////////////////////////////////

NUI.Element = new class {

};

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-10-mousejs ////////////////////////////////////////////

NUI.Move = new class {

	Queue = [];
	LastX = 0;
	LastY = 0;

	constructor() {

		let OnMouseMove;

		OnMouseMove = function(Ev){
			let DeltaX = this.LastX - Ev.clientX;
			let DeltaY = this.LastY - Ev.clientY;

			if(this.Queue.length)
			jQuery.each(this.Queue,function(Key,Obj){
				Obj.offset(function(Idx,Pos){
					Obj.attr('nui-moved','true');
					return {
						left: (Pos.left - DeltaX),
						top: (Pos.top - DeltaY)
					};
				});
			});

			this.LastX = Ev.clientX;
			this.LastY = Ev.clientY;
			//console.log([this.LastX,this.LastY]);

			return;
		};

		jQuery(document)
		.ready((function(){
			jQuery(document)
			.on('mousemove',OnMouseMove.bind(this));
		}).bind(this));

		return;
	}

	Register(Obj){
	/*//
	@argv jQuery Object
	add something to the list of things that wants to be moved around
	so that it can be processed later.
	//*/

		var Found = false;

		jQuery.each(this.Queue,function(Key,Value){
			if(Value === Obj) {
				Found = true;
				return false;
			}
			return true;
		});

		if(!Found) {
			jQuery('body').addClass('NUI-NoSelect');
			this.Queue.push(Obj);
		}

		return;
	}

	Unregister(Obj){
	/*//
	@argv jQuery Object
	remove something from the list of things that wants to be moved
	around so that it stops moving around.
	//*/

		var that = this;

		jQuery.each(this.Queue,function(Key,Value){
			if(Value === Obj) {
				that.Queue.splice(Key,1);
			}
			return;
		});

		if(!that.Queue.length)
		jQuery('body').removeClass('NUI-NoSelect');

		return;
	}

};

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-10-utiljs /////////////////////////////////////////////

NUI.Util = new class {

	ConfigStruct = class {
		Count(Key) { return Object.keys(this[Key]).length; }
		Push(Opt) { NUI.Util.MergeProperties(Opt,this); return this; }
	};

	Vec2 = class {
		X = 0;
		Y = 0;

		constructor(X,Y) { this.X = X; this.Y = Y; return; }
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	CenterInParent(child,parent) {
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

	MergeProperties(Dom,Sub) {
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

	CopyToClipboard(What) {
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

	CopyElementToClipboard(e) {
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

	CopyValueToClipboard(e) {
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

	FilterArrayUnique(Input) {
	/*//
	@date 2021-01-09
	//*/

		return Input.filter(function(Val,Key,Input){
			return Input.indexOf(Val) === Key;
		});
	};

	FilterArrayStrip(Input,ToRemove) {
	/*//
	@date 2021-01-09
	//*/

		return Input.filter(function(Val,Key,Input){
			return Val !== ToRemove;
		});
	};

	ClearSelections() {
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

	Log(Msg,Key) {
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

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-15-element-basejs /////////////////////////////////////

NUI.Element.Base = class {

	ObjectType = null;
	ID = null;

	Events = null;
	Config = null;

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	constructor(Opt) {
	/*//
	@date 2021-01-07
	//*/

		return;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	Register(EventName,KeyName,Callable) {
	/*//
	@date 2021-01-07
	//*/

		if(typeof this.Events[EventName] === 'undefined') {
			if(this.Config.Debug)
			this.Log(`Register: Unknown Event ${EventName}`);

			return this;
		}

		this.Events[EventName][KeyName] = Callable;
		return this;
	};

	Unregister(EventName,KeyName) {
	/*//
	@date 2021-01-09
	//*/

		if(typeof this.Events[EventName] === 'undefined') {
			if(this.Config.Debug)
			this.Log(`Register: Unknown Event ${EventName}`);

			return this;
		}

		if(typeof this.Events[EventName][KeyName] !== 'undefined')
		delete this.Events[EventName][KeyName];

		return this;
	}

	CallEventHandlers(EventName) {
	/*//
	@date 2021-01-08
	//*/

		// make sure we have this event tpe.

		if(typeof this.Events[EventName] === 'undefined') {
			if(this.Config.Debug)
			this.Log(`CallEventHandlers: Unknown Event ${EventName}`);

			return;
		}

		// announce the event

		if(this.Config.Debug)
		this.Log(`Event(${EventName}) [${this.Events.Count(EventName)} Registered]`)

		// run the handlers.

		for(let Callable in this.Events[EventName]) {
			if(this.Config.Debug)
			this.Log(`Event(${EventName}, ${Callable})`);

			this.Events[EventName][Callable].call(this);
		}

		return;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	Log(Msg) {
	/*//
	@date 2021-01-08
	//*/

		return NUI.Util.Log(Msg,this.ObjectType);
	};

	DebugRegisterEvents() {
	/*//
	@date 2021-01-08
	//*/

		return;
	};

};

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-20-element-desktopjs //////////////////////////////////

NUI.Element.Desktop = class extends NUI.Element.Base {
/*//
@date 2021-01-08
//*/

	ObjectType = 'NUI-Element-Desktop';

	Config = new class extends NUI.Util.ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Content = '';
		Debug = true;
	};

	Events = new class extends NUI.Util.ConfigStruct {
		Ready = {};
	};

	AppTray = null;
	TrayItems = new Array;

	constructor(Opt) {
	/*//
	@date 2021-01-08
	//*/

		super(Opt);
		this.Config.Push(Opt);

		if(this.Config.Debug)
		this.DebugRegisterEvents();

		this.ConstructUI();
		this.CallEventHandlers('Ready');
		return;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	ConstructUI() {
	/*//
	@date 2021-01-08
	//*/

		this.Container = (
			jQuery('<div />')
			.addClass('NUI-Element-Desktop')
			.append(
				this.AppTray = jQuery('<div />')
				.addClass('AppTray')
				.addClass('d-none')
			)
		);

		jQuery(this.Config.Container)
		.append(this.Container);

		return;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	MountWindow(NUIW,DontShow) {
	/*//
	@date 2021-01-09
	//*/

		// register the application with the tray.

		this._MountWindow_AppTrayIcon(NUIW);

		// put this window into our dom.

		this.Container
		.append(NUIW.Container);

		// center it.

		NUI.Util.CenterInParent(NUIW.Container);

		// make sure it is being seen.

		if(!DontShow) {
			NUIW.Show();
			NUI.Util.CenterInParent(NUIW.Container);
		}

		return;
	}

	_MountWindow_AppTrayIcon(NUIW) {
	/*//
	@date 2021-01-09
	//*/

		let Item = {
			'Window': NUIW,
			'Icon': 'far fa-window',
			'Pinned': false,
			'Element': (
				jQuery('<div />')
				.addClass('Item')
			)
		};

		// configurlate how to restore the window when the tray
		// icon is clicked.

		(Item.Element)
		.on('click',(function(Item){
			// minimized windows call minimize again
			// to restore themselves from this state.
			Item.Window.Minimize();
			return;
		}).bind(this,Item));

		// handle font awesome tray icons.

		if(Item.Icon.match(/^fa/))
		Item.Element.append(
			jQuery('<i />')
			.addClass(`fa-fw ${Item.Icon} text-size-largerer`)
		);

		// and push our completed widget into the tray.

		//if(!NUIW.Container.hasClass('Hidden'))
		Item.Element.addClass('d-none');

		(this.AppTray)
		.append(Item.Element);

		// watch for when the window has requested a dwm action
		// to be performed with it.

		(Item.Window)
		.Register(
			'Minimize', 'Desktop',
			(function(Item){
				this.AppTray.removeClass('d-none');
				Item.Element.removeClass('d-none');
				Item.Window.Hide();
				Item.Window.Register(
					'Restore', 'Desktop',
					(function(Item){
						Item.Element.addClass('d-none');
						Item.Window.Unregister('Restore','Desktop');
						Item.Window.Show();

						if(this.TrayItems.length === 0)
						this.AppTray.addClass('d-none');

						return;
					})
					.bind(this,Item)
				);

				return;
			}).bind(this,Item)
		)
		.Register(
			'Quit', 'Desktop',
			(function(Item){
				//if(Item.Pinned) return;

				Item.Element.remove();
				delete this.TrayItems[Item.Window.ID];

				return;
			}).bind(this,Item)
		);

		this.TrayItems[NUIW.ID] = Item;
		return;
	}


	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	DebugRegisterEvents() {
	/*//
	@date 2021-01-08
	//*/

		this.Register(
			'Ready', 'Debug',
			function(){ /* the logging from this executing is fine. */ }
		);

		return;
	};


}

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-20-element-overlayjs //////////////////////////////////

NUI.Element.Overlay = class extends NUI.Element.Base {
/*//
@date 2021-01-08
//*/

	ObjectType = 'NUI-Element-Overlay';

	Config = new class extends NUI.Util.ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Content = '';
		Debug = true;
	};

	Events = new class extends NUI.Util.ConfigStruct {
		Ready = {};
	};

	constructor(Opt) {
	/*//
	@date 2021-01-08
	//*/

		super(Opt);
		this.Config.Push(Opt);

		if(this.Config.Debug)
		this.DebugRegisterEvents();

		this.ConstructUI();
		this.CallEventHandlers('Ready');
		return;
	};

	ConstructUI() {
	/*//
	@date 2021-01-08
	//*/

		this.Container = (
			jQuery('<div />')
			.addClass('NUI-Element-Overlay')
		);

		jQuery(this.Config.Container)
		.append(this.Container);

		return;
	};

	DebugRegisterEvents() {
	/*//
	@date 2021-01-08
	//*/

		this.Register(
			'Ready', 'Debug',
			function(){ }
		);

		return;
	};


}

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-20-element-terminaljs /////////////////////////////////

NUI.Element.Terminal = class extends NUI.Element.Base {

	Config = new class extends NUI.Util.ConfigStruct {
		Container = 'body';
	};

	Events = new class extends NUI.Util.ConfigStruct {

	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	constructor(Opt) {
	/*//
	@date 2021-01-06
	//*/

		super(Opt);
		this.Config.Push(Opt);

		this.ConstructUI();

		jQuery(document)
		.on('keydown',(function(Ev){ return this.OnKeyDown(Ev); }).bind(this));

		this.ResizeObserver = new ResizeObserver((function(Entries){
			this.OnResizeWindow();
			return;
		}).bind(this));

		this.ResizeObserver.observe(jQuery(this.Config.Container)[0]);
		this.ResizeObserver.observe(jQuery('body')[0]);
		this.OnResizeWindow();

		this.Container
		.on('click',(function(){ this.Keyboard[0].focus(); }).bind(this));

		return;
	};

	ConstructUI() {
	/*//
	@date 2021-01-07
	//*/

		this.History = (
			jQuery('<div />')
			.addClass('History')
		);

		this.Prompt = (
			jQuery('<span />')
			.addClass('Prompt')
			.append('<i class="fas fa-fw fa-dollar-sign"></i>')
		);

		this.Command = (
			jQuery('<span />')
			.addClass('Command')
		);

		this.Caret = (
			jQuery('<span />')
			.addClass('Caret')
			.text('|')
		);

		this.Keyboard = (
			jQuery('<input />')
			.addClass('Keyboard')
		);

		this.Container = (
			jQuery('<div />')
			.addClass('d-flex flex-column h-100')
			.addClass('Terminal')
			.append(
				jQuery('<div />')
				.addClass('flex-grow-1')
				.addClass('PaneTop')
				.append(
					jQuery('<div />')
					.addClass('d-flex flex-column justify-content-end mh-100')
					.append(this.History)
				)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0')
				.addClass('PaneBottom')
				.append(
					jQuery('<div />')
					.addClass('Input')
					.append(this.Prompt)
					.append(this.Command)
					.append(this.Caret)
					.append(this.Keyboard)
				)
			)
		);

		jQuery(this.Config.Container)
		.append(this.Container);

		return;
	};

	OnResizeWindow() {
	/*//
	@date 2021-01-07
	//*/

		let W = this.Container.parent().width();
		let H = this.Container.parent().height();

		(this.Container)
		.css({ 'max-height':`${H}px`, 'height':`${H}px` });

		//void(jQuery(this.Config.Container)[0].offsetLeft);

		return;
	};

	OnKeyDown(jEvent) {
	/*//
	@date 2021-01-06
	//*/

		let Ev = jEvent.originalEvent;
		let Result = false;

		// for now ignore key spam from holding down too long.

		switch(Ev.which) {
			case 8: Result = this.OnKeyDown_Backspace(Ev); break;
			case 13: Result = this.OnKeyDown_Enter(Ev); break;

			case 116: // f5
			case 123: // f12
				Result = this.OnKeyDown_Null(Ev);
			break;

			default:
				Result = this.OnKeyDown_Text(Ev);
			break;
		}

		return Result;
	};

	OnKeyDown_F5(Ev) {
	/*//
	@date 2021-01-06
	//*/

		location.reload(true);
		return false;
	};

	OnKeyDown_Null(Ev) {
	/*//
	@date 2021-01-07
	//*/

		return null;
	};

	OnKeyDown_Backspace(Ev) {
	/*//
	@date 2021-01-06
	//*/

		this.Command.find('kbd:last-of-type').remove();
		return false;
	};

	OnKeyDown_Enter(Ev) {
	/*//
	@date 2021-01-06
	//*/

		let Command = jQuery.trim(this.Command.text());
		let Entry = jQuery('<div />');

		(this.Command)
		.empty();

		if(Command.length === 0)
		return false;

		(this.History)
		.append(Entry)
		.removeClass('d-none');

		Entry
		.append(`<i class="fas fa-fw fa-caret-right"></i> ${Command}`)
		[0].scrollIntoView();

		this.HandleCommand(Command);
		return false;
	};

	OnKeyDown_Text(Ev) {
	/*//
	@date 2021-01-06
	//*/

		if(Ev.key.length === 1)
		(this.Command)
		.append(`<kbd>${Ev.key}</kbd>`);

		else
		console.log('Key: ' + Ev.key + ' ' + Ev.which);

		return false;
	};

	HandleCommand(Command) {
	/*//
	@date 2021-01-06
	//*/

		let BaseCommand = Command.split(" ",1)[0];
		let Colour;

		NUI.Util.Log(`Command: "${Command}"`);
		NUI.Util.Log(`BaseCommand: "${BaseCommand}"`);

		if(BaseCommand === 'colour') {
			Colour = Command.replace(/^colour /,'');
			NUI.Util.Log(`Colour: ${Colour}`);

			(document.documentElement.style)
			.setProperty('--NUI-Element-Window-Colour1',Colour);

			(document.documentElement.style)
			.setProperty('--NUI-Element-Window-Colour1a',(Colour + '33'));

			(document.documentElement.style)
			.setProperty('--NUI-Element-Window-Colour1b',(Colour + '99'));
		}


		return;
	}

}

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-20-element-windowjs ///////////////////////////////////

NUI.Element.Window = class extends NUI.Element.Base {
/*//
@date 2021-01-07
//*/

	ObjectType = 'NUI-Element-Window';

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	// local configuration values.

	Config = new class extends NUI.Util.ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Title = 'NUI.Element.Window';
		Content = '';
		Position = null;
		Header = true;
		Footer = true;
		Debug = true;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	// local events registry.

	Events = new class extends NUI.Util.ConfigStruct {
		Ready = {};
		Load = {};
		ShowPre = {};
		Show = {};
		HidePre = {};
		Hide = {};
		MoveStart = {};
		MoveStop = {};
		ResizeStart = {};
		ResizeStop = {};
		Maximize = {};
		Minimize = {};
		Restore = {};
		ClosePre = {};
		Close = {};
		QuitPre = {};
		Quit = {};
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	// pointers to html elements.

	Container = null;
	Header = null;
	HeaderBtnClose = null;
	HeaderBtnMax = null;
	HeaderBtnMin = null;
	HeaderBtnShade = null;
	Content = null;
	Footer = null;
	FooterGripResize = null;
	FooterStatus = null;

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	constructor(Opt) {
	/*//
	@date 2021-01-07
	//*/

		super(Opt);
		this.Config.Push(Opt);

		if(this.Config.Debug)
		this.DebugRegisterEvents();

		this.ID = this.Config.ID;
		this.ConstructUI();
		this.CallEventHandlers('Ready');
		return;
	};

	ConstructUI() {
	/*//
	@date 2021-01-07
	//*/

		this.Header = this.ConstructUI_Header();
		this.Content = this.ConstructUI_Content();
		this.Footer = this.ConstructUI_Footer();

		this.Container = (
			jQuery('<div />')
			.addClass('NUI-Element-Window Hidden')
			.append(this.Header)
			.append(this.Content)
			.append(this.Footer)
		);

		if(this.Config.Position === 'center') {
			this.Register(
				'Show', 'AutoCenter',
				(function(){ NUI.Util.CenterInParent(this.Container); return; }).bind(this)
			);
			this.Register(
				'Show', 'AutoCenter',
				(function(){ NUI.Util.CenterInParent(this.Container); return; }).bind(this)
			);

			jQuery(window)
			.on('resize',(function(){ NUI.Util.CenterInParent(this.Container); return; }).bind(this));
		}

		else if(this.Config.Position instanceof NUI.Util.Vec2) {
			this.Container.css({
				'left': `${this.Config.Position.X}px`,
				'top': `${this.Config.Position.Y}px`
			});
		}

		if(this.Config.Container !== null)
		jQuery(this.Config.Container)
		.append(this.Container);

		return;
	};

	ConstructUI_Header() {
	/*//
	@date 2021-01-07
	//*/

		let Element = (
			jQuery('<header />')
			.addClass((this.Config.Header)?('d-flex'):('d-none'))
			.append(
				jQuery('<div />')
				.addClass('flex-grow-1')
				.text(this.Config.Title)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0 no-wrap')
				.append(
					this.HeaderBtnMin = jQuery('<div />')
					.addClass('Close')
					.append('<i class="far fa-fw fa-window-minimize"></i>')
				)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0 no-wrap')
				.append(
					this.HeaderBtnMax = jQuery('<div />')
					.addClass('Close')
					.append('<i class="far fa-fw fa-window-maximize"></i>')
				)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0 no-wrap')
				.append(
					this.HeaderBtnClose = jQuery('<div />')
					.addClass('Close')
					.append('<i class="far fa-fw fa-window-close"></i>')
				)
			)
		);

		(Element)
		.on('mousedown',(function(){ this.SetMoveMode(true); return; }).bind(this));

		(this.HeaderBtnClose)
		.on('mousedown',function(){ return false; })
		.on('click',(function(){ this.Close(); return; }).bind(this));

		(this.HeaderBtnMax)
		.on('mousedown',function(){ return false; })
		.on('click',(function(){ this.Maximize(); return; }).bind(this));

		(this.HeaderBtnMin)
		.on('mousedown',function(){ return false; })
		.on('click',(function(){ this.Minimize(); return; }).bind(this));

		return Element;
	};

	ConstructUI_Content() {
	/*//
	@date 2021-01-07
	//*/

		let that = this;

		let Element = (
			jQuery('<section />')
			.append(this.Config.Content)
		);

		return Element;
	};

	ConstructUI_Footer() {
	/*//
	@date 2021-01-07
	//*/

		let Element = (
			jQuery('<footer />')
			.addClass((this.Config.Footer)?('d-flex'):('d-none'))
			.append(
				this.FooterStatus = jQuery('<div />')
				.addClass('flex-grow-1')
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0')
				.append(
					this.FooterGripResize = (
						jQuery('<div />')
						.addClass('GripResize')
						.append('<i class="far fa-fw fa-border-style"></i>')
					)
				)
			)
		);

		this.FooterGripResize
		.on('mousedown',this.SetResizeMode.bind(this,true));

		return Element;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	GetTitle(WantHTML) {
	/*//
	@date 2021-01-08
	//*/

		let Output = (
			WantHTML?
			this.Header.html():
			this.Header.text()
		);

		return Output;
	};

	SetTitle(Text) {
	/*//
	@date 2021-01-08
	//*/

		(this.Header)
		.html(Text);

		return this;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	SetMoveMode(Mode) {
	/*//
	@date 2021-01-07
	//*/

		let EvName = `mouseup.${this.ObjectType}-${this.ID}-Move`;

		if(Mode && this.Container.hasClass('Maximized'))
		return;

		if(Mode) {
			NUI.Util.ClearSelections();

			this.Container
			.addClass('MoveMode');

			jQuery(document)
			.on(EvName,(function(){
				this.SetMoveMode(false);
				return;
			}).bind(this));

			NUI.Move.Register(this.Container);
			this.CallEventHandlers('MoveStart');
		}

		else {
			this.Container
			.removeClass('MoveMode');

			jQuery(document)
			.off(EvName);

			NUI.Move.Unregister(this.Container);
			this.CallEventHandlers('MoveStop');
		}

		return this;
	};

	SetResizeMode(Mode) {
	/*//
	@date 2021-01-08
	//*/

		let EvName = `mousemove.${this.ObjectType}-${this.ID}-Resize`;
		let EvKill = `mouseup.${this.ObjectType}-${this.ID}-Resize`;
		let Pos = this.Container.offset();
		let OffsetX = (Pos.left + this.Container.width()) - NUI.Move.LastX;
		let OffsetY = (Pos.top + this.Container.height()) - NUI.Move.LastY;

		if(Mode) {
			NUI.Util.ClearSelections();

			this.Container
			.addClass('ResizeMode');

			jQuery(document)
			.on(EvName,(function(OffsetX,OffsetY){
				let Pos = this.Container.offset();

				this.Container
				.width(Math.round((NUI.Move.LastX - Pos.left) + OffsetX));

				this.Container
				.height(Math.round((NUI.Move.LastY - Pos.top) + OffsetY));

			}).bind(this,OffsetX,OffsetY))
			.on(EvKill,(function(){
				this.SetResizeMode(false);
				return;
			}).bind(this));

			this.CallEventHandlers('ResizeStart');
		}

		else {
			this.Container
			.removeClass('ResizeMode');

			jQuery(document)
			.off(EvName)
			.off(EvKill);

			this.CallEventHandlers('ResizeStop');
		}

		return this;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	Close() {
	/*//
	@date 2021-01-09
	//*/

		this.CallEventHandlers('QuitPre');
		this.Hide();
		this.CallEventHandlers('Quit');

		return this;
	};

	Maximize() {
	/*//
	@date 2021-01-09
	//*/

		NUI.Util.ClearSelections();

		if(!this.Container.hasClass('Maximized')) {
			(this.Container)
			.addClass('Maximized');

			this.CallEventHandlers('Maximize');
		}

		else {
			(this.Container)
			.removeClass('Maximized');

			this.CallEventHandlers('Restore');
		}

		return this;
	};

	Minimize() {
	/*//
	@date 2021-01-09
	//*/

		NUI.Util.ClearSelections();

		if(!this.Container.hasClass('Minimized')) {
			(this.Container)
			.addClass('Minimized');

			this.CallEventHandlers('Minimize');
		}

		else {
			(this.Container)
			.removeClass('Minimized');

			this.CallEventHandlers('Restore');
		}

		return this;
	};

	Show() {
	/*//
	@date 2021-01-07
	//*/

		if(!this.Container.hasClass('Loaded')) {
			this.CallEventHandlers('Load');
			this.Container.addClass('Loaded');
		}

		////////

		this.CallEventHandlers('ShowPre');
		this.Container.removeClass('Hidden');
		this.ReflowSize();
		this.CallEventHandlers('Show');

		return this;
	};

	Hide() {
	/*//
	@date 2021-01-08
	//*/

		this.CallEventHandlers('HidePre');
		this.Container.addClass('Hidden');
		this.CallEventHandlers('Hide');

		return this;
	};

	ReflowSize(W,H) {
	/*//
	@date 2021-01-08
	//*/

		this.Container
		.width(this.Container.width());

		this.Container
		.height(this.Container.height());

		return;
	}

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	DebugRegisterEvents() {
	/*//
	@date 2021-01-08
	//*/

		this.Register(
			'Ready', 'Debug',
			function(){ /* the logging from this executing is fine. */ }
		);

		this.Register(
			'MoveStart', 'Debug',
			(function(){
				let Pos = this.Container.position();
				this.Log(`+ Move (${Pos.left},${Pos.top})`);
				return;
			}).bind(this)
		);

		this.Register(
			'MoveStop', 'Debug',
			(function(){
				let Pos = this.Container.position();
				this.Log(`- Move (${Pos.left},${Pos.top})`);
				return;
			}).bind(this)
		);

		this.Register(
			'ResizeStart', 'Debug',
			(function(){
				let Pos = this.Container.position();
				this.Log(`+ Resize (${this.Container.width()}x${this.Container.height()})`);
				return;
			}).bind(this)
		);

		this.Register(
			'ResizeStop', 'Debug',
			(function(){
				this.Log(`- Resize (${this.Container.width()}x${this.Container.height()})`);
				return;
			}).bind(this)
		);

		return;
	};

}

