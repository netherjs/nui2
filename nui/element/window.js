import ConfigStruct from "../util/config-struct.js";
import Base from "../element/base.js";
import Mouse from "../core/mouse.js";
import Util from "../core/util.js";

export default class extends Base {
/*//
@date 2021-01-07
if all you need is a window to contain stuff that can be moved
around, minimized, or whatnot, then this is the class you should
use. if you'd like to ask like the user a simple question the
more tailored version called Dialog may be more use.
//*/

	ObjectType = 'NUI-Element-Window';

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////

	// local configuration values.

	Config = new class extends ConfigStruct {
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

	Events = new class extends ConfigStruct {
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
				(function(){ Util.CenterInParent(this.Container); return; }).bind(this)
			);

			if(this.Modal)
			jQuery(window)
			.on('resize',(function(){ Util.CenterInParent(this.Container); return; }).bind(this));
		}

		else if(this.Config.Position instanceof Util.Vec2) {
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
		.on('click',(function(){
			if(this.Config.QuitOnClose) {
				this.Quit();
				return;
			}

			this.Close();
			return;
		}).bind(this));

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
			Util.ClearSelections();

			this.Container
			.addClass('MoveMode');

			jQuery(document)
			.on(EvName,(function(){
				this.SetMoveMode(false);
				return;
			}).bind(this));

			Mouse.Register(this.Container);
			this.CallEventHandlers('MoveStart');
		}

		else {
			this.Container
			.removeClass('MoveMode');

			jQuery(document)
			.off(EvName);

			Mouse.Unregister(this.Container);
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
		let OffsetX = (Pos.left + this.Container.width()) - Mouse.LastX;
		let OffsetY = (Pos.top + this.Container.height()) - Mouse.LastY;

		if(Mode) {
			Util.ClearSelections();

			this.Container
			.addClass('ResizeMode');

			jQuery(document)
			.on(EvName,(function(OffsetX,OffsetY){
				let Pos = this.Container.offset();

				this.Container
				.width(Math.round((Mouse.LastX - Pos.left) + OffsetX));

				this.Container
				.height(Math.round((Mouse.LastY - Pos.top) + OffsetY));

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

		Util.ClearSelections();

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

		Util.ClearSelections();

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