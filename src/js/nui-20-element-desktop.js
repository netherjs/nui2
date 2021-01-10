
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