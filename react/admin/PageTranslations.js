import React from "react";
import Dbm from "../../index.js";

export default class PageTranslations extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let updateTranslationsCommand = Dbm.commands.callFunction(this._updateTranslatedLanguages.bind(this));

        let itemEditor = this.context.itemEditor;
        let languageEditor = itemEditor.getDefaultIncomingRelationEditor("for", "language");
        Dbm.flow.addUpdateCommand(languageEditor.valueProperty, updateTranslationsCommand);



        Dbm.flow.addUpdateCommand(this.item.requireProperty("availableLanguages", []), updateTranslationsCommand);
        this.item.requireProperty("availableTranslations", [])

        {
            let request = Dbm.getGraphApi().requestRange([{"type": "byObjectType", "objectType": "page"}], ["urlRequest"]);
            this.item.propertyInput("pages", request.properties.items);
        }
        
        {
            let request = Dbm.getGraphApi().requestRange([{"type": "byObjectType", "objectType": "language"}], ["type"]);
            this.item.propertyInput("languages", request.properties.items);
            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._languagesLoaded.bind(this), []));
        }
    }

    _languagesLoaded() {
        //console.log("_languagesLoaded");
        //console.log(this.item.languages);

        let availableLanguageCodes = Dbm.utils.ArrayFunctions.mapField(Dbm.getRepositoryItem("site").availableLanguages, "code");

        let filteredLanguages = Dbm.utils.ArrayFunctions.filterByField(this.item.languages, "identifier", availableLanguageCodes, "inArray");
        this.item.availableLanguages = filteredLanguages;
    }

    _updateTranslatedLanguages() {
        //console.log("_updateTranslatedLanguages");
        let itemEditor = this.context.itemEditor;
        let languageEditor = itemEditor.getDefaultIncomingRelationEditor("for", "language");

        let filteredLanguages = Dbm.utils.ArrayFunctions.filterByField(this.item.availableLanguages, "id", languageEditor.value, "!=");
        this.item.availableTranslations = filteredLanguages;
    }

    _createTranslation(aLanguage) {
        console.log("_createTranslation");
        console.log(aLanguage);

        let itemEditor = this.context.itemEditor;
        let currentPage = itemEditor.item.editedItem;
        console.log(currentPage, this.item.pages);

        let currentUrl = currentPage.url;
        let newUrl = "/" + aLanguage.identifier + currentUrl;
        if(currentUrl !== "/") {
            let tempArray = currentUrl.split("/");
            console.log(currentUrl, tempArray);
            tempArray.pop(); //MENOTE: remove trailing slash
            let currentSlug = tempArray.pop();
            let parentUrl = tempArray.join("/") + "/";
            console.log(parentUrl);
            let parentPage = Dbm.utils.ArrayFunctions.getItemByIfExists(this.item.pages, "url", parentUrl);
            let translations = Dbm.objectPath(parentPage, "translations.pages");
            console.log(parentPage, translations);
            if(translations) {
                let translationInLanguage = Dbm.utils.ArrayFunctions.getItemByIfExists(translations, "language", aLanguage);
                console.log(translationInLanguage);
                if(translationInLanguage) {
                    newUrl = translationInLanguage.url + currentSlug + "/";
                }
            }
        }

        console.log(newUrl);

        let currentDate = (new Date()).toISOString().split("T")[0];

        let changes = [
            {"type": "setField", "data": {"value": currentPage.title, "field": "title"}},
            {"type": "setField", "data": {"value": currentDate, "field": "publishDate"}},
            {"type": "setUrl", "data": {"value": newUrl}},
            {"type": "addIncomingRelation", "data": {"value": aLanguage.id, "type": "for"}}
        ]

        let request = Dbm.getGraphApi().createItem(["page"], "public", changes, ["urlRequest"]);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._pageCreated.bind(this), [Dbm.core.source.staticObject(request, "item")]));
    }

    _pageCreated(aPage) {
        let itemEditor = this.context.itemEditor;
        let currentPage = itemEditor.item.editedItem;

        let request = this._createTranslationGroup();
        Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._addPageToGroup.bind(this), [Dbm.core.source.staticObject(request, "item"), aPage]));
        Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._addPageToGroup.bind(this), [Dbm.core.source.staticObject(request, "item"), currentPage]));
        Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._groupCreated.bind(this), [request, Dbm.core.source.staticObject(request, "item")]));
    }

    _addToTranslation(aPage) {
        console.log("_createTranslation");
        console.log(aPage);

        let itemEditor = this.context.itemEditor;
        let currentPage = itemEditor.item.editedItem;

        let exisitingTranslationGroup = Dbm.objectPath(aPage, "translations");
        if(!exisitingTranslationGroup) {
            let request = this._createTranslationGroup();
            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._addPageToGroup.bind(this), [Dbm.core.source.staticObject(request, "item"), aPage]));
            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._addPageToGroup.bind(this), [Dbm.core.source.staticObject(request, "item"), currentPage]));
            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._groupCreated.bind(this), [request, Dbm.core.source.staticObject(request, "item")]));
        }
        else {
            this._loadTranslationGroup();
        }
    }

    _createTranslationGroup() {

        let itemEditor = this.context.itemEditor;
        let currentPage = itemEditor.item.editedItem;

        let changes = [
            {"type": "setField", "data": {"value": currentPage.title, "field": "name"}}
        ];

        let request = Dbm.getGraphApi().createItem(["group/translationGroup", "group"], "draft", changes, ["admin_fields", "admin_fieldTranslations", "relations", "visibility"]);

        return request;
    }

    _addPageToGroup(aGroup, aPage) {
        let editorGroup = this.context.editorGroup;

        let itemEditor = editorGroup.getItemEditor(aGroup.id);

        let editor = itemEditor.getAdminMultipleIncomingRelationsEditor("in", "page");

        let newValues = [].concat(editor.value);
        newValues.push(aPage.id);
        editor.value = newValues;
    }

    _groupCreated(aRequest, aGroup) {
        console.log("_groupCreated");
        console.log(aRequest, aGroup);

        let editorGroup = this.context.editorGroup;

        let groupItemEditor = editorGroup.getItemEditor(aGroup.id);
        groupItemEditor.getVisibilityEditor("draft").value = "public";

        let itemEditor = this.context.itemEditor;
        let currentPage = itemEditor.item.editedItem;

        let relationEditor = itemEditor.getDefaultOutgoingRelationEditor("in", "group/translationGroup");
        relationEditor.value = aGroup.id;
    }

    _loadTranslationGroup() {

    }

    _renderMainElement() {

        let selectTranslationElement = React.createElement(Dbm.react.form.Dropdown, {},
            React.createElement("div", {"data-slot": "button", "className": "language-circle centered-cell-holder"}, Dbm.react.text.text(Dbm.react.source.contextVariable("translationLanguage.identifier"))),
            React.createElement("div", {"className": "dropdown-menu-max-height standard-dropdown"},
                React.createElement(Dbm.react.interaction.CommandButton, {"commands": [
                    Dbm.commands.callFunction(this._createTranslation.bind(this), [Dbm.react.source.contextVariable("translationLanguage")]),
                    Dbm.commands.setProperty(Dbm.react.source.contextVariable("open"), false)
                ]},
                    React.createElement("div", {className: "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"}, "New translated page")
                ),

                React.createElement("div", {"className": "standard-field-label"}, "Link translation"),
                React.createElement(Dbm.react.admin.SelectTranslation, {"commands": [
                    Dbm.commands.callFunction(this._addToTranslation.bind(this), [Dbm.core.source.event("page")]),
                    Dbm.commands.setProperty(Dbm.react.source.contextVariable("open"), false)
                ]},
                    React.createElement("div", {"className": "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"},
                        Dbm.react.text.text(Dbm.react.source.contextVariable("translatedPage.url")),
                        " - ",
                        Dbm.react.text.text(Dbm.react.source.contextVariable("translatedPage.title"))
                    )
                )
            )
        );

        return React.createElement("div", {},
            React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {direction: "in", relationType: "for", objectType: "language"},
                React.createElement(Dbm.react.context.AddItemByIdToContext, {"id": Dbm.react.source.contextVariable("valueEditor.editValue.value"), "as": "language"},
                    React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {direction: "out", relationType: "in", objectType: "group/translationGroup"},
                        React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("valueEditor.editValue.value"), checkType: ">", compareValue: 0},
                            React.createElement(Dbm.react.admin.EditObjectById, {"id": Dbm.react.source.contextVariable("valueEditor.editValue.value")},
                                React.createElement(Dbm.react.admin.EditTranslationGroup, {})
                            )
                        ),
                        React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("valueEditor.editValue.value"), checkType: "invert/>", compareValue: 0},
                            React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("language.id")},
                                React.createElement(Dbm.react.area.List, {items: this.item.properties.availableTranslations, "as": "translationLanguage"},
                                    selectTranslationElement
                                )
                            )
                        )
                    )
                )
            ),
        );
    }
}

