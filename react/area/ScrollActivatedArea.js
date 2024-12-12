import React from "react";
import Dbm from "../../index.js";

export default class ScrollActivatedArea extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
		
		let elementProperty = this.item.requireProperty("element", null);
		let activatedProperty = this.item.requireProperty("activated", false);
		
		let position = new Dbm.flow.updatefunctions.dom.ElementPosition();
		this.item.setValue("position", position);
		position.input.properties.element.connectInput(elementProperty);
		
		let prepareProperty = this.item.requireProperty("prepare", 100);
		position.input.properties.prepareY.connectInput(prepareProperty);
		
		let whenMatched = Dbm.flow.updatefunctions.logic.whenMatched(position.output.properties.prepare, true);
		activatedProperty.connectInput(whenMatched.output.properties.value);
		
		position.start();
		
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

