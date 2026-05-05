import React from "react";
import Dbm from "../../index.js";

export default class AddContextVariables extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _removedUsedProps(aProps) {
        super._removedUsedProps(aProps);
        
        delete aProps["values"];
    }

    _renderMainElement() {
        
        let newContext = {...this.context};

        let values = this.getPropValue("values");
        for(let objectName in values) {
            newContext[objectName] = values[objectName];
        }

        //METODO: pass down props to children
        return React.createElement(Dbm.react.context.Context.Provider, {"value": newContext}, this.props.children);
    }
}