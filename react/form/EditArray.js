import React from "react";
import Dbm from "../../index.js";

export default class EditArray extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._arrayValues = new Dbm.flow.controllers.transform.SingleArrayValues();

        this._arrayValues.item.properties.array.connectInput(this.getDynamicPropWithoutState("value", []));
        this.item.requireProperty("rows", []).connectInput(this._arrayValues.item.properties.items);

    }

    _renderMainElement() {

        let children = this.getPropValue("children");
        
        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);

        let beforeElement = slots.before;
        let afterElement = slots.after;
        let mainChildren = slots.main;

        if(!beforeElement) {
            beforeElement = null;
        }
        if(!afterElement) {
            afterElement = null;
        }

        return this._createMainElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"arrayEditor": this._arrayValues}},
                beforeElement,
                React.createElement(Dbm.react.area.List, {"items": this.item.properties.rows},
                    mainChildren
                ),
                afterElement
            )
        );
    }
}

