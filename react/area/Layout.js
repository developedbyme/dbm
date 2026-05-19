import React from "react";
import Dbm from "../../index.js";

export default class Layout extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let layoutProperty = this.context.layout;
    }

    _renderMainElement() {
        
        let data = this.getPropValue("layout");

        let layouts = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(data);

        return this._createMainElement(Dbm.react.area.HasData, {"check": this.context.layout, "checkType": "inArray", "compareValue": layouts}, this.getPropValue("children"));
    }
}

