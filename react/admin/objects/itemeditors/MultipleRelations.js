import React from "react";
import Dbm from "../../../../index.js";

export default class MultipleRelations extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let objectType = this.getPropValue("objectType");
        let encodings = this.getPropValueWithDefault("encodings", ["name"]);
        let visibility = this.getPropValueWithDefault("visibility", "private");

        this.item.requireProperty("items", []);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        {
            let request = graphApi.requestRange(
                [
                    {"type": "byObjectType", "objectType": objectType},
                    {"type": "includeDraft"},
                    {"type": "includePrivate"}
                ],
                encodings
            );

    
           Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._itemsLoaded.bind(this), [request]));
        }
    }

    _itemsLoaded(aRequest) {
        let options = [];

        let nameField = this.getPropValue("nameField");
        if(!nameField) {
            nameField = "name";
        }

        let currentArray = [].concat(aRequest.items);
        Dbm.utils.ArrayFunctions.sortOnField(currentArray, nameField);

        this.item.items = currentArray;
    }

    _add(aItem) {
        console.log("_add");
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

    _remove(aId) {
        console.log("_remove");
        console.log(aId);

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

        let index = newValues.indexOf(aId);
        if(index >= 0) {
            newValues.splice(index, 1);
        }

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
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.items, checkType: "notEmpty"},
                React.createElement("div")
            ),
            React.createElement("div", {"className": "standard-alternating-rows"},
                React.createElement(Dbm.react.admin.editorsgroup.EditMultipleRelations, {"direction": direction, "relationType": relationType, "objectType": objectType},
                    React.createElement(Dbm.react.area.List, {items: Dbm.react.source.contextVariable("valueEditor.editValue.value")},
                        React.createElement("div", {"className": "flex-row small-item-spacing justify-between"},
                            React.createElement("div", {"className": "flex-row"},
                                React.createElement(Dbm.react.context.AddItemByIdToContext, {id: Dbm.react.source.contextVariable("item")},
                                    Dbm.react.text.text(Dbm.react.source.item("name"))
                                )
                            ),
                            React.createElement("div", {"className": "flex-row"},  
                                React.createElement(Dbm.react.interaction.CommandButton, {"commands": [Dbm.commands.callFunction(this._remove.bind(this), [Dbm.react.source.contextVariable("item")])]},
                                    React.createElement("div", {},
                                        
                                        "Remove"
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement("div", {"className": "flex-row"},
                React.createElement(Dbm.react.form.Dropdown, {"position": "right"},
                    React.createElement("div", {"data-slot": "button", "className": "action-button action-button-padding"},
                        "Add"
                    ),
                    React.createElement("div", {"className": "dropdown-menu-max-height standard-dropdown"},
                        React.createElement(Dbm.react.area.List, {items: this.item.properties.items, "as": "relatedItem"},
                            React.createElement(Dbm.react.interaction.CommandButton, {"commands": [
                                Dbm.commands.callFunction(this._add.bind(this), [Dbm.react.source.contextVariable("relatedItem")]),
                                Dbm.commands.setProperty(Dbm.react.source.contextVariable("open"), false)
                            ]},
                                React.createElement("div", {className: "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"},
                                    Dbm.react.text.text(Dbm.react.source.contextVariable("relatedItem.name"))
                                )
                            ),
                        )
                    )
                )
                
            )
        )
    }
}