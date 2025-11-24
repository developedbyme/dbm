import React from "react";
import Dbm from "../../../index.js";

export default class EditUrl extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let itemEditor = this.context.itemEditor;

        let editor = itemEditor.getAdminUrlEditor();
        this.item.setValue("editor", editor.item);
    }

    _renderMainElement() {

        let children = this.getPropValue("children")

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"valueEditor": this.item.editor}}, children)
        );
    }
}