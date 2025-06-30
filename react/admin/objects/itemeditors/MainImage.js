import React from "react";
import Dbm from "../../../../index.js";

export default class MainImage extends Dbm.react.BaseObject {
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
                ["admin_fields", "relations"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let id = this.context.item.id;

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.form.LabelledArea, {label: "Main image"}, 
                    React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {"direction": "in", "relationType": "isMainImageFor", "objectType": "image"},
                        React.createElement(Dbm.react.form.GraphApiImage, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), "objectType": "page", "encoding": "title", nameField: "title", className: "standard-field standard-field-padding full-width"})
                    )
                )
            )
            
        )
    }
}