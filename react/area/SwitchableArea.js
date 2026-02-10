import React from "react";
import Dbm from "../../index.js";

export default class SwitchableArea extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let childrenProperty = this.getDynamicPropWithoutState("children", []);
        let areaProperty = this.getDynamicPropWithoutState("area", null);

        this.item.requireProperty("element", null);

        Dbm.flow.addUpdateCommand(childrenProperty, Dbm.commands.callFunction(this._updateSlots.bind(this)));
        Dbm.flow.addUpdateCommand(areaProperty, Dbm.commands.callFunction(this._updateSlots.bind(this)));
    }

    _updateSlots() {
        let area = this.getPropValue("area");
        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));

        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);
        
        let slotElement = slots[area];
        let mainChildren = slots.main;

        if(!slotElement) {
            slotElement = mainChildren;
        }

        this.item.element = React.createElement(React.Fragment, {key: area}, slotElement);
    }

    _renderMainElement() {
        let areaProperty = this.getDynamicPropWithoutState("area", null);
        
        return React.createElement(Dbm.react.context.AddContextVariables, {values: {area: areaProperty}}, React.createElement(Dbm.react.area.InsertElement, {"element": this.item.properties.element}));
    }
}

