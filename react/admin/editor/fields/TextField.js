import React from "react";
import Dbm from "../../../../index.js";

export default class TextField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._valueChangedBound = this._valueChanged.bind(this);
        this._objectChangedBound = this._objectChanged.bind(this);

        let fieldName = this.getProp("name");

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        console.log(editorData.data, editorData);
        let initialData = editorData.data[fieldName];
        if(!initialData) {
            initialData = "";
        }
        Dbm.flow.addUpdateCommand(this.item.requireProperty("value", initialData), Dbm.commands.callFunction(this._valueChangedBound));

        Dbm.flow.addUpdateCommand(editorData.properties.data, Dbm.commands.callFunction(this._objectChangedBound));
    }

    _valueChanged() {
        console.log("_valueChanged");

        let fieldName = this.getProp("name");
        let newValue = this.item.value;
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let newData = {...editorData.data};
        newData[fieldName] = newValue;

        editorData.data = newData;
    }

    _objectChanged() {
        console.log("_objectChanged");

        let fieldName = this.getProp("name");
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        this.item.value = editorData.data[fieldName];
    }

    _renderMainElement() {
        return this._createMainElement(Dbm.react.form.FormField, {value: this.item.properties.value, className: "standard-field standard-field-padding full-width"});
    }
}