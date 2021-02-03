import NUI from "../nui.js";
import Config from "../struct/config.js";
import Base from "../element/base.js";

export default class extends Base {
/*//
@date 2021-01-08
//*/

	ObjectType = 'NUI-Element-Overlay';

	Config = new class extends Config {
		ID = `${(new Date).getTime()}`;
		Container = 'body';
		Content = '';
		Debug = true;
	};

	Events = new class extends Config {
		Ready = {};
	};

	constructor(Opt) {
	/*//
	@date 2021-01-08
	//*/

		if(Opt instanceof Base)
		Opt = { 'Content': Opt };

		////////

		super(Opt);
		this.Config.Push(Opt);

		////////

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