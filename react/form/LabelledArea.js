import React from "react";
import Dbm from "../../index.js";

export default class LabelledArea extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("label", "");
    }

    _renderMainElement() {

        return this._createMainElement("div", {},
            React.createElement("label", {"className": "standard-field-label", "htmlFor": this.getProp("for")},
                Dbm.react.text.text(this.getDynamicProp("label"))
            ),
            React.createElement("div", {"className": "spacing micro"}),
            this.getPropValue("children")
        );
    }
}

