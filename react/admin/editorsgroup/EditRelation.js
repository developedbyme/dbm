import React from "react";
import Dbm from "../../../index.js";

export default class EditRelation extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let item = this.context.item;
        let itemEditor = this.context.itemEditor;
        let editor;


        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");

        let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(item, "relations/" + direction + "." + relationType + ".objects"), "objectTypes", objectType, "arrayContains");
        let relation = (relations && relations.length) ? relations[0].id : null;

        if(direction == "in") {
            editor = itemEditor.addIncomingRelationEditor(relationType, objectType, relation, ["relations"]);
        }
        else if(direction == "out") {
            editor = itemEditor.addOutgoingRelationEditor(relationType, objectType, relation, ["relations"]);
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