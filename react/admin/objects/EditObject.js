import React from "react";
import Dbm from "../../../index.js";

export default class EditObject extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let id = this.getPropValue("id");

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [id]},
                ],
                ["objectTypes"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

   

    _renderMainElement() {

        let id = this.getPropValue("id");
        let item = Dbm.getInstance().repository.getItem(id);
        let itemEditor = this.context.editorGroup.getItemEditor(id);

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.context.AddContextVariables, {"values": {"item": item, "itemEditor": itemEditor}},
                    React.createElement(Dbm.react.area.List, {items: Dbm.react.source.contextVariable("item.objectTypes"), "as": "objectType", "keyField": "(root)"},
                        Dbm.react.text.text(Dbm.react.source.contextVariable("objectType"))
                    ),
                    React.createElement(Dbm.react.area.List, {items: Dbm.react.source.contextVariable("item.objectTypes"), "as": "objectType", "keyField": "(root)"},
                        React.createElement(Dbm.react.admin.objects.InjectObjectTypeEditor, {type: Dbm.react.source.contextVariable("objectType")})
                    )
                )
            )
            
        )
    }
}