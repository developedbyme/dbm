import React from "react";
import Dbm from "../../../../index.js";

export default class Edit extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        this.item.setValue("editorGroup", editorGroup);
        this.item.requireProperty("changed", false).connectInput(editorGroup.item.properties.changed);
    }

     _save() {
        console.log("_save");

        let editorGroup = this.item.editorGroup;

        let saveData = editorGroup.getSaveData();

        saveData.save();
    }

    _renderMainElement() {

        let url = new URL(document.location.href);
        let id = url.searchParams.get("id");

        return React.createElement("div", {className: "content-narrow"},
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": this.item.editorGroup}},
                React.createElement(Dbm.react.admin.objects.EditObject, {id: id}),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {className: "save-all-position"},
                    React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: this.item.properties.changed},
                        React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                            "Save all changes"
                        )
                    )
                )
            )
        );
    }
}