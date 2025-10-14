import React from "react";
import Dbm from "../../../index.js";

export default class EditItem extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let item = this.context.item;
        let editorGroup = this.context.editorGroup;
        
        this._itemEditor = editorGroup.getItemEditor(item.id);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [item.id]},
                ],
                ["admin_fields", "admin_fieldTranslations", "relations", "visibility"]
            );
            allLoaded.addCheck(request.properties.status);
        }
        
        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let children = this.getPropValue("children")

        return React.createElement("div", {},
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.context.AddContextVariables, {"values": {"itemEditor": this._itemEditor}}, children)
            )
        );
    }
}