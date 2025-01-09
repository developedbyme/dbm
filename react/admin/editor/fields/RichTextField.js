import React from "react";
import Dbm from "../../../../index.js";

export default class RichTextField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._valueChangedBound = this._valueChanged.bind(this);
        this._objectChangedBound = this._objectChanged.bind(this);
        this._elementChangedBound = this._elementChanged.bind(this);
        this._callback_inputBound = this._callback_input.bind(this);

        this.createRef("contentElement");
        Dbm.flow.addUpdateCommand(this.item.properties.contentElement, Dbm.commands.callFunction(this._elementChangedBound));

        let fieldName = this.getPropValue("name");

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let initialData = editorData.data[fieldName];
        if(!initialData) {
            initialData = "";
        }
        Dbm.flow.addUpdateCommand(this.item.requireProperty("value", initialData), Dbm.commands.callFunction(this._valueChangedBound));

        Dbm.flow.addUpdateCommand(editorData.properties.data, Dbm.commands.callFunction(this._objectChangedBound));
    }

    _valueChanged() {
        //console.log("_valueChanged");

        let fieldName = this.getPropValue("name");
        let newValue = this.item.value;
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let newData = {...editorData.data};
        newData[fieldName] = newValue;

        editorData.data = newData;

        if(this.item.contentElement && newValue !== this.item.contentElement.innerHTML) {
            this.item.contentElement.innerHTML = newValue;
        }
    }

    _objectChanged() {
        //console.log("_objectChanged");

        let fieldName = this.getPropValue("name");
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        this.item.value = editorData.data[fieldName];
    }

    _elementChanged() {
        //console.log("_elementChanged");

        this.item.contentElement.innerHTML = this.item.value;
        this.item.contentElement.addEventListener("input", this._callback_inputBound, false);

    }

    _callback_input(aEvent) {
        //console.log("_callback_input");

        this.item.value = this.item.contentElement.innerHTML;
    }

    _renderMainElement() {
        return this._createMainElement("div", {contentEditable: true, ref: this.createRef("contentElement"), className: "standard-field standard-field-padding"});
    }
}