import React from "react";
import Dbm from "../../../index.js";

export default class EditPartOfObject extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let valueProperty = this.getDynamicPropWithoutState("value", {});
        
        let partObject = new Dbm.flow.controllers.transform.PartOfObject();
        this.item.setValue("partOfObject", partObject);
        let path = this.getPropValue("path");

        if(!valueProperty.value) {
            valueProperty.getMostUpstreamProperty().value = {};
        }

        partObject.item.properties.object.connectInput(valueProperty);
        partObject.item.path = path;

        this.item.requireProperty("valuePart", null).connectInput(partObject.item.properties.value);
    }

    _renderMainElement() {

        let children = this.getPropValue("children")

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"value": this.item.properties.valuePart}}, children)
        );
    }
}