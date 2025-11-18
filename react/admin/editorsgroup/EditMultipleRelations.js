import React from "react";
import Dbm from "../../../index.js";

export default class EditMultipleRelations extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let itemEditor = this.context.itemEditor;
        let editor;

        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");

        if(direction == "in") {
            editor = itemEditor.getAdminMultipleIncomingRelationsEditor(relationType, objectType);
        }
        else if(direction == "out") {
            editor = itemEditor.getAdminMultipleOutgoingRelationsEditor(relationType, objectType);
        }
        else  {
            console.error("Unknown direction", direction, this);
            editor = null;
        }
        
        if(editor) {
            this.item.setValue("editor", editor.item);
        }
    }

    _renderMainElement() {

        let children = this.getPropValue("children")

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {"values": {"valueEditor": this.item.editor}}, children)
        );
    }
}