import Dbm from "../../../index.js";

export default class MoveElement extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._element = null;
        this._startX = 0;
		this._startY = 0;
        this._startXParameter = 0;
        this._startYParameter = 0;

        this._callback_mouseMoveBound = this._callback_mouseMove.bind(this);
        this._callback_mouseUpBound = this._callback_mouseUp.bind(this);
        this._callback_startDragBound = this._callback_startDrag.bind(this);

        this.item.requireProperty("element", null);
        Dbm.flow.addUpdateCommand(this.item.properties.element, Dbm.commands.callFunction(this._elementUpdated.bind(this)));

        let updateXCommand = Dbm.commands.callFunction(this._updateX.bind(this));
        let updateYCommand = Dbm.commands.callFunction(this._updateY.bind(this));

        let clampXCommand = Dbm.commands.callFunction(this._clampX.bind(this));
        let clampYCommand = Dbm.commands.callFunction(this._clampY.bind(this));

        this.item.requireProperty("minX", 0);
        Dbm.flow.addUpdateCommand(this.item.properties.minX, updateXCommand);
        Dbm.flow.addUpdateCommand(this.item.properties.minX, clampXCommand);
        this.item.requireProperty("maxX", 0);
        Dbm.flow.addUpdateCommand(this.item.properties.maxX, updateXCommand);
        Dbm.flow.addUpdateCommand(this.item.properties.maxX, clampXCommand);

        this.item.requireProperty("minY", 0);
        Dbm.flow.addUpdateCommand(this.item.properties.minY, updateYCommand);
        Dbm.flow.addUpdateCommand(this.item.properties.minY, clampYCommand);
        this.item.requireProperty("maxY", 0);
        Dbm.flow.addUpdateCommand(this.item.properties.maxY, updateYCommand);
        Dbm.flow.addUpdateCommand(this.item.properties.maxY, clampYCommand);

        this.item.requireProperty("xParameter", 0);
        Dbm.flow.addUpdateCommand(this.item.properties.xParameter, updateXCommand);
        this.item.requireProperty("yParameter", 0);
        Dbm.flow.addUpdateCommand(this.item.properties.yParameter, updateYCommand);

        this.item.requireProperty("scaleX", 1);
        Dbm.flow.addUpdateCommand(this.item.properties.scaleX, updateXCommand);
        this.item.requireProperty("scaleY", 1);
        Dbm.flow.addUpdateCommand(this.item.properties.scaleY, updateYCommand);

        this.item.requireProperty("invertX", 1);
        this.item.requireProperty("invertY", 1);

        this.item.requireProperty("x", 0);
        this.item.requireProperty("y", 0);

        this.item.requireProperty("isDragging", false);
    }

    _elementUpdated() {
        console.log("_elementUpdated");

        if(this._element) {
            let element = this._element;
            element.removeEventListener("mousedown", this._callback_startDragBound);
            element.removeEventListener("touchstart", this._callback_startDragBound);
        }

        if(this.item.element) {
            let element = this.item.element;
            element.addEventListener("mousedown", this._callback_startDragBound);
            element.addEventListener("touchstart", this._callback_startDragBound);
        }
        this._element = this.item.element;
    }

    _updateX() {
        this.item.x = this.item.xParameter*this.item.scaleX;
    }

    _clampX() {
        let minX = this.item.minX;
		let maxX = this.item.maxX;
		
		this.item.xParameter = Math.max(minX, Math.min(this.item.xParameter, maxX));
    }

    _clampY() {
        let minY = this.item.minY;
		let maxY = this.item.maxY;
		
		this.item.yParameter = Math.max(minY, Math.min(this.item.yParameter, maxY));
    }

    _updateY() {
        this.item.y = this.item.yParameter*this.item.scaleY;
    }


    _startMove(aX, aY) {
		//console.log(aX, aY);
		
		this._startXParameter = this.item.xParameter;
        this._startYParameter = this.item.yParameter;
		this._startX = aX;
		this._startY = aY;
	}
	
	_updateMove(aX, aY) {
		console.log("_updateMove");
		//console.log(aX, aY);
		
		let x = this._startXParameter + this.item.invertX*(aX-this._startX)/this.item.scaleX;
		let y = this._startYParameter + this.item.invertY*(aY-this._startY)/this.item.scaleY;
        
		let minX = this.item.minX;
		let maxX = this.item.maxX;
		
		let minY = this.item.minY;
		let maxY = this.item.maxY;
		
		this.item.properties.xParameter.getMostUpstreamProperty().value = Math.max(minX, Math.min(x, maxX));
        this.item.properties.yParameter.getMostUpstreamProperty().value = Math.max(minY, Math.min(y, maxY));
	}
	
	_callback_mouseUp(aEvent) {
		console.log("_callback_mouseUp");
		//console.log(aEvent);
		
		if(aEvent.type === "touchend") {
			this._updateMove(aEvent.touches[0].pageX, aEvent.touches[0].pageY);
		}
		else {
			this._updateMove(aEvent.pageX, aEvent.pageY);
		}
		
		document.removeEventListener("mousemove", this._callback_mouseMoveBound, false);
		document.removeEventListener("mouseup", this._callback_mouseUpBound, false);
		
		document.removeEventListener("touchmove", this._callback_mouseMoveBound, false);
		document.removeEventListener("touchup", this._callback_mouseUpBound, false);

        this.item.isDragging = false;
	}
	
	_callback_mouseMove(aEvent) {
		//console.log("_callback_mouseMove");
		//console.log(aEvent);
		
		if(aEvent.type === "touchmove") {
			this._updateMove(aEvent.touches[0].pageX, aEvent.touches[0].pageY);
		}
		else {
			this._updateMove(aEvent.pageX, aEvent.pageY);
		}
	}
	
	_callback_startDrag(aEvent) {
		//console.log("_callback_startDrag");
		//console.log(aEvent, aEvent.type);
		
		if(aEvent.type === "touchstart") {
			this._startMove(aEvent.touches[0].pageX, aEvent.touches[0].pageY);
		}
		else {
			this._startMove(aEvent.pageX, aEvent.pageY);
		}
		
		document.addEventListener("mousemove", this._callback_mouseMoveBound, false);
		document.addEventListener("mouseup", this._callback_mouseUpBound, false);
		
		document.addEventListener("touchmove", this._callback_mouseMoveBound, false);
		document.addEventListener("touchup", this._callback_mouseUpBound, false);

        this.item.isDragging = true;
	}
}