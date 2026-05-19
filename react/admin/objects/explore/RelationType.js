import React from "react";
import Dbm from "../../../../index.js";

export default class RelationType extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let relationType = this.context.item;
        let objectLink = this.getPropValue("objectLink");
        

        let allTypedRelations = [];

        let currentArray = relationType.allRelations;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentRelation = currentArray[i];

            let currentArray2 = Dbm.objectPath(currentRelation, objectLink + ".objectTypes");
            let currentArray2Length = currentArray2.length;
            for(let j = 0; j < currentArray2Length; j++) {
                allTypedRelations.push({"type": currentArray2[j], "relation": currentRelation})
            }
        }

        let groups = Dbm.utils.ArrayFunctions.sortOnField(Dbm.utils.ArrayFunctions.group(allTypedRelations, "type"), "key");

        return this._createMainElement("div", {},
            React.createElement("div", {}, Dbm.react.text.text(Dbm.react.source.item("type"))),
            React.createElement(Dbm.react.area.List, {"items": groups, "as": "typeGroup"},
                React.createElement(Dbm.react.admin.objects.explore.RelationTypeGroup, {"name": Dbm.react.source.contextVariable("typeGroup.key"), "relations": Dbm.react.source.contextVariable("typeGroup.value"), "objectLink": objectLink})
            ),
        )
    }
}