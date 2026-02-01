import React from "react";
import Dbm from "../../../../index.js";

export default class SingleRelation extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getGraphApi();

        let id = this.context.item.id;

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let selects = [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [id]},
            ];

            if(this.getPropValue("anyStatus")) {
                selects = [
                    {"type": "includeAnyStatus"},
                    {"type": "idSelection", "ids": [id]},
                ];
            }

            console.log(selects);

            let request = graphApi.requestRange(
                selects,
                ["admin_fields", "relations"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let id = this.context.item.id;

        let label = this.getPropValue("label");
        let labelElement = label ? React.createElement(Dbm.react.form.LabelledArea, {label: label}) : null;
        let direction = this.getPropValue("direction");
        let relationType = this.getPropValue("relationType");
        let objectType = this.getPropValue("objectType");
        let encoding = this.getPropValueWithDefault("encoding", "name");
        let nameField = this.getPropValueWithDefault("nameField", "name");

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                labelElement, 
                React.createElement(Dbm.react.admin.editorsgroup.EditRelation, {"direction": direction, "relationType": relationType, "objectType": objectType},
                    React.createElement(Dbm.react.form.GraphApiObjectSelection, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), "objectType": objectType, "encoding": encoding, nameField: nameField, anyStatus: this.getPropValue("anyStatus"), className: "standard-field standard-field-padding full-width"})
                )
            )
            
        )
    }
}