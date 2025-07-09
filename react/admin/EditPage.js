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
        itemEditor.addFieldEditor("publishDate", page.publishDate, "urlRequest");
        itemEditor.addOutgoingRelationEditor("in", "group/pageCategory", page.category ? page.category.id : 0, "urlRequest");
        itemEditor.addEditor("url", page.url, Dbm.graphapi.webclient.admin.SaveFunctions.setUrl, "url");

        let descriptionEditor = itemEditor.addFieldEditor("meta/description", page["meta/description"], "meta/description");
        let descriptionLength = Dbm.flow.updatefunctions.basic.length(descriptionEditor.item.editValue.value);
        this.item.requireProperty("descriptionLength", 0).connectInput(descriptionLength.output.properties.length);

        itemEditor.addFieldEditor("seo/noIndex", page["seo/noIndex"], "seo/noIndex");
        itemEditor.addFieldEditor("seo/noFollow", page["seo/noFollow"], "seo/noFollow");

        this.item.requireProperty("importExportOpen", "");
        this.item.requireProperty("importText", "");
    }

    _save() {
        console.log("_save");

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;

        let saveData = editorGroup.getSaveData();
        let itemSaveData = saveData.getItemSaveData(page.id);

        let itemEditor = editorGroup.getItemEditor(page.id);
        let content = itemEditor.getEditor("content").item.editValue.getValue();

        let preloadImages = [];

        let pageEditorItem = Dbm.getInstance().repository.getItem("admin/editor/pageEditor");
        if(pageEditorItem.generateContentPreload) {
            preloadImages = pageEditorItem.generateContentPreload(content);
        }

        itemSaveData.setField("contentPreloadTags", preloadImages);
        itemSaveData.setField("lastModified", (new Date()).toISOString());
        itemSaveData.createChange("clearCache", {});

        saveData.save();
    }

    _export() {
        let editorGroup = this.item.editorGroup;

        let page = this.context.page;
        let id = page.id;
        let itemEditor = editorGroup.getItemEditor(id);
        let url = itemEditor.addFieldEditor("url").item.editValue.value.value;   
        let content = itemEditor.addFieldEditor("content").item.editValue.value.value;

        let blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        let downloadUrl = URL.createObjectURL(blob);

        let fileName = id  + Dbm.utils.StringFunctions.createNiceFilePath(url) + ".json";
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    }

    _import() {

        let editorGroup = this.item.editorGroup;

        let page = this.context.page;
        let id = page.id;
        let itemEditor = editorGroup.getItemEditor(id); 
        

        let data = JSON.parse(this.item.importText);
        console.log(data);

        let newContent = {...itemEditor.addFieldEditor("content").item.editValue.value.value};
        if(!newContent) {
            newContent = {};
        }
        if(!newContent.blocks) {
            newContent.blocks = [];
        }

        let currentArray = data.blocks;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentBlock = currentArray[i];
            delete currentBlock["id"];
            newContent.blocks.push(currentBlock);
        }
        
        itemEditor.addFieldEditor("content").item.editValue.value.value = newContent;
        this.item.editor.contentUpdatedExternally();
    }

    _generateSeoSummary() {

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.requestData("admin/seoSummary", {"value": {"title": itemEditor.getEditor("title").item.editValue.getValue(), "content": itemEditor.getEditor("content").item.editValue.getValue()}});
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [request]));

    }

    _generateHelpSectionSuggestions() {

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.requestData("admin/helpSectionSuggestions", {"value": {"title": itemEditor.getEditor("title").item.editValue.getValue(), "content": itemEditor.getEditor("content").item.editValue.getValue()}});
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._helpSectionSuggestionsLoaded.bind(this), [request]));

    }

    _dataLoaded(aRequest) {
        let summary = Dbm.objectPath(aRequest, "data.seoSummary");

        let page = this.context.page;

        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        itemEditor.getEditor("meta/description").item.editValue.item.value = summary;
    }

    _helpSectionSuggestionsLoaded(aRequest) {
        console.log("_helpSectionSuggestionsLoaded");
        let titles = Dbm.objectPath(aRequest, "data.titles");

        console.log(aRequest, titles);
    }

    _toggleImportExport() {
        console.log("_toggleImportExport");

        this.item.importExportOpen = !this.item.importExportOpen;
    }

    _renderMainElement() {

        let page = this.context.page;
        
        let editorGroup = this.item.editorGroup;
        let itemEditor = editorGroup.getItemEditor(page.id);

        let admin = Dbm.getInstance().repository.getItem("admin");
        let pageEditors = admin.requireProperty("pageEditors", []);

        return React.createElement("div", {},
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": editorGroup, "itemEditor": itemEditor}},
                React.createElement(Dbm.react.admin.EditObjectById, {id: page.id},
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
                        React.createElement("div", {className: "spacing standard"}),
                        React.createElement("div", {},
                            React.createElement("label", {className: "standard-field-label"},
                                "Publish date"
                            ),
                            React.createElement(Dbm.react.form.FormField, {"value": itemEditor.getEditor("publishDate").item.editValue.value, className: "standard-field standard-field-padding full-width", placeholder: "YYYY-MM-DD", "type": "date"}),
                        ),
                        React.createElement("div", {className: "spacing standard"}),
                        React.createElement("div", {},
                            React.createElement("label", {className: "standard-field-label"},
                                "Category"
                            ),
                            React.createElement(Dbm.react.form.GraphApiObjectSelection, {"value": itemEditor.getEditor("relation_out_in_group/pageCategory").item.editValue.value, objectType: "group/pageCategory", className: "standard-field standard-field-padding full-width"}),
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
                        ),
                        React.createElement("div", {className: "spacing standard"}),
                        React.createElement(Dbm.react.form.LabelledArea, {label: "Main image"}, 
                            React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {"direction": "in", "relationType": "isMainImageFor", "objectType": "image"},
                                React.createElement(Dbm.react.form.GraphApiImage, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), "objectType": "page", "encoding": "title", nameField: "title", className: "standard-field standard-field-padding full-width"})
                            )
                        ),
                        React.createElement("div", {className: "spacing standard"}),
                        React.createElement("div", {className: "flex-row small-item-spacing"},
                            React.createElement("div", {className: "flex-row-item"},
                                React.createElement(Dbm.react.form.Checkbox, {checked: itemEditor.getEditor("seo/noIndex").item.editValue.value}),
                                "Noindex"
                            ),
                            React.createElement("div", {className: "flex-row-item"},
                                React.createElement(Dbm.react.form.Checkbox, {checked: itemEditor.getEditor("seo/noFollow").item.editValue.value}),
                                "Nofollow"
                            ),
                        )
                    ),
                    React.createElement("div", {className: "spacing standard"}),
                    React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                        React.createElement("label", {className: "standard-field-label"},
                            "Content"
                        ),
                        React.createElement("div", {},
                            React.createElement(Dbm.react.admin.editor.Editor, {"value": itemEditor.getEditor("content").item.editValue.value, "ref": this.createRef("editor")}),
                        )
                    ),
                    React.createElement(Dbm.react.area.HasData, {check: pageEditors},
                        React.createElement("div", {className: "spacing standard"}),
                        React.createElement(Dbm.react.area.List, {items: pageEditors, as: "editor"},
                            React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                                React.createElement(Dbm.react.area.InsertElement, {element: Dbm.react.source.contextVariable("editor.element")})
                            ),
                            React.createElement("div", {className: "spacing standard", "data-slot": "spacing"}),
                        ),
                    ),
                    React.createElement("div", {className: "spacing standard"}),
                    React.createElement("div", {"className": "dbm-admin-box dbm-admin-box-padding"},
                        React.createElement("label", {className: "standard-field-label", "onClick": () => {this._toggleImportExport()}},
                            "Import/export"
                        ),
                        React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: this.item.properties.importExportOpen}, 
                            React.createElement("div", {},
                                React.createElement("div", {className: "flex-row small-item-spacing"},
                                    React.createElement("div", {className: "flex-row-item"},
                                        React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._export()}},
                                            "Export"
                                        )
                                    )
                                ),
                                React.createElement("div", {className: "spacing standard"}),
                                React.createElement(Dbm.react.form.TextArea, {value: this.item.properties.importText, className: "standard-field standard-field-padding full-width"}),
                                React.createElement("div", {className: "flex-row small-item-spacing"},
                                    React.createElement("div", {className: "flex-row-item"},
                                        React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._import()}},
                                            "Import"
                                        )
                                    )
                                )
                                /*
                                React.createElement("div", {className: "flex-row-item"},
                                    React.createElement("div", {onClick: () => {this._generateHelpSectionSuggestions()}, className: "action-button action-button-padding"}, "Dev: Help sections"),
                                ),
                                */
                            )
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
            )
        );
    }
}

