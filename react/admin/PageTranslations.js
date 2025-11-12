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
            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._pagesLoaded.bind(this), []));
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
        console.log("_updateTranslatedLanguages");
        let itemEditor = this.context.itemEditor;
        let languageEditor = itemEditor.getDefaultIncomingRelationEditor("for", "language");

        console.log(this.item.availableLanguages, languageEditor.value);

        let filteredLanguages = Dbm.utils.ArrayFunctions.filterByField(this.item.availableLanguages, "id", languageEditor.value, "!=");
        this.item.availableTranslations = filteredLanguages;
    }

    _pagesLoaded() {
        console.log("_pagesLoaded");
        console.log(this.item.pages);
    }

    _createTranslation(aLanguage) {
        console.log("_createTranslation");
        console.log(aLanguage);

        //METODO
    }

    _addToTranslation(aId) {
        //METODO
    }


    _renderMainElement() {

        let selectTranslationElement = React.createElement(Dbm.react.form.Dropdown, {},
            React.createElement("div", {"data-slot": "button"}, Dbm.react.text.text(Dbm.react.source.contextVariable("translatedLanguage.identifier"))),
            React.createElement("div", {"className": "dropdown-menu-max-height standard-dropdown"},
                React.createElement(Dbm.react.interaction.CommandButton, {"commands": [
                    Dbm.commands.callFunction(this._createTranslation.bind(this), [Dbm.react.source.contextVariable("translatedLanguage")]),
                    Dbm.commands.setProperty(Dbm.react.source.contextVariable("open"), false)
                ]},
                    React.createElement("div", {className: "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"}, "New translated page")
                ),

                React.createElement("div", {}, "Link translation"),
                React.createElement(Dbm.react.form.GraphApiObjectSelection, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), objectType: "group/translationGroup", className: "standard-field standard-field-padding full-width"})

            )
        );

        return React.createElement("div", {},
            React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {direction: "in", relationType: "for", objectType: "language"},
                React.createElement(Dbm.react.context.AddItemByIdToContext, {"id": Dbm.react.source.contextVariable("valueEditor.editValue.value"), "as": "language"},
                    React.createElement("div", {"className": "flex-row small-item-spacing"},
                        React.createElement("div", {"className": "flex-row-item"},
                            React.createElement(Dbm.react.form.Dropdown, {},
                                React.createElement("div", {"data-slot": "button"}, Dbm.react.text.text(Dbm.react.source.contextVariable("language.identifier"))),
                                React.createElement("div", {"className": "dropdown-menu-max-height standard-dropdown"},
                                    React.createElement(Dbm.react.area.List, {items: this.item.properties.availableLanguages, "as": "availableLanguage"},
                                        React.createElement(Dbm.react.interaction.CommandButton, {"commands": [
                                            Dbm.commands.setProperty(Dbm.react.source.contextVariable("valueEditor.editValue.value"), Dbm.react.source.contextVariable("availableLanguage.id")),
                                            Dbm.commands.setProperty(Dbm.react.source.contextVariable("open"), false)
                                        ]},
                                            React.createElement("div", {className: "standard-dropdown-row standard-dropdown-row-padding hover-row cursor-pointer"},
                                                Dbm.react.text.text(Dbm.react.source.contextVariable("availableLanguage.name"))
                                            )
                                        ),
                                    )
                                )
                            )
                        ),
                        React.createElement("div", {"className": "flex-row-item"},
                        
                            React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {direction: "out", relationType: "in", objectType: "group/translationGroup"},
                                React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("valueEditor.editValue.value"), checkType: ">", compareValue: 0},
                                    React.createElement(Dbm.react.admin.EditObjectById, {"id": Dbm.react.source.contextVariable("valueEditor.editValue.value")},
                                        "Translation added"
                                    ),
                                    React.createElement(Dbm.react.form.GraphApiObjectSelection, {"value": Dbm.react.source.contextVariable("valueEditor.editValue.value"), objectType: "group/translationGroup", className: "standard-field standard-field-padding full-width"})
                                ),
                                React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("valueEditor.editValue.value"), checkType: "invert/>", compareValue: 0},
                                    React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("language")},
                                        React.createElement(Dbm.react.area.List, {items: this.item.properties.availableTranslations, "as": "translatedLanguage"},
                                            selectTranslationElement
                                        )
                                    )
                                )
                            ),

                            
                        )
                    )
                )
            ),
        );
    }
}

