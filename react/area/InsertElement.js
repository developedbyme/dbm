import React from "react";
import Dbm from "../../index.js";

export default class InsertElement extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        //console.log("InsertElement::render");
        //console.log(this);
        
        let element = this.getDynamicProp("element").value;

        if(!element) {
            return React.createElement("div", {}, "No element set");
        }

        return element;
    }
}

