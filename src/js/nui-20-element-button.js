
NUI.Element.Button = class extends NUI.Element.Base {
/*//
@date 2021-01-12
//*/

	Config = new class extends NUI.Util.ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Text = '';
		Class = '';
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

		return;
	}

}