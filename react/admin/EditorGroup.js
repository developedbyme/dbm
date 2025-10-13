import React from "react";
import Dbm from "../../index.js";

export default class EditorGroup extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let editorGroup = this.context.editorGroup;
        if(!editorGroup) {
            editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        }
        this.item.setValue("editorGroup", editorGroup);
    }

    _renderMainElement() {

        let children = this.getPropValue("children");

        return React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": this.item.editorGroup}},
            children
        );
    }
}