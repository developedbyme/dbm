import React from "react";
import Dbm from "../../index.js";

export default class EditableContent extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let valueProperty = this.getDynamicPropWithoutState("value", "");
        this.getDynamicPropWithoutState("editing", false);
        this.state["formUpdate"] = 0;
        this._currentValue = "";

        this._callback_focusBound = this._callback_focus.bind(this);
        this._callback_blurBound = this._callback_blur.bind(this);

        this._elementChangedBound = this._elementChanged.bind(this);
        this._callback_inputBound = this._callback_input.bind(this);
    
        this.createRef("contentElement");
        Dbm.flow.addUpdateCommand(this.item.properties.contentElement, Dbm.commands.callFunction(this._elementChangedBound));

        valueProperty.addUpdate(this._getScopedCallFunctionCommand(this._valueChanged));
    }

    _callback_focus(aEvent) {
        //console.log("_callback_focus");
        //console.log(aEvent);

        this.getDynamicProp("editing").getMostUpstreamProperty().setValue(true);
    }

    _callback_blur(aEvent) {
        //console.log("_callback_blur");
        //console.log(aEvent);

        this.getDynamicProp("editing").getMostUpstreamProperty().setValue(false);
    }

    _valueChanged() {
        //console.log("_elementChanged");

        if(this.item.contentElement) {
            let value = this.getPropValueWithoutNull("value", "");
            if(value !== this._currentValue) {
                this.item.contentElement.innerHTML = value;
            }
        }
    }
    
    _elementChanged() {
        //console.log("_elementChanged");

        this.item.contentElement.innerHTML = this.getPropValueWithoutNull("value", "");
        this.item.contentElement.addEventListener("input", this._callback_inputBound, false);

    }
    
    _callback_input(aEvent) {
        //console.log("_callback_input");

        let value = "" + this.item.contentElement.innerHTML;
        this._currentValue = value;
        this.getDynamicProp("value").getMostUpstreamProperty().setValue(value);
        this.setState({"formUpdate": this.state.formUpdate}); //MENOTE: trigger change direct to not lose focus on input
    }
    
    _renderMainElement() {
        return this._createMainElement("div", {contentEditable: true, ref: this.createRef("contentElement"), className: "standard-field standard-field-padding"});
    }
}

