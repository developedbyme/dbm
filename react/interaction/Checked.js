import React from "react";
import Dbm from "../../index.js";

export default class Checked extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("checked", false);

        this._clickedCommand = this._getScopedCallFunctionCommand(this._clicked);
    }

    _clicked() {
        //console.log("_clicked");

        let checkedProperty = this.getDynamicProp("checked");
        let newValue = this.getPropValueWithDefault("preventUncheck", false) ? true : !checkedProperty.value;
        checkedProperty.getMostUpstreamProperty().setValue(newValue);
    }

    _renderMainElement() {

    let checkedProperty = this.getDynamicProp("checked");

        return React.createElement(Dbm.react.context.AddContextVariables, {values: {selected: checkedProperty}},
            React.createElement(Dbm.react.interaction.CommandButton, {"command": this._clickedCommand},
                this.getPropValue("children")
            )
        );
    }
}

