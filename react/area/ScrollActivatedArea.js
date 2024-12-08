import React from "react";
import Dbm from "../../index.js";

export default class ScrollActivatedArea extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
		
		let elementProperty = this.item.requireProperty("element", null);
		this.item.requireProperty("activated", false);
		
		let position = new Dbm.flow.updatefunctions.dom.ElementPosition();
		this.item.setValue("position", position);
		position.input.properties.element.connectInput(elementProperty);
		
		let prepareProperty = this.item.requireProperty("prepare", 100);
		position.input.properties.prepareY.connectInput(prepareProperty);
		
		position.start();
		
		Dbm.flow.addUpdateCommand(position.output.properties.prepare, Dbm.commands.callFunction(this._prepareChanged.bind(this)));
    }
	
	_prepareChanged() {
		//console.log("_prepareChanged");
		
		if(this.item.position.output.prepare) {
			this.item.setValue("activated", true);
		}
	}

    _renderMainElement() {
        //console.log("ScrollActivatedArea::render");
        //console.log(this);
        
		return this._createMainElement("div", {"ref": this.createRef("element")},
			React.createElement(Dbm.react.area.HasData, {"check": this.item.properties.activated},
				this.getPropValue("children")
			)
		);

        return null;
    }
}

