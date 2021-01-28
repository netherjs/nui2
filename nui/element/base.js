import NUI from "../nui.js"

export default class {

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
