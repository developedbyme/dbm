import React from "react";
import Dbm from "../../../../index.js";

export default class Edit extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        this.item.setValue("editorGroup", editorGroup);
        this.item.requireProperty("changed", false).connectInput(editorGroup.item.properties.changed);

        this.item.requireProperty("open", false);
    }

     _save() {
        console.log("_save");

        let editorGroup = this.item.editorGroup;

        let saveData = editorGroup.getSaveData();

        saveData.save();
    }

    _toggleOpen() {
        console.log("_toggleOpen");

        this.item.open = !this.item.open;
    }

    _renderMainElement() {

        let url = new URL(document.location.href);
        let id = url.searchParams.get("id");

        return React.createElement("div", {className: "content-narrow"},
            React.createElement("div", {className: "flex-row small-item-spacing"},
                React.createElement("div", {className: "flex-row-item"},
                    React.createElement("div", {className: "action-button action-button-padding", "onClick": () => {this._toggleOpen()}},
                        "Run commands"
                    )
                )
            ),
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.open},
                React.createElement(Dbm.react.admin.objects.RunObjectCommands, {id: id})
            )
        );
    }
}