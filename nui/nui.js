import Library  from "./core/library.js";
import Util from "./core/util.js";
import Mouse from "./core/mouse.js";
import Element from "./core/element.js";

export default class {

	static Library = Library;
	static Util = Util;
	static Mouse = new Mouse;
	static Element = Element;

};