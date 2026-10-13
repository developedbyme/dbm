import React from "react";
import Dbm from "../../../index.js";

export default class CalendarDate extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let valueProp = this.getDynamicProp("selected");

    }

    _clicked() {
        let valueProp = this.getDynamicProp("selected");

        valueProp.getMostUpstreamProperty().value = true;

        this.context.open.getMostUpstreamProperty().value = false;
        
    }

    _renderMainElement() {

        let className = "date-selection date-selection-padding text-align-center";
        if(this.getPropValue("selected")) {
            className += " selected"
        }

        return this._createMainElement("div", {className: className, onClick: () => {this._clicked()}, role:"button", tabIndex: 0}, this.getPropValue("date"));
    }
}