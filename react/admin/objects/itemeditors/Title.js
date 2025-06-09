import React from "react";
import Dbm from "../../../../index.js";

export default class Title extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let id = this.context.item.id;

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [id]},
                ],
                ["title"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let id = this.context.item.id;

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.form.LabelledArea, {label: "Title"}, 
                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "title"},
                        React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                    )
                )
            )
            
        )
    }
}