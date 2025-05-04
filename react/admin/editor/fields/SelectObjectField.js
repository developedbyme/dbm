import React from "react";
import Dbm from "../../../../index.js";

export default class SelectObjectField extends Dbm.react.BaseObject {
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
            returnData = 0;
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

    _renderMainElement() {
        return this._createMainElement(Dbm.react.form.GraphApiObjectSelection, {value: this.item.properties.value, objectType: this.getPropValue("objectType"), className: "standard-field standard-field-padding full-width"});
    }
}