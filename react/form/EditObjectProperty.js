import React from "react";
import Dbm from "../../index.js";

export default class EditObjectProperty extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._valueSelector = new Dbm.flow.controllers.transform.PartOfObject();

        this._valueSelector.item.properties.object.connectInput(this.getDynamicPropWithoutState("value", {}));
        this._valueSelector.item.properties.path.connectInput(this.getDynamicPropWithoutState("path", null));

        this.item.requireProperty("value", {}).connectInput(this._valueSelector.item.properties.value);
    }

    _constructAfterProps() {
        super._constructAfterProps();

        this._valueSelector._objectUpdated();
        let initialValue = this.getPropValue("initialValue");
        let currentValue = this.item.value;
        if(this.item.value === null || this.item.value === undefined) {
            if(initialValue !== null && initialValue !== undefined) {
                this._valueSelector.item.value = initialValue;
                this._valueSelector._valueUpdated();
            }
        }
    }

    _renderMainElement() {

        let children = this.getPropValue("children");

        return this._createMainElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"value": this.item.properties.value}},
                children
            )
        );
    }
}

