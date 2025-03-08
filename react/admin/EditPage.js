import React from "react";
import Dbm from "../../index.js";

export default class EditPage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let page = this.context.page;

        let editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        this.item.setValue("editorGroup", editorGroup);
        this.item.requireProperty("changed", false).connectInput(editorGroup.item.properties.changed);

        let id = page.id;
        let itemEditor = editorGroup.getItemEditor(id);

        itemEditor.addFieldEditor("title", page.title, "title");
        itemEditor.addFieldEditor("navigationName", page.navigationName); //METODO: add update encoding
        itemEditor.addFieldEditor("content", page.content, "content");
        itemEditor.addEditor("url", page.url, Dbm.graphapi.webclient.admin.SaveFunctions.setUrl, "url");

        let descriptionEditor = itemEditor.addFieldEditor("meta/description", page["meta/description"], "meta/description");
        let descriptionLength = Dbm.flow.updatefunctions.basic.length(descriptionEditor.item.editValue.value);
        this.item.requireProperty("descriptionLength", 0).connectInput(descriptionLength.output.properties.length);
    }

    _save() {
        console.log("_save");

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;

        let saveData = editorGroup.getSaveData();
        let itemSaveData = saveData.getItemSaveData(page.id);

        itemSaveData.setField("lastModified", (new Date()).toISOString());
        itemSaveData.createChange("clearCache", {});

        console.log(editorGroup, saveData);

        saveData.save();
    }

    _generateSeoSummary() {

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.requestData("admin/seoSummary", {"value": {"title": itemEditor.getEditor("title").item.editValue.getValue(), "content": itemEditor.getEditor("content").item.editValue.getValue()}});
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [request]));

    }

    _dataLoaded(aRequest) {
        let summary = Dbm.objectPath(aRequest, "data.seoSummary");

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        itemEditor.getEditor("meta/description").item.editValue.item.value = summary;
    }

    _renderMainElement() {

        let page = this.context.page;
        
        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": editorGroup, "itemEditor": itemEditor}},
                React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                    React.createElement("div", {},
                        React.createElement("label", {className: "standard-field-label"},
                            "Page title"
                        ),
                        React.createElement(Dbm.react.form.FormField, {"value": itemEditor.getEditor("title").item.editValue.value, className: "standard-field standard-field-padding full-width page-title-form-field", placeholder: "Title"}),
                    ),
                    React.createElement("div", {className: "spacing standard"}),
                    React.createElement("div", {},
                        React.createElement("label", {className: "standard-field-label"},
                            "Navigation name"
                        ),
                        React.createElement(Dbm.react.form.FormField, {"value": itemEditor.getEditor("navigationName").item.editValue.value, className: "standard-field standard-field-padding full-width", placeholder: "Name showed in menues and breadcrumbs"}),
                    ),
                    React.createElement("div", {className: "spacing standard"}),
                    React.createElement("div", {},
                        React.createElement("label", {className: "standard-field-label"},
                            "Url"
                        ),
                        React.createElement(Dbm.react.form.FormField, {"value": itemEditor.getEditor("url").item.editValue.value, className: "standard-field standard-field-padding full-width", placeholder: "Url"}),
                    ),
                ),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                    React.createElement("label", {className: "standard-field-label"},
                        "Seo description"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": itemEditor.getEditor("meta/description").item.editValue.value, className: "standard-field standard-field-padding full-width", placeholder: "Description"}),
                    React.createElement("div", {className: "spacing micro"}),
                    React.createElement("div", {className: "flex-row justify-between"},
                        React.createElement("div", {className: "flex-row-item"},
                            React.createElement("div", {onClick: () => {this._generateSeoSummary()}, className: "action-button action-button-padding"}, "Generate"),
                        ),
                        React.createElement("div", {className: "flex-row-item"},
                            Dbm.react.text.text(this.item.properties.descriptionLength),
                            " / ",
                            "155"
                        )
                    )
                ),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                    React.createElement("label", {className: "standard-field-label"},
                        "Content"
                    ),
                    React.createElement("div", {},
                        React.createElement(Dbm.react.admin.editor.Editor, {"value": itemEditor.getEditor("content").item.editValue.value}),
                    )
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
        );
    }
}

