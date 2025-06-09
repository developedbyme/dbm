import React from "react";
import Dbm from "../../../../index.js";

export default class Content extends Dbm.react.BaseObject {
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
                ["urlRequest", "admin_fields"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let id = this.context.item.id;

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.form.LabelledArea, {label: "Content"},
                    React.createElement("div", {className: "standard-field standard-field-padding"},
                        React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": "content"},
                            React.createElement(Dbm.react.admin.editor.Editor, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value")})
                        )
                    )
                )
            )
            
        )
    }
}