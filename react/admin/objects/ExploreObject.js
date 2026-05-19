import React from "react";
import Dbm from "../../../index.js";

export default class ExploreObject extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let id = this.getPropValue("id");

        this.item.requireProperty("fields", []);
        this.item.requireProperty("incomingRelations", []);
        this.item.requireProperty("outgoingRelations", []);

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false).addUpdate(this._getScopedCallFunctionCommand(this._loaded));

        {
            let request = Dbm.getGraphApi().requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [id]},
                ],
                ["objectTypes", "name", "identifier", "admin_fields", "relations"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _loaded() {
        let id = this.getPropValue("id");
        let item = Dbm.repository.getItem(id);
        console.log(">>>>>>>>>>", item);

        let encodedFields = [];
        let fields = item.fields;
        for(let fieldName in fields) {
            encodedFields.push({"name": fieldName, "value": fields[fieldName]});
        }

        this.item.fields = encodedFields;

        this.item.incomingRelations = Dbm.utils.ArrayFunctions.sortOnField([].concat(item["relations/in"]["all"]), "type");
        this.item.outgoingRelations = Dbm.utils.ArrayFunctions.sortOnField([].concat(item["relations/out"]["all"]), "type");
        console.log(this.item.incomingRelations);
    }

    _renderMainElement() {

        let id = this.getPropValue("id");
        let item = Dbm.repository.getItem(id);

        return React.createElement("div", {},
            
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement(Dbm.react.context.AddItemByIdToContext, {"id": id},
                   
                    React.createElement("h2", {"className": "no-margins"},
                        Dbm.react.text.text(Dbm.react.source.item("id")),
                        " - ",
                        Dbm.react.text.text(Dbm.react.source.item("name")),
                    ),
                    React.createElement("div", {"className": "small-description"},
                        Dbm.react.text.text(Dbm.react.source.item("identifier"))
                    ),
                    React.createElement("div", {"className": "spacing small"}),
                    React.createElement(Dbm.react.area.List, {items: Dbm.react.source.item("objectTypes"), className: "inline-list standard-tag-list standard-tag-list-expand", "as": "objectType", "keyField": "(root)"},
                        React.createElement("div", {"className": "standard-tag standard-tag-padding standard-tag-list-item inline-list-item display-inline-block"},
                            Dbm.react.text.text(Dbm.react.source.contextVariable("objectType"))
                        )
                    ),
                    React.createElement("div", {"className": "spacing small"}),
                    React.createElement(Dbm.react.area.List, {items: this.item.properties.fields, "as": "field", "keyField": "name"},
                        React.createElement("div", {},
                            React.createElement("div", {},
                                Dbm.react.text.text(Dbm.react.source.contextVariable("field.name"))
                            ),
                            React.createElement("div", {},
                                Dbm.react.text.text(Dbm.react.source.contextVariable("field.value"))
                            )
                        )
                    ),
                    React.createElement("div", {"className": "spacing small"}),
                    React.createElement("div", {"className": "flex-row small-item-spacing halfs"},
                        React.createElement("div", {"className": "flex-row-item"},
                            React.createElement(Dbm.react.area.List, {items: this.item.properties.incomingRelations, "keyField": "type"},
                                React.createElement(Dbm.react.admin.objects.explore.RelationType, {"objectLink": "from"})
                            ),
                        ),
                        React.createElement("div", {"className": "flex-row-item"},
                            React.createElement(Dbm.react.area.List, {items: this.item.properties.outgoingRelations, "keyField": "type"},
                                React.createElement(Dbm.react.admin.objects.explore.RelationType, {"objectLink": "to"})
                            ),
                        )
                    )
                )
            )
            
        )
    }
}