import React from "react";
import Dbm from "../../index.js";

export default class InsertElement extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _removedUsedProps(aProps) {
        delete aProps["element"];
    }

    _renderMainElement() {
        //console.log("InsertElement::render");
        //console.log(this);
        
        let element = this.getPropValue("element");

        if(!element) {
            return React.createElement("div", {}, "No element set");
        }

        let props = this._copyProps(this.props);

        let returnElement = Dbm.react.ChildFunctions.clone(element, props);
        return returnElement;
    }
}

