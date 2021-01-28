import NUI from "../nui.js";

export default class {

	Count(Key) {
	/*//
	@date 2021-01-27
	//*/

		return Object.keys(this[Key]).length;
	};

	Push(Opt) {
	/*//
	@date 2021-01-27
	//*/

		NUI.Util.MergeProperties(Opt,this);
		return this;
	};

};