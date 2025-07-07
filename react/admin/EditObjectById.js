import React from "react";
import Dbm from "../../index.js";

export default class EditObjectById extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let editorGroup = this.context.editorGroup;
        if(!editorGroup) {
            editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        }
        this.item.setValue("editorGroup", editorGroup);
        

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        
        let id = this.getPropValue("id");
        console.log(id);

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

        let id = this.getPropValue("id");
        let item = Dbm.getInstance().repository.getItem(id);
        let itemEditor = this.item.editorGroup.getItemEditor(id);

        let children = this.getPropValue("children");

        return React.createElement("div", {},
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": this.item.editorGroup, "item": item, "itemEditor": itemEditor}},
                    children
                )
            )
        );
    }
}