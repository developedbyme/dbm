import React from "react";
import Dbm from "../../../../index.js";

export default class EditorBlocks extends Dbm.react.BaseObject {
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
            returnData = {};
        }

        console.log(editorData, returnData);

        return returnData;
    }

    _valueChanged() {
        console.log("EditorBlock::_valueChanged");

        let fieldName = this.getPropValue("name");
        let newValue = {...this.item.value};
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let newData = {...editorData.data};
        newData[fieldName] = newValue;

        editorData.data = newData;
    }

    _objectChanged() {
        //console.log("_objectChanged");

        let newValue = this._getObjectData();
        if(JSON.stringify(newValue) !== JSON.stringify(this.item.value)) {
            this.item.value = newValue;
        }

        
    }

    _renderMainElement() {
        return this._createMainElement("div", {},
            React.createElement(Dbm.react.admin.editor.Editor, {value: this.item.properties.value})
        );
    }
}