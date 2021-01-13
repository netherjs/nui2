/*// nether-onescript //
@date 2021-01-13 21:17:32
@files [
    "src\\\/\/src\/js\\nui-00-mainjs",
    "src\\\/\/src\/js\\nui-10-elementjs",
    "src\\\/\/src\/js\\nui-10-mousejs",
    "src\\\/\/src\/js\\nui-10-utiljs",
    "src\\\/\/src\/js\\nui-15-element-basejs",
    "src\\\/\/src\/js\\nui-20-element-buttonjs",
    "src\\\/\/src\/js\\nui-20-element-desktopjs",
    "src\\\/\/src\/js\\nui-20-element-overlayjs",
    "src\\\/\/src\/js\\nui-20-element-terminaljs",
    "src\\\/\/src\/js\\nui-20-element-windowjs",
    "src\\\/\/src\/js\\nui-30-element-window-dialogjs"
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

		if(typeof this.Events[EventName] === 'undefined')
		this.Events[EventName] = {};

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
// src\//src/js\nui-20-element-buttonjs ///////////////////////////////////

NUI.Element.Button = class extends NUI.Element.Base {
/*//
@date 2021-01-12
//*/

	Config = new class extends NUI.Util.ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Text = '';
		Class = '';
		OnClick = '';
		OnDoubleClick = '';
	};

	Events = new class extends NUI.Util.ConfigStruct {
		Ready = {};
	};

	constructor(Opt) {
	/*//
	@date 2021-01-12
	//*/

		super(Opt);
		this.Config.Push(Opt);

		if(this.Config.Debug)
		this.DebugRegisterEvents();

		this.ID = this.Config.ID;
		this.ConstructUI();
		this.CallEventHandlers('Ready');

		return;
	}

	ConstructUI() {

		this.Container = (
			jQuery('<button />')
			.addClass('NUI-Element-Button')
			.addClass(this.Config.Class)
			.html(this.Config.Text)
		);

		if(this.Config.OnClick)
		this.Container.on('click',this.Config.OnClick.bind(this));

		if(this.Config.OnDoubleClick)
		this.Container.on('dblclick',this.Config.OnDoubleClick.bind(this));

		return;
	}

}

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

	TrayItems = new Array;
	ZIndex = 9001;

	AppTray = null;
	Minimized = null;

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
				.addClass('AppTray Left Animate')
				.addClass('d-nonee')
				.append(
					this.Minimized = (
						jQuery('<div />')
						.addClass('d-none')
						.addClass('Subtray')
					)
				)
			)
		);

		jQuery(this.Config.Container)
		.append(this.Container);

		return;
	};

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	MountWindow(NUIW,Opt) {
	/*//
	@date 2021-01-09
	//*/

		let Config = {
			'Show': true,
			'Pinned': false,
			'Icon': 'fa-window',
			'Position': null
		};

		NUI.Util.MergeProperties(Opt,Config);

		// put this window into our dom.

		this.Container.append(NUIW.Container);

		// register the application with the tray.

		this._MountWindow_AppTrayIcon(NUIW,Config);
		this._MountWindow_Position(NUIW,Config);
		this._MountWindow_Show(NUIW,Config);

		return;
	}

	_MountWindow_AppTrayIcon(NUIW,Config) {
	/*//
	@date 2021-01-09
	//*/

		let Item = {
			'ID': NUIW.ID,
			'Window': NUIW,
			'Icon': NUIW.GetIcon(),
			'Pinned': Config.Pinned,
			'Element': (
				jQuery('<div />')
				.addClass('Item')
				.addClass('d-none')
			)
		};

		// configurlate how to restore the window when the tray
		// icon is clicked.

		(Item.Element)
		.on(
			'click',
			(function(Item){

				// this state is actually launching the app for the first
				// time, more or less.
				if(Item.Window.Container.hasClass('Hidden')) {
					if(!Item.Window.Container.hasClass('Minimized')) {
						Item.Window.Show();
						return;
					}
				}

				Item.Window.Minimize();
				return;
			}).bind(this,Item)
		)
		.tooltip({
			'container': Item.Element,
			'delay': { 'hide':0, 'show':100 },
			'placement': (function(Dest,Source,Item){
				return 'right';
			}).bind(this,Item),
			'title': Item.Window.GetTitle()
		});

		// handle font awesome tray icons. it expects you to send them
		// as like just the font name like 'fa-wrench' and or with the
		// font class first, 'far fa-wrench'

		if(Item.Icon.match(/^fa/)) {
			if(Item.Icon.match(/^fa-/))
			Item.Icon = `far ${Item.Icon}`;

			Item.Element.append(
				jQuery('<i />')
				.addClass(`fa-fw ${Item.Icon}`)
			);
		}

		// and push our completed widget into the tray.

		this.Minimized
		.removeClass('d-none')
		.append(Item.Element);

		if((Item.Window.Container.hasClass('Hidden') && !Config.Show) || Config.Pinned) {
			this.AppTray.removeClass('d-none');
			Item.Element.removeClass('d-none');
		}

		// watch for when the window has requested a dwm action
		// to be performed with it.

		(Item.Window)
		.Register(
			'Minimize', 'Desktop',
			(function(Item){
				this.AppTray.removeClass('d-none');
				Item.Element.removeClass('d-none');

				if(!Item.Pinned)
				this.Minimized.removeClass('d-none');

				Item.Window.Hide();
				return;
			}).bind(this,Item)
		)
		.Register(
			'Restore', 'Desktop',
			(function(Item){

				if(this.AppTray.find('.Item:not(.d-none)').length === 0)
				this.AppTray.addClass('d-none');

				if(!Item.Pinned) {
					Item.Element.addClass('d-none');

					if(this.Minimized.find('.Item:not(.d-none)').length === 0)
					this.Minimized.addClass('d-none');
				}

				Item.Window.Show();
				return;
			}).bind(this,Item)
		)
		.Register(
			'Quit', 'Desktop',
			(function(Item){

				if(!Item.Pinned) {
					Item.Element.remove();
					//delete this.TrayItems[Item.Window.ID];
				}

				return;
			}).bind(this,Item)
		)
		.Register(
			'Show','Desktop',
			(function(Item){

				if(Item.Window.Container.css('z-index') < this.ZIndex)
				Item.Window.Container.css('z-index',this.ZIndex++);

				return;
			}).bind(this,Item)
		)
		.Register(
			'Click','Desktop',
			(function(Item){

				if(Item.Window.Container.css('z-index') < this.ZIndex)
				Item.Window.Container.css('z-index',this.ZIndex++);

				return;
			}).bind(this,Item)
		);

		return;
	}

	_MountWindow_Position(NUIW,Config) {
	/*//
	@date 2021-01-12
	//*/

		if(Config.Position === 'center')
		NUI.Util.CenterInParent(NUIW.Container);

		if(Config.Position instanceof NUI.Util.Vec2)
		NUIW.Container.css({ 'left':`${Config.Position.X}`, 'left':`${Config.Position.Y}` });

		return;
	}

	_MountWindow_Show(NUIW,Config) {
	/*//
	@date 2021-01-12
	//*/

		// show the window is told. after showing, if the window was
		// suppose to be centered, just make sure it is.

		if(Config.Show) {
			NUIW.Show();

			if(Config.Position === 'center')
			NUI.Util.CenterInParent(NUIW.Container);

			return;
		}

		// we did not tell desktop to auto show this window. if it
		// is currently hidden then automatically send it to the
		// minimize tray.

		if(NUIW.Container.hasClass('Hidden'))
		NUIW.Minimize();

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
		Class = '';
		Container = 'body';
		Title = 'NUI.Element.Window';
		Content = '';
		Buttons = null;
		ButtonPacking = 'Fill';
		Icon = 'far fa-window';
		Position = 'center';
		Modal = false;
		QuitOnClose = true;
		Header = true;
		Footer = true;
		Movable = true;
		Resizable = true;
		Debug = true;

		// trying to only use the free icons by default.
		IconWindowClose = 'far fa-window-close';
		IconWindowMaximize = 'far fa-window-maximize';
		IconWindowMinimize = 'far fa-window-minimize';
		IconWindowResize = 'fas fa-border-style';
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
		Click = {};
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
	HeaderTitle = null;
	HeaderBtnClose = null;
	HeaderBtnMax = null;
	HeaderBtnMin = null;
	HeaderBtnShade = null;
	HeaderIcon = null;
	Content = null;
	Buttons = null;
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
		this.Buttons = this.ConstructUI_Buttons();
		this.Footer = this.ConstructUI_Footer();

		this.Container = (
			jQuery('<div />')
			.addClass('NUI-Element-Window Hidden Animate')
			.addClass(this.Config.Class)
			.append(this.Header)
			.append(this.Content)
			.append(this.Buttons)
			.append(this.Footer)
			.on('mousedown',(function(){ this.OnClick(); return false; }).bind(this))
		);

		// handle initial positioning.

		if(this.Config.Position === 'center') {
			let When = this.Modal ? 'Show' : 'Load';

			this.Register(
				When, 'AutoCenter',
				(function(){ NUI.Util.CenterInParent(this.Container); return; }).bind(this)
			);

			if(this.Modal)
			jQuery(window)
			.on('resize',(function(){ NUI.Util.CenterInParent(this.Container); return; }).bind(this));
		}

		else if(this.Config.Position instanceof NUI.Util.Vec2) {
			this.Container.css({
				'left': `${this.Config.Position.X}px`,
				'top': `${this.Config.Position.Y}px`
			});
		}

		// handle window flags.

		if(this.Config.Movable)
		this.Container.addClass('Movable');

		if(this.Config.Resizable)
		this.Container.addClass('Resizable');

		// handle adding it to the container that was specified.

		if(this.Config.Container !== null)
		jQuery(this.Config.Container)
		.append(this.Container);

		// handle content actions

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
				this.HeaderIcon = jQuery('<div />')
				.addClass('Icon')
			)
			.append(
				this.HeaderTitle = jQuery('<div />')
				.addClass('Title')
				.text(this.Config.Title)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0 no-wrap')
				.append(
					this.HeaderBtnMin = jQuery('<div />')
					.addClass('HeaderBtn Close')
					.append(`<i class="fa-fw ${this.Config.IconWindowMinimize}"></i>`)
				)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0 no-wrap')
				.append(
					this.HeaderBtnMax = jQuery('<div />')
					.addClass('HeaderBtn Close')
					.append(`<i class="fa-fw ${this.Config.IconWindowMaximize}"></i>`)
				)
			)
			.append(
				jQuery('<div />')
				.addClass('flex-grow-0 no-wrap')
				.append(
					this.HeaderBtnClose = jQuery('<div />')
					.addClass('HeaderBtn Close')
					.append(`<i class="fa-fw ${this.Config.IconWindowClose}"></i>`)
				)
			)
		);

		if(this.Config.Movable)
		(Element)
		.on('mousedown',(function(){ this.SetMoveMode(true); return; }).bind(this));

		if(this.Config.Modal) {
			this.HeaderBtnMin.addClass('d-none');
			this.HeaderBtnMax.addClass('d-none');
		}

		(this.HeaderBtnClose)
		.on('mousedown',function(){ return false; })
		.on('click',(function(){ (this.Config.QuitOnClose?this.Quit():this.Close()); return; }).bind(this));

		(this.HeaderBtnMax)
		.on('mousedown',function(){ return false; })
		.on('click',(function(){ this.Maximize(); return; }).bind(this));

		(this.HeaderBtnMin)
		.on('mousedown',function(){ return false; })
		.on('click',(function(){ this.Minimize(); return; }).bind(this));

		this.SetIcon(this.Config.Icon);
		return Element;
	};

	ConstructUI_Content() {
	/*//
	@date 2021-01-07
	//*/

		let that = this;

		let Element = (
			jQuery('<section />')
		);

		return Element;
	};

	ConstructUI_Buttons() {
	/*//
	@date 2021-01-12
	//*/

		let Element = (
			jQuery('<nav />')
			.addClass(this.Config.ButtonPacking)
		);

		jQuery(this.Config.Buttons)
		.each(function(){

			Element
			.append(this.Container)

			return;
		});

		if(Element.find('button').length === 0)
		Element.addClass('d-none');

		return Element;
	}

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

		if(!this.Config.Resizable)
		this.FooterGripResize.addClass('d-none');

		this.SetStatus(null);
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

		(this.HeaderTitle)
		.html(Text);

		return this;
	};

	GetIcon() {
	/*//
	@date 2021-01-11
	//*/

		return this.Config.Icon;
	};

	SetIcon(Icon) {
	/*//
	@date 2021-01-11
	//*/

		if(Icon.match(/^fa/)) {
			if(Icon.match(/^fa-/))
			Icon = `far ${Icon}`;

			this.HeaderIcon
			.empty()
			.append(
				jQuery('<i />')
				.addClass(`fa-fw ${Icon}`)
			);
		}

		return this;
	}

	SetStatus(Text) {
	/*//
	@date 2021-01-12
	//*/

		if(!Text || !jQuery.trim(Text))
		Text = '&nbsp;'

		this.FooterStatus
		.html(Text);

		return this;
	}

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

		this.CallEventHandlers('ClosePre');
		this.Hide();
		this.CallEventHandlers('Close');

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

	Quit() {
	/*//
	@date 2021-01-09
	//*/

		this.Close();

		this.CallEventHandlers('QuitPre');

		this.Content
		.empty();

		this.Container
		.removeClass('Loaded');

		this
		.SetIcon(this.Config.Icon);

		this.CallEventHandlers('Quit');

		return this;
	};

	OnClick() {
	/*//
	@date 2021-01-11
	//*/

		this.CallEventHandlers('Click');
		return this;
	}

	Show() {
	/*//
	@date 2021-01-07
	//*/

		if(!this.Container.hasClass('Loaded')) {

			if(typeof this.Config.Content === 'function')
			this.Content.append(this.Config.Content.call(this));
			else
			this.Content.append(this.Config.Content);

			this.CallEventHandlers('Load');
			this.Container.addClass('Loaded');
		}

		if(this.Container.hasClass('Minimized'))
		this.Minimize();

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

///////////////////////////////////////////////////////////////////////////
// src\//src/js\nui-30-element-window-dialogjs ////////////////////////////

NUI.Element.WindowDialog = class extends NUI.Element.Window {
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

