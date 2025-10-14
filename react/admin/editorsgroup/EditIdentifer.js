import React from "react";
import Dbm from "../../../index.js";

export default class EditIdentifier extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let item = this.context.item;
        let itemEditor = this.context.itemEditor;
        let initialDataPath = this.getPropValueWithDefault("initialDataPath", "identifier");
        let initialData = Dbm.objectPath(item, initialDataPath);

        let editor = itemEditor.getIdentiferEditor(initialData);
        this.item.setValue("editor", editor.item);
    }

    _renderMainElement() {

        let children = this.getPropValue("children")

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"valueEditor": this.item.editor}}, children)
        );
    }
}