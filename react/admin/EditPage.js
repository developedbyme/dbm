import React from "react";
import Dbm from "../../index.js";

export default class EditPage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let page = this.context.page;

        let editor = new Dbm.flow.controllers.edit.EditMultipleValues();
        this.item.setValue("editor", editor);

        {
            let valueEditor = editor.getEditor("title").setInitialValue(page.title);
            valueEditor.item.setValue("updateEncodings", "title");
            valueEditor.item.setValue("generateEditData", "title");
        }
        
        editor.getEditor("navigationName").setInitialValue(page.navigationName);
        editor.getEditor("content").setInitialValue(page.content);
        editor.getEditor("description").setInitialValue(page["meta/description"]);
        editor.getEditor("url").setInitialValue(page.url);

        this.item.requireProperty("changed", false).connectInput(editor.item.properties.changed);

        let descriptionLength = Dbm.flow.updatefunctions.basic.length(editor.getEditor("description").value);

        this.item.requireProperty("descriptionLength", 0).connectInput(descriptionLength.output.properties.length);

        let editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        this.item.setValue("editorGroup", editorGroup);

        let id = page.id;
        let itemEditor = editorGroup.getItemEditor(id);

        itemEditor.addFieldEditor("navigationName", page.navigationName); //METODO: add update encoding
        itemEditor.addFieldEditor("content", page.content, "content");
        itemEditor.addFieldEditor("description", page["meta/description"], "meta/description");
        itemEditor.addFieldEditor("url", "url");

        let fieldEditor = itemEditor.addFieldEditor("title", page.title, "title");

        //fieldEditor.item.editValue.item.value = "TEst";

        editorGroup.save();
    }

    _save() {
        console.log("_save");

        let page = this.context.page;
        let id = page.id;
        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        //console.log(this.item.content);
        //console.log(this.item.content.blocks[1].data.text);

        let editor = this.item.editor;

        let saveData = createSaveData();
        getValueEdit(saveData, valueEditor)
        saveData.addChange(id, {"type": "setField", "data": {"value": editor.getEditor("title").getValue(), "field": "title"}});
        saveData.addUpdateEncoding(id, "title");
        saveData.addSavedCommand(valueEditor.getStoreCommand());

        saveData.getChanges();
        saveData.getUpdateEncodings();
        saveData.getSavedCommands();

        let request = graphApi.editItem(id, [
            {"type": "setField", "data": {"value": editor.getEditor("content").getValue(), "field": "content"}},
            {"type": "setField", "data": {"value": editor.getEditor("title").getValue(), "field": "title"}},
            {"type": "setField", "data": {"value": editor.getEditor("navigationName").getValue(), "field": "navigationName"}},
            {"type": "setField", "data": {"value": editor.getEditor("description").getValue(), "field": "meta/description"}},
			{"type": "setField", "data": {"value": (new Date()).toISOString(), "field": "lastModified"}},
            {"type": "setUrl", "data": {"value": editor.getEditor("url").getValue()}}
        ], ["content", "title", "url", "meta/description"]);
    }

    _generateSeoSummary() {

        let editor = this.item.editor;

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.requestData("admin/seoSummary", {"value": {"title": editor.getEditor("title").getValue(), "content": editor.getEditor("content").getValue()}});
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [request]));

    }

    _dataLoaded(aRequest) {
        let summary = Dbm.objectPath(aRequest, "data.seoSummary");

        let editor = this.item.editor;
        editor.getEditor("description").item.value = summary;
    }

    _renderMainElement() {

        let editor = this.item.editor;
        console.log(editor);

        return React.createElement("div", {},
            React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                React.createElement("div", {},
                    React.createElement("label", {className: "standard-field-label"},
                        "Page title"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": editor.getEditor("title").value, className: "standard-field standard-field-padding full-width page-title-form-field", placeholder: "Title"}),
                ),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {},
                    React.createElement("label", {className: "standard-field-label"},
                        "Navigation name"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": editor.getEditor("navigationName").value, className: "standard-field standard-field-padding full-width", placeholder: "Name showed in menues and breadcrumbs"}),
                ),
                React.createElement("div", {className: "spacing standard"}),
                React.createElement("div", {},
                    React.createElement("label", {className: "standard-field-label"},
                        "Url"
                    ),
                    React.createElement(Dbm.react.form.FormField, {"value": editor.getEditor("url").value, className: "standard-field standard-field-padding full-width", placeholder: "Url"}),
                ),
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                React.createElement("label", {className: "standard-field-label"},
                    "Seo description"
                ),
                React.createElement(Dbm.react.form.FormField, {"value": editor.getEditor("description").value, className: "standard-field standard-field-padding full-width", placeholder: "Description"}),
                React.createElement("div", {className: "spacing micro"}),
                React.createElement("div", {className: "flex-row justify-between"},
                    React.createElement("div", {className: "flex-row-item"},
                        React.createElement("div", {onClick: () => {this._generateSeoSummary()}}, "Generate"),
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
                    React.createElement(Dbm.react.admin.editor.Editor, {"value": editor.getEditor("content").value}),
                )
            ),
            React.createElement("div", {className: "spacing standard"}),
            React.createElement("div", {className: "save-all-position"},
                React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: editor.item.properties.changed},
                    React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                        "Save all changes"
                    )
                )
            )
        );
    }
}

