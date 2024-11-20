import React from "react";
import Dbm from "../../index.js";

export default class AddContextVariables extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        //console.log("AddContextVariables::render");
        //console.log(this);
        
        let newContext = {...this.context};

        let values = this.props.values;
        for(let objectName in values) {
            newContext[objectName] = values[objectName];
        }

        return React.createElement(Dbm.react.context.Context.Provider, {"value": newContext}, this.props.children);
    }
}