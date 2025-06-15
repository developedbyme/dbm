import React from "react";
import Dbm from "../../../../index.js";

export default class LinkedPage extends Dbm.react.BaseObject {
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
                React.createElement(Dbm.react.form.LabelledArea, {label: "Link text"}, 
                    React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "linkText"},
                        React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                    )
                ),
                React.createElement(Dbm.react.form.LabelledArea, {label: "Linked page"}, 
                    React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {"direction": "out", "relationType": "for", "objectType": "page"},
                        React.createElement(Dbm.react.form.GraphApiObjectSelection, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), "objectType": "page", "encoding": "title", nameField: "title", className: "standard-field standard-field-padding full-width"})
                    )
                )
            )
            
        )
    }
}