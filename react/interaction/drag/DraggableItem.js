import React from "react";
import Dbm from "../../../index.js";

export default class DraggableItem extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

		this._callback_dragStartBound = this._callback_dragStart.bind(this);
		this._callback_dragOverBound = this._callback_dragOver.bind(this);
		this._callback_dragOutBound = this._callback_dragOut.bind(this);
		this._callback_dragEndBound = this._callback_dragEnd.bind(this);
		this._callback_dropBound = this._callback_drop.bind(this);

        this.item.requireProperty("dragged", false);
        this.item.requireProperty("over", false);
	    
	}
	
	_callback_dragStart(aEvent) {
		console.log("_dragStart");
		//console.log(aEvent, aIndex);
		
		let currentNode = this.item.mainElement;
		
		aEvent.dataTransfer.effectAllowed = "move";
		aEvent.dataTransfer.setDragImage(currentNode, 0, 0);
		
		let dragData = this.getPropValueWithDefault("dragData", {});
		
		aEvent.dataTransfer.setData("text/plain", JSON.stringify(dragData));
		
		this.item.dragged = true;
		
		let dragController = this.context.dragController;
		if(dragController) {
			dragController.startDrag(this);
		}
	}
	
	_callback_dragOver(aEvent) {
		console.log("_dragOver");
		//console.log(aEvent, aIndex);
		
		aEvent.preventDefault();
		
		this.item.over = true;
	}
	
	_callback_dragOut(aEvent) {
		console.log("_callback_dragOut");
		//console.log(aEvent, aIndex);
		
		aEvent.preventDefault();
		
		this.item.over = false;
	}
	
	_callback_dragEnd(aEvent) {
		console.log("_dragEnd");
		//console.log(aEvent, aIndex);
		
		this.item.dragged = false;
	}
	
	_callback_drop(aEvent) {
		console.log("_callback_drop");
		this.item.over = false;
		
		console.log(aEvent, aEvent.dataTransfer.getData("text"));
		
		let data = null;
		let dataString = aEvent.dataTransfer.getData("text");
		if(dataString) {
			data = JSON.parse(dataString);
		}
		
		let dragController = this.context.dragController;
		if(dragController) {
			dragController.itemDroppedOn(this, data);
		}
	}

    _renderMainElement() {

        let children = this.getPropValue("children");

		let draggable = !this.getPropValue("skipDraggable");
		
        return this._createMainElement("div", {"ref": this.createRef("mainElement"), "draggable": draggable, "onDragStart": this._callback_dragStartBound, "onDragOver": this._callback_dragOverBound, "onDragLeave": this._callback_dragOutBound, "onDragEnd": this._callback_dragEndBound, "onDrop": this._callback_dropBound},
			children
		);
    }
}

