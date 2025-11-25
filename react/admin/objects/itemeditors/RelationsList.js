import React from "react";
import Dbm from "../../../../index.js";

export default class RelationsList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _create() {
        console.log("_create");
        let objectType = this.getPropValue("objectType");
        let encodings = this.getPropValueWithDefault("encodings", ["id"]);
        let visibility = this.getPropValueWithDefault("visibility", "private");

        let changes = [];

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem([objectType], visibility, changes, encodings);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._created.bind(this), [Dbm.core.source.staticObject(request, "item")]));
    }

    _created(aItem) {
        console.log("_created");
        console.log(aItem);

        let itemEditor = this.context.itemEditor;

        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");

        let editor;
        if(direction === "in") {
            editor = itemEditor.getAdminMultipleIncomingRelationsEditor(relationType, objectType);
        }
        else if(direction === "out") {
            editor = itemEditor.getAdminMultipleOutgoingRelationsEditor(relationType, objectType);
        }
        else {
            console.error("Unknown direction", direction, this);
        }

        let newValues = [].concat(editor.value);
        newValues.push(aItem.id);
        editor.value = newValues;
    }

    _renderMainElement() {

        let id = this.context.item.id;

        let label = this.getPropValue("label");
        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");
        let children = this.getPropValue("children");

        return React.createElement("div", {},
            React.createElement(Dbm.react.form.LabelledArea, {label: label}), 
            React.createElement("div", {"className": "standard-alternating-rows"},
                React.createElement(Dbm.react.admin.editorsgroup.EditMultipleRelations, {"direction": direction, "relationType": relationType, "objectType": objectType},
                    React.createElement(Dbm.react.area.List, {items: Dbm.react.source.contextVariable("valueEditor.editValue.value")},
                        children
                    )
                )
            ),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement("div", {"className": "flex-row"},
                React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._create.bind(this))},
                    React.createElement("div", {"className": "action-button action-button-padding"},
                        "Add"
                    )
                )
            )
        )
    }
}