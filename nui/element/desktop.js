import NUI from "../nui.js";
import Base from "../element/base.js";
import ConfigStruct from "../util/config-struct.js";
import Vec2 from "../util/vec2.js";

export default class extends Base {
/*//
@date 2021-01-08
//*/

	ObjectType = 'NUI-Element-Desktop';

	Config = new class extends ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Content = '';
		Debug = true;
	};

	Events = new class extends ConfigStruct {
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

		if(Config.Position instanceof Vec2)
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