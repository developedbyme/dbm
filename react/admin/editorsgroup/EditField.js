import React from "react";
import Dbm from "../../../index.js";

export default class EditField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let item = this.context.item;
        let itemEditor = this.context.itemEditor;
        let fieldName = this.getPropValue("fieldName");
        let initialDataPath = this.getPropValueWithDefault("initialDataPath", fieldName);
        let initialData = Dbm.objectPath(item, initialDataPath);

        console.log(">>>>>>>>>>", initialData, item, initialDataPath);

        let editor = itemEditor.addFieldEditor(fieldName, initialData);
        this.item.setValue("editor", editor.item);
    }

    _renderMainElement() {

        let children = this.getPropValue("children")

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"valueEditor": this.item.editor}}, children)
        );
    }
}