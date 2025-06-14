import React from "react";
import Dbm from "../../index.js";

export default class AddItemByIdToContext extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        
        let id = this.getPropValue("id");
        let item = Dbm.getInstance().repository.getItem(id);

        let as = this.getPropValue("as");
        if(!as) {
            as = "item";
        }

        let values = {};
        values[as] = item;

        return React.createElement(Dbm.react.context.AddContextVariables, {"values": values, "key": id}, this.props.children);
    }
}