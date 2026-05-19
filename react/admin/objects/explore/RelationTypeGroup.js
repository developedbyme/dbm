import React from "react";
import Dbm from "../../../../index.js";

export default class RelationTypeGroup extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let objectLink = this.getPropValue("objectLink");

        return this._createMainElement("div", {},
            React.createElement("div", {}, 
                Dbm.react.text.text(this.getPropValue("name"))
            ),
            React.createElement(Dbm.react.area.List, {"items": this.getPropValue("relations"), "as": "relationWithType"},
                React.createElement(Dbm.react.admin.objects.explore.Relation, {"relation": Dbm.react.source.contextVariable("relationWithType.relation"), "objectLink": objectLink})
            )
        )
    }
}