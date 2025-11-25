import React from "react";
import Dbm from "../../index.js";

export default class OpenCloseExpandableArea extends Dbm.react.BaseObject {
	_construct() {
		super._construct();
		
		let startValue = this.getPropValue("startState") === "open";
		let openProperty = this.getDynamicProp("open", startValue);

		let invert = Dbm.flow.updatefunctions.logic.invert(openProperty);
		this.item.requireProperty("ariaHidden", !openProperty.value);
		
		let switchValue = Dbm.flow.updatefunctions.logic.switchValue(openProperty).addCase(false, 0).addCase(true, 1);
		let animateValueObject = Dbm.flow.animateValue(switchValue.output.properties.value);
		let transformToStyle = Dbm.flow.updatefunctions.basic.transformValue(animateValueObject.properties.output, this._transformToStyle.bind(this));

		let visibleCondition = Dbm.flow.updatefunctions.logic.condition(animateValueObject.properties.output, ">", 0);
		this.item.requireProperty("isVisible", false).connectInput(visibleCondition.output.properties.result);
		
		this.item.requireProperty("animationStyle", {}).connectInput(transformToStyle.output.properties.value);

		this.item.setValue("animation", Dbm.react.animation.connectedAnimation(transformToStyle.output.properties.value));
	}

	_removedUsedProps(aProps) {
        delete aProps["open"];
    }
	
	_transformToStyle(aEnvelope) {
		//console.log("_transformToStyle");
		//console.log(aEnvelope, this, this.item.element);
		
		if(aEnvelope === 0) {
			return {"height": "0px", "overflow": "hidden", "display": "none", "visibility": "hidden"};
		}
		else if(aEnvelope === 1 || !this.item.element) {
			return {};
		}
		
		return {"height": (this.item.element.clientHeight*aEnvelope) + "px", "overflow": "hidden"};
	}
	
	_renderMainElement() {
        //console.log("OpenCloseExpandableArea::_renderMainElement");
        //console.log(this);

		let openProperty = this.getDynamicProp("open");
		
		return this._createMainElement(Dbm.react.animation.AnimatedElement, {"className": "animation-element", "controller": this.item.animation.item, "aria-hidden": this.item.properties.ariaHidden},
			React.createElement(Dbm.react.context.AddContextVariables, {"values": {"open": openProperty, "isVisible": this.item.properties.isVisible}},
				React.createElement("div", {"ref": this.createRef("element")},
					this.getPropValue("children")
				)
			)
		);
		
		return null;
	}
}

