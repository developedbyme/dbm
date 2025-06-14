import React from "react";
import Dbm from "../../../index.js";

export default class EditWebsite extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        this.item.requireProperty("itemEditor", null);
        this.item.requireProperty("locationEditor", null);

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);
        Dbm.flow.addUpdateCommandWhenMatched(this.item.properties.loaded, true, Dbm.commands.callFunction(this._allLoaded.bind(this), []));

        let id = this.context.item.id;

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [id]},
                ],
                ["admin_fields", "relations"]
            );
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [request]));
            allLoaded.addCheck(request.properties.status);
        }
        
        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _dataLoaded(aRequest) {
        console.log("_dataLoaded");
        console.log(aRequest);

        let item = aRequest.items[0];
        let id = item.id;

        let editorGroup = this.context.editorGroup;
        let itemEditor = editorGroup.getItemEditor(id);

        itemEditor.addFieldEditor("name", Dbm.objectPath(item, "fields.name"), "admin_fields");

        let isMainImageForRelations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(item, "relations/in.isMainImageFor.objects"), "objectTypes", "image", "arrayContains");
        let mainImage = (isMainImageForRelations && isMainImageForRelations.length) ? isMainImageForRelations[0].id : null;
        itemEditor.addIncomingRelationEditor("isMainImageFor", "image", mainImage, ["relations"]);

        itemEditor.addFieldEditor("phoneNumber", Dbm.objectPath(item, "fields.phoneNumber"), "admin_fields");
        itemEditor.addFieldEditor("email", Dbm.objectPath(item, "fields.email"), "admin_fields");
        itemEditor.addFieldEditor("priceRangeDescription", Dbm.objectPath(item, "fields.priceRangeDescription"), "admin_fields");

        itemEditor.addFieldEditor("rating/value", Dbm.objectPath(item, "fields.rating/value"), "admin_fields");
        itemEditor.addFieldEditor("rating/count", Dbm.objectPath(item, "fields.rating/count"), "admin_fields");
        itemEditor.addFieldEditor("rating/min", Dbm.objectPath(item, "fields.rating/min"), "admin_fields");
        itemEditor.addFieldEditor("rating/max", Dbm.objectPath(item, "fields.rating/max"), "admin_fields");

        {
            let relationType = "at";
            let objectType = "location";
            let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(item, "relations/out." + relationType + ".objects"), "objectTypes", objectType, "arrayContains");
            let relation = (relations && relations.length) ? relations[0].id : null;
            itemEditor.addOutgoingRelationEditor(relationType, objectType, relation, ["relations"]);
        }

        this.item.setValue("itemEditor", itemEditor);
    }

    _allLoaded() {
        console.log("_allLoaded");
    }

    _renderMainElement() {

        let locationId = Dbm.react.source.contextVariable("itemEditor.value.item.editor_relation_out_at_location.item.editValue.item.properties.value");


        return React.createElement("div", {},
            React.createElement(Dbm.react.area.HasData, {"check": this.item.properties.loaded}, 
                React.createElement(Dbm.react.context.AddContextVariables, {values: {"itemEditor": this.item.properties.itemEditor}},
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Name"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_name.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"})
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Image"},
                        React.createElement(Dbm.react.form.GraphApiImage, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_relation_in_isMainImageFor_image.item.editValue.item.properties.value")}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Phone number"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_phoneNumber.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Email"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_email.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Price range description"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_priceRangeDescription.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Rating"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_rating/value.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Rating (count)"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_rating/count.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Min"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_rating/min.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Max"},
                        React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_rating/max.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                    ),
                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Location"},
                        React.createElement(Dbm.react.form.GraphApiSelectOrCreateObject, {"value": locationId, objectType: "location"}),
                        React.createElement(Dbm.react.area.HasData, {check: locationId},
                            React.createElement(Dbm.react.context.AddItemByIdToContext, {id: locationId},
                                React.createElement(Dbm.react.admin.editorsgroup.EditItem, {},
                                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Street"},
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {fieldName: "street"},
                                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    ),
                                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Post code"},
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {fieldName: "postCode"},
                                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    ),
                                    React.createElement(Dbm.react.form.LabelledArea, {"label": "City"},
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {fieldName: "city"},
                                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    ),
                                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Country code"},
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {fieldName: "country"},
                                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    ),
                                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Latitude"},
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {fieldName: "latitude"},
                                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    ),
                                    React.createElement(Dbm.react.form.LabelledArea, {"label": "Longitude"},
                                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {fieldName: "longitude"},
                                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                                        )
                                    )
                                )
                            ),
                        ),
                    )
                )
            )
        );
    }
}

