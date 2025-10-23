import React from "react";
import Dbm from "../../index.js";

export default class ConfirmButton extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let childrenProperty = this.getDynamicPropWithoutState("children", []);
        let confirmProperty = this.getDynamicPropWithoutState("confirm", false);
        let command = this.getDynamicPropWithoutState("command", null);

        this.item.requireProperty("idleElement", null);
        this.item.requireProperty("confirmElement", null);

        Dbm.flow.addUpdateCommand(childrenProperty, Dbm.commands.callFunction(this._updateSlots.bind(this)));

        //METODO: change this to highest property

        let switchValue = Dbm.flow.updatefunctions.logic.switchValue(confirmProperty);
        switchValue.setDefaultValue(React.createElement(Dbm.react.interaction.CommandButton, {"key": "idle", "command": Dbm.commands.setProperty(confirmProperty, true)},
            React.createElement("div", {}, React.createElement(Dbm.react.area.InsertElement, {"element": this.item.properties.idleElement}))
            
        ));
        
        switchValue.addCase(true, React.createElement(Dbm.react.interaction.ClickOutsideTrigger, {command: Dbm.commands.setProperty(confirmProperty, false)},
            React.createElement(Dbm.react.interaction.CommandButton, {"key": "confirm", "command": command}, 
                React.createElement("div", {}, React.createElement(Dbm.react.area.InsertElement, {"element": this.item.properties.confirmElement}))
            )
        ));

        this.item.setValue("switchValue", switchValue);
    }

    _updateSlots() {
        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));

        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);
        
        let confirmElement = slots.confirm;
        let mainChildren = slots.main;

        if(!confirmElement) {
            confirmElement = mainChildren;
        }

        this.item.idleElement = mainChildren;
        this.item.confirmElement = confirmElement;
    }

    _renderMainElement() {
        let confirmProperty = this.getDynamicPropWithoutState("confirm", false);
        
        return React.createElement(Dbm.react.context.AddContextVariables, {values: {confirm: confirmProperty}}, React.createElement(Dbm.react.area.InsertElement, {"element": this.item.switchValue.output.properties.value}));
    }
}

