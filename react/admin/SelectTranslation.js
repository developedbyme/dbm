import React from "react";
import Dbm from "../../index.js";

export default class SelectTranslation extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("availablePages", []);

        {
            let request = Dbm.getGraphApi().requestRange([{"type": "byObjectType", "objectType": "page"}], ["urlRequest"]);
            this.item.propertyInput("pages", request.properties.items);
            Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._pagesLoaded.bind(this), []));
        }
    }

    _pagesLoaded() {
        let language = this.context.language;
        let translationLanguage = this.context.translationLanguage;

        let availablePages = Dbm.utils.TranslationFunctions.getPagesForTranslation(this.item.pages, language, translationLanguage);

        this.item.availablePages = availablePages;
    }

    _pageSelected(aPage) {
        let commands = this.getPropValue("commands");
        if(!commands) {
            commands = this.getPropValue("command");
        }
        if(commands) {
            commands = Dbm.utils.ArrayFunctions.singleOrArray(commands);

            let currentArray = commands;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let command = currentArray[i];
                try {
                    command.perform(this, {"page": aPage});
                }
                catch(theError) {
                    console.error("Error while running command", theError, command);
                }
                
            }
        }
        else{
            console.warn("SelectTranslation doesn't have any commands", this);
        }
    }

    _renderMainElement() {

        let children = this.getPropValue("children");
        if(!children) {
            children = React.createElement("div", {"className": "cursor-pointer"},
                Dbm.react.text.text(Dbm.react.source.contextVariable("translatedPage.url")),
                " - ",
                Dbm.react.text.text(Dbm.react.source.contextVariable("translatedPage.title"))
            )
        }

        return React.createElement(React.Fragment, {},
            React.createElement(Dbm.react.area.List, {items: this.item.properties.availablePages, "as": "translatedPage"},
                React.createElement(Dbm.react.interaction.CommandButton, {"command": Dbm.commands.callFunction(this._pageSelected.bind(this), [Dbm.react.source.contextVariable("translatedPage")])},
                    children
                )
            )
        );
    }
}

