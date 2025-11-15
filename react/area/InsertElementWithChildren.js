import React from "react";
import Dbm from "../../index.js";

export default class InsertElementWithChildren extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _performCloneWithNewChildren(aElement, aChildren) {
        var callArray = [aElement, {}];
        
        callArray = callArray.concat(aChildren);
        
        return React.cloneElement.apply(React, callArray);
    }

    render() {
        //console.log("InsertElementWithChildren::render");
        //console.log(this);
        
        let element = this.getPropValue("element");
        let children = this.getPropValue("children");

        if(!element) {
            return React.createElement("div", {}, "No element set");
        }

        return this._performCloneWithNewChildren(element, children);
    }
}



