import React from "react";
import Dbm from "../../index.js";

export default class FormField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("value", "");
        this.state["formUpdate"] = 0;

        this._callback_changeBound = this._callback_change.bind(this);
    }

    _callback_change(aEvent) {
        //console.log("_callback_change");
        //console.log(aEvent);

        let value = aEvent.target.value;

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(value);
        this.setState({"formUpdate": this.state.formUpdate}); //MENOTE: trigger change direct to not lose focus on input
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value").value;

        return this._createMainElement("textarea", {onChange: this._callback_changeBound}, value);
    }
}

