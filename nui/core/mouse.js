import Vec2 from "../struct/vec2.js";

let Mouse = new class {

	Queue = [];
	LastX = 0;
	LastY = 0;

	constructor() {
		let OnMouseMove;

		OnMouseMove = function(Ev){
			let DeltaX = this.LastX - Ev.clientX;
			let DeltaY = this.LastY - Ev.clientY;

			if(this.Queue.length)
			jQuery.each(this.Queue,function(Key,Obj){
				Obj.offset(function(Idx,Pos){
					Obj.attr('nui-moved','true');
					return {
						left: (Pos.left - DeltaX),
						top: (Pos.top - DeltaY)
					};
				});
			});

			this.LastX = Ev.clientX;
			this.LastY = Ev.clientY;
			//console.log([this.LastX,this.LastY]);

			return;
		};

		jQuery(document)
		.ready((function(){
			jQuery(document)
			.on('mousemove',OnMouseMove.bind(this));
		}).bind(this));

		return;
	};

	////////

	Register(Obj){
	/*//
	@argv jQuery Object
	add something to the list of things that wants to be moved around
	so that it can be processed later.
	//*/

		var Found = false;

		jQuery.each(this.Queue,function(Key,Value){
			if(Value === Obj) {
				Found = true;
				return false;
			}
			return true;
		});

		if(!Found) {
			jQuery('body').addClass('NUI-NoSelect');
			this.Queue.push(Obj);
		}

		return;
	};

	Unregister(Obj){
	/*//
	@argv jQuery Object
	remove something from the list of things that wants to be moved
	around so that it stops moving around.
	//*/

		var that = this;

		jQuery.each(this.Queue,function(Key,Value){
			if(Value === Obj) {
				that.Queue.splice(Key,1);
			}
			return;
		});

		if(!that.Queue.length)
		jQuery('body').removeClass('NUI-NoSelect');

		return;
	};

	////////

	GetPos() {
	/*//
	@date 2021-01-28
	//*/

		return new Vec2(
			this.LastX,
			this.LastY
		);
	}

};

export default Mouse;
