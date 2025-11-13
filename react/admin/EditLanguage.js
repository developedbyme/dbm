import React from "react";
import Dbm from "../../index.js";

export default class EditLanguage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("availableLanguages", []);
        
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

    _renderMainElement() {

        return React.createElement("div", {},
            React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {direction: "in", relationType: "for", objectType: "language"},
                React.createElement(Dbm.react.context.AddItemByIdToContext, {"id": Dbm.react.source.contextVariable("valueEditor.editValue.value"), "as": "language"},
                    
                            React.createElement(Dbm.react.form.Dropdown, {},
                                React.createElement("div", {"data-slot": "button", "className": "standard-field standard-field-padding"},
                                    React.createElement("div", {className: "flex-row micro-item-spacing vertically-center-items"},
                                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                                            React.createElement("div", {className: "language-circle centered-cell-holder"},

                                            )
                                        ),
                                        React.createElement("div", {className: "flex-row-item flex-resize"},
                                            Dbm.react.text.text(Dbm.react.source.contextVariable("language.name"))
                                        ),
                                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                                            "v"
                                        )
                                    )
                                ),
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
                        
                )
            ),
        );
    }
}

