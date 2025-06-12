import React from "react";
import Dbm from "../../../../index.js";

export default class SelectObjectsField extends Dbm.react.BaseObject {
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

        console.log(">>>>>", editorData);

        let returnData = editorData.data[fieldName];
        if(!returnData) {
            returnData = [];
        }

        return returnData;
    }


    _valueChanged() {
        console.log("_valueChanged");

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

        aArrayEditor.push(0);
    }

    _removeItem(aArrayEditor, aItem) {
        aArrayEditor.removeItem(aItem);
    }

    _renderMainElement() {


        return this._createMainElement(Dbm.react.form.EditArray, {value: this.item.properties.value},
            React.createElement("div", {}, 
                this._createMainElement(Dbm.react.form.GraphApiObjectSelection, {value: Dbm.react.source.contextVariable("item.properties.value"), objectType: this.getPropValue("objectType"), className: "standard-field standard-field-padding full-width"}),
                React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._removeItem, [Dbm.react.source.contextVariable("arrayEditor"), Dbm.react.source.contextVariable("item")])},
                    React.createElement("div", {}, "Remove")
                )
            ),
            React.createElement(Dbm.react.interaction.CommandButton, {"data-slot": "after", command: Dbm.commands.callFunction(this._add, [Dbm.react.source.contextVariable("arrayEditor")])},
                React.createElement("div", {}, "Add")
            )
         );
    }
}