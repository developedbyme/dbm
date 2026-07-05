import React from "react";
import Dbm from "../../../../index.js";

export default class ArrayField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._valueChangedBound = this._valueChanged.bind(this);
        this._objectChangedBound = this._objectChanged.bind(this);

        Dbm.flow.addUpdateCommand(this.item.requireProperty("value", this._getObjectData()), Dbm.commands.callFunction(this._valueChangedBound));

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");
        Dbm.flow.addUpdateCommand(editorData.properties.data, Dbm.commands.callFunction(this._objectChangedBound));
    }

    _getObjectData() {
        let fieldName = this.getPropValue("name");

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let returnData = editorData.data[fieldName];
        if(!returnData) {
            returnData = [];
        }

        return returnData;
    }


    _valueChanged() {
        //console.log("_valueChanged");

        let fieldName = this.getPropValue("name");
        let newValue = this.item.value;
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let newData = {...editorData.data};
        newData[fieldName] = newValue;

        editorData.data = newData;

        this.context.moduleData.editorData.editorBlock.dataUpdated();
    }

    _objectChanged() {
        //console.log("_objectChanged");

        this.item.value = this._getObjectData();
    }

    _add(aArrayEditor) {
        console.log("_add");
        console.log(aArrayEditor);

        let newItemData = this.getPropValueWithDefault("newItemData", {});

        aArrayEditor.push(newItemData);
    }

    _removeItem(aArrayEditor, aItem) {
        aArrayEditor.removeItem(aItem);
    }

    _renderMainElement() {


        return this._createMainElement(Dbm.react.form.EditArray, {value: this.item.properties.value},
            React.createElement("div", {"className": "flex-row small-item-spacing"}, 
                React.createElement("div", {"className": "flex-row-item flex-resize"},
                    this.getPropValue("children")
                ),
                React.createElement("div", {"className": "flex-row-item flex-no-resize"},
                    React.createElement("div", {className: "spacing small"}),
                    React.createElement(Dbm.react.interaction.ConfirmButton, {"command": this._getScopedCallFunctionCommand(this._removeItem, [Dbm.react.source.contextVariable("arrayEditor"), Dbm.react.source.contextVariable("item")])},
                        React.createElement(Dbm.react.image.Image, {"src": "/assets/img/icons/delete.svg", "className": "background-contain text-row-icon icon-color:action cursor-pointer"}),
                        React.createElement("div", {"data-slot": "confirm", className: "absolute-container cursor-pointer", title: "Click to remove"},
                            React.createElement(Dbm.react.image.Image, {"src": "/assets/img/icons/delete.svg", "className": "background-contain text-row-icon hover-icon icon-color:remove-action cursor-pointer"}),
                            React.createElement("div", {className:"centered-tip-text no-pointer-events"},
                                "Remove?"
                            )
                        )
                    )
                )
            ),
            React.createElement("div", {"data-slot": "spacing", className: "spacing small"}),
            React.createElement("div", {"data-slot": "after", "className": "flex-row"},
                React.createElement("div", {className: "spacing small"}),
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._add.bind(this), [Dbm.react.source.contextVariable("arrayEditor")])},
                        React.createElement("div", {className: "action-button action-button-padding"}, "Add")
                    )
                )
            )
         );
    }
}