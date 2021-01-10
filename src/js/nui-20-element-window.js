
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