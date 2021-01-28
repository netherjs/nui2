import Library  from "./core/library.js";
import Util from "./core/util.js";
import Mouse from "./core/mouse.js";
import Element from "./core/element.js";

export default class {

	static Version = '0.0.1';

	static Library = Library;
	static Util = Util;
	static Mouse = new Mouse;
	static Element = Element;

};