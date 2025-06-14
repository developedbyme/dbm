import React from "react";
import Dbm from "../../index.js";

export default class HasData extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        //console.log("HasData::render");
        //console.log(this);
        
        let data = this.getPropValue("check");
        let checkType = this.getPropValueWithDefault("checkType", "default");
        let compareValue = this.getPropValue("compareValue");

        let isInverted = false;
        if(checkType.indexOf("invert/") === 0) {
            isInverted = true;
            checkType = checkType.substring(7);
        }

        if(checkType === "default") {
            checkType = "objectExists";
        }

        let compareFunction = Dbm.getInstance().repository.getItem("compareFunctions/" + checkType).compare;
        if(!compareFunction) {
            console.warn("No copmare function registered for: " + checkType + ". Using default", this, data, checkType, compareValue);
            compareFunction = Dbm.utils.CompareFunctions.objectExists;
        }

        let isOk = compareFunction(data, compareValue);

        if(isInverted) {
            isOk = !isOk;
        }

        if(isOk) {
            return React.createElement(React.Fragment, {}, this.getPropValue("children"));
        }

        return null;
    }
}

