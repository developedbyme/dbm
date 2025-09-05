import React from "react";
import Dbm from "../../../index.js";

export default class LinkPreview extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let item = this.context.item;
        let itemEditor = this.context.itemEditor;

        {
            let direction = "in";
            let relationType = "for";
            let objectType = "linkPreview";
            let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(item, "relations/" + direction + "." + relationType + ".objects"), "objectTypes", objectType, "arrayContains");
            let editor = itemEditor.addMultipleIncomingRelationsEditor(relationType, objectType, Dbm.utils.ArrayFunctions.mapField(relations, "id"), ["relations"]);
            console.log(relations, editor);
        }
    }

    _addArrayRow(aArrayEditor) {
        console.log("_addArrayRow");

        let changes = [
            {"type": "addOutgoingRelation", "data": {"value": this.context.item.id, "type": "for"}}
        ];

        //METODO: set update date

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem(["linkPreview"], "public", changes, ["id"]);

        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, 1, Dbm.commands.callFunction(this._created.bind(this), [request, aArrayEditor]));
    }

    _created(aRequest, aArrayEditor) {
        console.log("_created");
        console.log(aRequest);

        aArrayEditor.push(aRequest.item.id);
    }

    _removeArrayRow(aArrayEditor, aItem) {
        aArrayEditor.removeItem(aItem);
    }

    _renderMainElement() {

        let direction = "in";
        let relationType = "for";
        let objectType = "linkPreview";

        return React.createElement("div", {},
            React.createElement("h2", {}, "Preview in list"),
                        
                React.createElement(Dbm.react.form.EditArray, {"value": Dbm.react.source.contextVariable("itemEditor.item.editor_multipleRelations_" + direction + "_" + relationType + "_" + objectType + ".item.editValue.item.properties.value")},
                    React.createElement("div", {},
                        React.createElement(Dbm.react.admin.EditObjectById, {id: Dbm.react.source.contextVariable("item.value")},
                                React.createElement("div", {},
                                    React.createElement(Dbm.react.form.LabelledArea, {label: "Image (if different from page main image)"}), 
                                    React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {"direction": "in", "relationType": "isMainImageFor", "objectType": "image"},
                                        React.createElement(Dbm.react.form.GraphApiImage, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), "encoding": "title", nameField: "title", className: "standard-field standard-field-padding full-width"})
                                    ),
                                    React.createElement("div", {className: "spacing small"}), 
                                    React.createElement(Dbm.react.form.LabelledArea, {label: "Title (if different from page title)"}), 
                                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "title"},
                                        React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width", placeholder: "Same as page title"})
                                    ),
                                    React.createElement("div", {className: "spacing small"}), 
                                    React.createElement(Dbm.react.form.LabelledArea, {label: "Excerpt"}), 
                                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "description"},
                                        React.createElement(Dbm.react.form.TextArea, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                    ),
                                    React.createElement("div", {className: "spacing small"}), 
                                    React.createElement(Dbm.react.form.LabelledArea, {label: "Link text (optional)"}), 
                                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "linkText"},
                                        React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width", placeholder: "Read more"})
                                    )
                                ),
                            ),
                    ),
                    /*
                    React.createElement("div", {"data-slot": "after"},
                        React.createElement("div", {"className": "spacing standard"}),
                        React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._addArrayRow.bind(this), [Dbm.react.source.contextVariable("arrayEditor")])},
                            React.createElement("div", {"className": "flex-row"},
                                React.createElement("div", {"className": "flex-row-item"},
                                    React.createElement("div", {"className": "action-button action-button-padding"}, "Add")
                                )
                            ),
                            
                        )
                    )
                        */
                ),
        );
    }
}

