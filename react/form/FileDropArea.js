import React from "react";
import Dbm from "../../index.js";


export default class FileDropArea extends Dbm.react.BaseObject {

	_construct() {
		super._construct();

		this._id = "dropField" + Dbm.getInstance().getNextId();
		this.item.requireProperty("dropHighlightClass", "");
		let classNameAdd = Dbm.flow.updatefunctions.logic.add("file-drop-area display-block cursor-pointer", this.item.properties.dropHighlightClass)

		this.item.setValue("classNameAdd", classNameAdd);
		this.item.requireProperty("fullClass", "").connectInput(classNameAdd.output.properties.result);
	}
	
	_handleFiles(aFiles) {
		console.log("_handleFiles");
		console.log(aFiles);
		
		let command = this.getPropValue("changeCommands");
		
		command.perform(this, aFiles);
	}
	
	_highlight(aEvent) {
		aEvent.preventDefault()
		aEvent.stopPropagation()
		
		this.item.setValue("dropHighlightClass", "drop-file-highlight");
	}

	_unhighlight(aEvent) {
		aEvent.preventDefault()
		aEvent.stopPropagation()
		
		this.item.setValue("dropHighlightClass", "");
	}

	_handleDrop(aEvent) {
		console.log("_handleDrop");

		aEvent.preventDefault()
		aEvent.stopPropagation()
		
		this.item.setValue("dropHighlightClass", "");
		
		let dataTransfer = aEvent.dataTransfer;
		let files = dataTransfer.files;

		this._handleFiles(files);
	}

	_handleChange(aEvent) {
		console.log("_handleChange");

		this._handleFiles(aEvent.target.files);
	}

	_selectFiles() {
		var input = document.createElement('input');
		input.type = 'file';

		let accept = this.getPropValue("accept");
		if(accept) {
			input.accept = accept;
		}
		
		input.addEventListener("change", (aEvent) => {this._handleChange(aEvent)});
		input.click();
	}
	
	_renderMainElement() {

		return this._createMainElement(Dbm.react.BaseObject, {
			role: "button",
			tabIndex: 0,
			className: this.item.properties.fullClass,
			onDragEnter: (aEvent) => {this._highlight(aEvent);},
			onDragOver: (aEvent) => {this._highlight(aEvent);},
			onDragLeave: (aEvent) => {this._unhighlight(aEvent);}, 
			onDrop: (aEvent) => {this._handleDrop(aEvent);},
			onKeyDown: function(aEvent) {console.log(aEvent); if(aEvent.key === "Enter") aEvent.target.click()},
			onClick: (aEvent) => {this._selectFiles();}
		},
			this.getPropValue("children")
		);
	}
}


