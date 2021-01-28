import NUI from "../nui.js"
import Base from "../element/base.js"
import ConfigStruct from "../util/config-struct.js";

export default class extends Base {
/*//
@date 2021-01-12
//*/

	Config = new class extends ConfigStruct {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Text = '';
		Class = '';
		OnClick = '';
		OnDoubleClick = '';
	};

	Events = new class extends ConfigStruct {
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