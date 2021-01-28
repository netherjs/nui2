
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
