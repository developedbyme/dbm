import React from "react";
import Dbm from "../../index.js";

export default class Checkbox extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("checked", false);

        this._callback_changeBound = this._callback_change.bind(this);
    }

    _callback_change(aEvent) {
        //console.log("_callback_change");
        //console.log(aEvent, this);

        let checked = aEvent.target.checked;

        this.getDynamicProp("checked").getMostUpstreamProperty().setValue(checked);
    }

    _renderMainElement() {

        let checked = this.getDynamicProp("checked").value;

        return this._createMainElement("input", {"type": "checkbox", "checked": checked, onChange: this._callback_changeBound});
    }
}

