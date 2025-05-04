import React from "react";
import Dbm from "../../index.js";

export default class AddItemToContext extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        
        let item = this.getPropValue("item");
        let id = Dbm.objectPath(item, "id");

        let as = this.getPropValue("as");
        if(!as) {
            as = "item";
        }

        let values = {};
        values[as] = item;

        return React.createElement(Dbm.react.context.AddContextVariables, {"values": values, "key": id}, this.props.children);
    }
}