import React from "react";
import Dbm from "../../index.js";

export default class CustomSelection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let valueProperty = this.getDynamicPropWithoutState("value", null);
        let itemsProperty = this.getDynamicPropWithoutState("items", []);

        let openProperty = this.item.requireProperty("open", false);
        this.item.requireProperty("rows", []);

        this.item.requireProperty("selectedItem", null);

        let mappedList = Dbm.flow.updatefunctions.basic.mappedList(itemsProperty, [this._getScopedCallFunctionCommand(this._newRow, [Dbm.core.source.event("mappedItem")])]);
        this.item.setValue("mappedList", mappedList);
        this.item.properties.rows.connectInput(mappedList.output.properties.items);

        let singleSelection = new Dbm.flow.controllers.select.SingleSelection();
        this.item.setValue("singleSelection", singleSelection.item);
        singleSelection.item.properties.value.connectInput(valueProperty);

        let closeCommand = Dbm.commands.setProperty(openProperty, false);
        this.item.setValue("closeCommand", closeCommand);

        let path = this.getPropValueWithDefault("path", "id");
        let getItemBy = Dbm.flow.updatefunctions.basic.getItemBy(itemsProperty, valueProperty, path);
        this.item.setValue("getItemBy", getItemBy);

        this.item.properties.selectedItem.connectInput(getItemBy.output.properties.value);
    }

    _newRow(aRow) {
        //console.log("_newRow");
        //console.log(aRow);

        let path = this.getPropValueWithDefault("path", "id");

        let value = Dbm.objectPath(aRow, "forItem." + path);

        let selectedProperty = this.item.singleSelection.controller.addSelectionValue(value);

        aRow.setValue("value", value);
        aRow.requireProperty("selected", false).connectInput(selectedProperty);
    }

    _renderMainElement() {

        let children = Dbm.utils.ArrayFunctions.singleOrArray(this.getPropValue("children"));
        
        let slots = Dbm.react.ChildFunctions.splitIntoSlots(children);
                
        let buttonElement = slots["button"];
        let mainChildren = slots.main;

        let contextValues = {"value": this.item.properties["props/value"], "selectedItem": this.item.properties.selectedItem, "rows": this.item.properties.rows, "closeCommand": this.item.closeCommand};

        return this._createMainElement(Dbm.react.form.Dropdown, {"open": this.item.properties.open},
            React.createElement(Dbm.react.context.AddContextVariables, {"data-slot": "button", "values": contextValues}, 
                React.createElement(Dbm.react.area.InsertElement, {"element": buttonElement})
            ),
            React.createElement(Dbm.react.context.AddContextVariables, {"values": contextValues}, 
                React.createElement(Dbm.react.area.InsertElement, {"element": mainChildren})
            )
        );
    }
}

