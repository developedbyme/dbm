import React from "react";
import Dbm from "../../../index.js";

export default class HelpSections extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let item = this.context.item;
        let itemEditor = this.context.itemEditor;

        {
            let direction = "in";
            let relationType = "for";
            let objectType = "helpSection";
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

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem(["helpSection"], "public", changes, ["id"]);

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
        let objectType = "helpSection";

        return React.createElement("div", {},
            React.createElement("h2", {}, "Faq questions"),
                        
                React.createElement(Dbm.react.form.EditArray, {"value": Dbm.react.source.contextVariable("itemEditor.item.editor_multipleRelations_" + direction + "_" + relationType + "_" + objectType + ".item.editValue.item.properties.value")},
                    React.createElement("div", {},
                        React.createElement("h3", {}, "Question ", Dbm.react.text.text(Dbm.react.source.contextVariable("item.properties.value"))),
                        React.createElement(Dbm.react.admin.EditObjectById, {id: Dbm.react.source.contextVariable("item.value")},
                                React.createElement("div", {},
                                    React.createElement(Dbm.react.form.LabelledArea, {label: "Question"}, 
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "question"},
                                            React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    ),
                                    React.createElement(Dbm.react.form.LabelledArea, {label: "Title"}, 
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "title", "initialDataPath": "title"},
                                            React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    )
                                ),
                                React.createElement(Dbm.react.form.LabelledArea, {label: "Description"}, 
                                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "description"},
                                        React.createElement(Dbm.react.form.TextArea, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                    )
                                ),
                                React.createElement(Dbm.react.form.LabelledArea, {label: "Link text"}, 
                                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "linkText"},
                                        React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                    )
                                )
                            ),
                    ),
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
                ),
        );
    }
}

