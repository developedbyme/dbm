import React from "react";
import Dbm from "../../index.js";

export default class EditObject extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let editorGroup = this.context.editorGroup;
        if(!editorGroup) {
            editorGroup = new Dbm.graphapi.webclient.admin.EditorGroup();
        }
        this.item.setValue("editorGroup", editorGroup);
        

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        
        let item = this.getPropValue("item");

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [item.id]},
                ],
                ["admin_fields", "admin_fieldTranslations", "relations", "url", "identifier", "visibility"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let item = this.getPropValue("item");
        let itemEditor = this.item.editorGroup.getItemEditor(item.id);

        let children = this.getPropValue("children");

        return React.createElement(React.Fragment, {},
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.context.AddContextVariables, {values: {"editorGroup": this.item.editorGroup, "item": item, "itemEditor": itemEditor}},
                    children
                )
            )
        );
    }
}