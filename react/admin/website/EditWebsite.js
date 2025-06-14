import React from "react";
import Dbm from "../../../index.js";

export default class EditWebsite extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        this.item.setValue("editorGroup", editorGroup);
        this.item.requireProperty("changed", false).connectInput(editorGroup.item.properties.changed);

        this.item.requireProperty("websiteEditor", null);
        this.item.requireProperty("organizationEditor", null);
        this.item.requireProperty("localBusinesses", []);

        /*
        let itemEditor = editorGroup.getItemEditor(id);

        itemEditor.addFieldEditor("title", page.title, "title");
        itemEditor.addFieldEditor("navigationName", page.navigationName); //METODO: add update encoding
        itemEditor.addFieldEditor("content", page.content, "content");
        itemEditor.addEditor("url", page.url, Dbm.graphapi.webclient.admin.SaveFunctions.setUrl, "url");

        let descriptionEditor = itemEditor.addFieldEditor("meta/description", page["meta/description"], "meta/description");
        let descriptionLength = Dbm.flow.updatefunctions.basic.length(descriptionEditor.item.editValue.value);
        this.item.requireProperty("descriptionLength", 0).connectInput(descriptionLength.output.properties.length);

        this.item.requireProperty("importText", "");
        */

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);
        Dbm.flow.addUpdateCommandWhenMatched(this.item.properties.loaded, true, Dbm.commands.callFunction(this._allLoaded.bind(this), []));

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "globalObjectRelationQuery", "identifer": "website", "path": "(root)"},
                ],
                ["admin_fields"]
            );
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._websiteLoaded.bind(this), [request]));
            allLoaded.addCheck(request.properties.status);
        }
        
        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "globalObjectRelationQuery", "identifer": "website", "path": "out:by:organization"},
                ],
                ["admin_fields", "relations"]
            );
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._organizationLoaded.bind(this), [request]));
            allLoaded.addCheck(request.properties.status);
        }

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "globalObjectRelationQuery", "identifer": "website", "path": "out:by:organization,in:in:localBusiness"},
                ],
                ["id"]
            );
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._localBusinessesLoaded.bind(this), [request]));
            allLoaded.addCheck(request.properties.status);
        }
        
        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _websiteLoaded(aRequest) {
        console.log("_websiteLoaded");
        console.log(aRequest);

        let item = aRequest.items[0];
        let id = item.id;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(id);

        itemEditor.addFieldEditor("name", Dbm.objectPath(item, "fields.name"), "admin_fields");

        this.item.setValue("websiteEditor", itemEditor);
    }

    _organizationLoaded(aRequest) {
        console.log("_organizationLoaded");
        console.log(aRequest);

        let item = aRequest.items[0];
        let id = item.id;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(id);

        itemEditor.addFieldEditor("name", Dbm.objectPath(item, "fields.name"), "admin_fields");
        let logoRelations = Dbm.objectPath(item, "relations/in.isLogoFor.objects");
        let logo = (logoRelations && logoRelations.length) ? logoRelations[0].id : null;
        itemEditor.addIncomingRelationEditor("isLogoFor", "image", logo, ["relations"]);

        this.item.setValue("organizationEditor", itemEditor);
    }

    _localBusinessesLoaded(aRequest) {
        console.log("_localBusinessesLoaded");
        console.log(aRequest);

        this.item.localBusinesses = [].concat(aRequest.items);
    }

    _allLoaded() {
        console.log("_allLoaded");
    }

    _save() {
        console.log("_save");

        let editorGroup = this.item.editorGroup;

        let saveData = editorGroup.getSaveData();

        saveData.save();
    }

    _renderMainElement() {

        
        let editorGroup = this.item.editorGroup;

        return React.createElement("div", {"className": "content-narrow"},
            React.createElement(Dbm.react.area.HasData, {"check": this.item.properties.loaded}, 
                React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": editorGroup}},
                    React.createElement(Dbm.react.context.AddContextVariables, {values: {"itemEditor": this.item.properties.websiteEditor}},
                        React.createElement(Dbm.react.form.LabelledArea, {"label": "Website name"},
                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_name.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                        )
                    ),
                    React.createElement("div", {className: "spacing standard"}),
                    React.createElement(Dbm.react.context.AddContextVariables, {values: {"itemEditor": this.item.properties.organizationEditor}},
                        React.createElement(Dbm.react.form.LabelledArea, {"label": "Organization name"},
                            React.createElement(Dbm.react.form.FormField, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_name.item.editValue.item.properties.value"), className: "standard-field standard-field-padding full-width"}),
                        ),
                        React.createElement(Dbm.react.form.LabelledArea, {"label": "Logo"},
                            React.createElement(Dbm.react.form.GraphApiImage, {"value": Dbm.react.source.contextVariable("itemEditor.value.item.editor_relation_in_isLogoFor_image.item.editValue.item.properties.value")}),
                        )
                    ),
                    React.createElement("h2", {}, "Local business"),
                    React.createElement(Dbm.react.area.List, {items: this.item.properties.localBusinesses},
                        React.createElement(Dbm.react.admin.website.EditLocalBusiness, {})
                    ),
                    React.createElement("div", {className: "spacing standard"}),
                    React.createElement("div", {className: "save-all-position"},
                        React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: this.item.properties.changed},
                            React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                                "Save all changes"
                            )
                        )
                    )
                )

            )
            
        );
    }
}

