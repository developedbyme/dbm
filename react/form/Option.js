import React from "react";
import Dbm from "../../index.js";

export default class Option extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("value", "");
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value").value;

        return this._createMainElement("option", {"value": value,}, this.getPropValue("children"));
    }
}

