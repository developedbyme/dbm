import React from "react";
import Dbm from "../../index.js";

export default class EditTranslationGroup extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("translations", []);
        this.item.requireProperty("missingLanguages", []);

        let updateTranslationsCommand = Dbm.commands.callFunction(this._updateActiveTranslations.bind(this));

        let itemEditor = this.context.itemEditor;
        let language = this.context.language;

        let editor = itemEditor.getAdminMultipleIncomingRelationsEditor("in", "page");
       

        Dbm.flow.addUpdateCommand(editor.valueProperty, updateTranslationsCommand);
        Dbm.flow.addUpdateCommand(this.item.requireProperty("availableLanguages", []), updateTranslationsCommand);
        
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

    _updateActiveTranslations() {
        console.log("_updateActiveTranslations");
        let itemEditor = this.context.itemEditor;
        let language = this.context.language;

        let availableTranslatedLanguages = Dbm.utils.ArrayFunctions.filterByField(this.item.availableLanguages, "id", language.id, "!==");

        let editor = itemEditor.getAdminMultipleIncomingRelationsEditor("in", "page");

        let allTranslations = Dbm.getInstance().repository.getItems(editor.value);
        let translations = Dbm.utils.ArrayFunctions.filterByField(allTranslations, "language", availableTranslatedLanguages, "inArray");

        let missingLanguages = Dbm.utils.TranslationFunctions.getMissingTranslations(allTranslations, availableTranslatedLanguages);

        this.item.translations = translations;
        this.item.missingLanguages = missingLanguages;
    }

    _createTranslation(aLanguage) {
        console.log("_createTranslation");
        console.log(aLanguage);

        //METODO:
    }

    _addTranslation(aPage) {
        console.log("_addTranslation");
        console.log(aPage);

        let itemEditor = this.context.itemEditor;
        let editor = itemEditor.getAdminMultipleIncomingRelationsEditor("in", "page");

        let newValues = [].concat(editor.value);
        newValues.push(aPage.id);
        editor.value = newValues;

        console.log(editor.value);
    }

    _renderMainElement() {

        return React.createElement("div", {},
            React.createElement(Dbm.react.area.List, {items: this.item.properties.translations, "as": "translation"},
                React.createElement("div", {"className": "language-circle centered-cell-holder"}, Dbm.react.text.text(Dbm.react.source.contextVariable("translation.language.identifier")))
            ),
            React.createElement(Dbm.react.area.List, {items: this.item.properties.missingLanguages, "as": "translationLanguage"},
                React.createElement(Dbm.react.form.Dropdown, {},
                    React.createElement("div", {"data-slot": "button", "className": "language-circle centered-cell-holder"},
                        Dbm.react.text.text(Dbm.react.source.contextVariable("translationLanguage.identifier")),
                        "+"
                    ),
                    React.createElement("div", {"className": "dropdown-menu-max-height standard-dropdown"},
                        React.createElement(Dbm.react.interaction.CommandButton, {"commands": [
                            Dbm.commands.callFunction(this._createTranslation.bind(this), [Dbm.react.source.contextVariable("translatedLanguage")]),
                            Dbm.commands.setProperty(Dbm.react.source.contextVariable("open"), false)
                        ]},
                            React.createElement("div", {className: "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"}, "Create page")
                        ),

                        React.createElement("div", {}, "Link translation"),
                        React.createElement(Dbm.react.admin.SelectTranslation, {"commands": [Dbm.commands.callFunction(this._addTranslation.bind(this), [Dbm.core.source.event("page")])]},
                            React.createElement("div", {"className": "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"},
                                Dbm.react.text.text(Dbm.react.source.contextVariable("translatedPage.url")),
                                " - ",
                                Dbm.react.text.text(Dbm.react.source.contextVariable("translatedPage.title"))
                            )
                        )
                    )
                )
            )
        );
    }
}

