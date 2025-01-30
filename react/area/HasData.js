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
        let checkType = this.getPropValue("checkType");

        if(checkType === "invert/default") {
            data = !data;
        }

        if(data) {
            return React.createElement(React.Fragment, {}, this.getPropValue("children"));
        }

        return null;
    }
}

