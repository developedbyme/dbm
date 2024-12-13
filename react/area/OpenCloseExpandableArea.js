import React from "react";
import Dbm from "../../index.js";

export default class OpenCloseExpandableArea extends Dbm.react.BaseObject {
	_construct() {
		super._construct();
		
		let startValue = this.getPropValue("startState") === "open";
		let openProperty = this.getDynamicProp("open", startValue);
		
		let switchValue = Dbm.flow.updatefunctions.logic.switchValue(openProperty).addCase(false, 0).addCase(true, 1);
		let animateValueObject = Dbm.flow.animateValue(switchValue.output.properties.value);
		let transformToStyle = Dbm.flow.updatefunctions.basic.transformValue(animateValueObject.properties.output, this._transformToStyle.bind(this));
		
		this.item.requireProperty("animationStyle", {}).connectInput(transformToStyle.output.properties.value);
	}
	
	_transformToStyle(aEnvelope) {
		console.log("_transformToStyle");
		console.log(aEnvelope, this, this.item.element);
		
		if(aEnvelope === 0) {
			return {"height": "0px", "overflow": "hidden"};
		}
		else if(aEnvelope === 1 || !this.item.element) {
			return {};
		}
		
		return {"height": (this.item.element.clientHeight*aEnvelope) + "px", "overflow": "hidden"};
	}
	
	_renderMainElement() {
        //console.log("OpenCloseExpandableArea::_renderMainElement");
        //console.log(this);
		
		return this._createMainElement(Dbm.react.BaseObject, {"className": "animation-element", "style": this.item.properties.animationStyle},
			React.createElement("div", {"ref": this.createRef("element")},
				this.getPropValue("children")
			)
		);
		
		return null;
	}
}

