import React from "react";
import Dbm from "../../index.js";

export default class FormField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("value", "");
        this.getDynamicPropWithoutState("editing", false);
        this.state["formUpdate"] = 0;

        this._callback_changeBound = this._callback_change.bind(this);
        this._callback_focusBound = this._callback_focus.bind(this);
        this._callback_blurBound = this._callback_blur.bind(this);
    }

    _callback_change(aEvent) {
        //console.log("_callback_change");
        //console.log(aEvent);

        let value = aEvent.target.value;

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(value);
        this.setState({"formUpdate": this.state.formUpdate}); //MENOTE: trigger change direct to not lose focus on input
    }

    _callback_focus(aEvent) {
        console.log("_callback_focus");
        //console.log(aEvent);

        this.getDynamicProp("editing").getMostUpstreamProperty().setValue(true);
        console.log(this.getDynamicProp("editing"), this.getDynamicProp("editing").getMostUpstreamProperty());
    }

    _callback_blur(aEvent) {
        console.log("_callback_blur");
        //console.log(aEvent);

        this.getDynamicProp("editing").getMostUpstreamProperty().setValue(false);
        console.log(this.getDynamicProp("editing"), this.getDynamicProp("editing").getMostUpstreamProperty());
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value").value;

        return this._createMainElement("input", {"value": value, onChange: this._callback_changeBound, onFocus: this._callback_focusBound, onBlur: this._callback_blurBound});
    }
}

