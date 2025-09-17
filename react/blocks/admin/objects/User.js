import React from "react";
import Dbm from "../../../../index.js";

export default class User extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        this.item.setValue("editorGroup", editorGroup);
        this.item.requireProperty("changed", false).connectInput(editorGroup.item.properties.changed);

        this.item.requireProperty("newPassword", "");
    }

     _save() {
        console.log("_save");

        let editorGroup = this.item.editorGroup;

        let saveData = editorGroup.getSaveData();

        saveData.save();
    }

    _updatePassword() {
        let url = new URL(document.location.href);
        let id = url.searchParams.get("id");
        let password = this.item.newPassword;

        if(password) {
            Dbm.graphapi.webclient.performAction("admin/user/setPassword", {"id": id, "password": password}, this._passwordSet.bind(this));
        }
    }

    _passwordSet(aData) {
        console.log("_passwordSet");
        console.log(aData);
    }

    _renderMainElement() {

        let url = new URL(document.location.href);
        let id = url.searchParams.get("id");

        return React.createElement("div", {className: "content-narrow"},
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": this.item.editorGroup}},
                React.createElement("h2", {className: "no-margins"}, "Edit details"),
                React.createElement("div", {className: "spacing small"}),
                React.createElement(Dbm.react.admin.objects.EditObject, {id: id}),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {className: "save-all-position"},
                    React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: this.item.properties.changed},
                        React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                            "Save all changes"
                        )
                    )
                ),
                React.createElement("h2", {className: "no-margins"}, "New password"),
                React.createElement("div", {className: "spacing small"}),
                React.createElement("div", {className: "flex-row small-item-spacing"},
                    React.createElement("div", {className: "flex-row-item flex-resize"},
                        React.createElement(Dbm.react.form.FormField, {"className": "standard-field standard-field-padding full-width", "type": "password", "autoComplete": "new-password", value: this.item.properties.newPassword})
                    ),
                    React.createElement("div", {className: "flex-row-item no-flex-resize"},
                        React.createElement(Dbm.react.interaction.CommandButton, {"command": Dbm.commands.callFunction(this._updatePassword.bind(this))},
                            React.createElement("div", {className: "standard-button standard-button-padding"},
                                "Set password"
                            )
                        )
                    )
                ),
            )
        );
    }
}