import React from "react";
import Dbm from "../../../../index.js";

export default class SingleRelation extends Dbm.react.BaseObject {
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

        let label = this.getPropValue("label");
        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");
        let encoding = this.getPropValueWithDefault("encoding", "name");
        let nameField = this.getPropValueWithDefault("nameField", "name");

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.form.LabelledArea, {label: label}), 
                React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {"direction": direction, "relationType": relationType, "objectType": objectType},
                    React.createElement(Dbm.react.form.GraphApiObjectSelection, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), "objectType": objectType, "encoding": encoding, nameField: nameField, className: "standard-field standard-field-padding full-width"})
                )
            )
            
        )
    }
}