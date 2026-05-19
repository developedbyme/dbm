import React from "react";
import Dbm from "../../../../index.js";

export default class Relation extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("loaded", false);

    }

    _constructAfterProps() {

        super._constructAfterProps();

        let relation = this.getPropValue("relation");
        let objectId = Dbm.objectPath(relation, this.getPropValue("objectLink") + ".id");

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);

        {
            let request = Dbm.getGraphApi().requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "idSelection", "ids": [objectId]},
                ],
                ["name", "identifier"]
            );
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _renderMainElement() {

        let relation = this.getPropValue("relation");
        let objectId = Dbm.objectPath(relation, this.getPropValue("objectLink") + ".id");

        let url = "/admin/items/item/?id=" + objectId;

        return this._createMainElement("div", {},
            React.createElement(Dbm.react.text.Link, {"href": url, "className": "custom-styled-link"},
                React.createElement("div", {"className": "flex-row small-item-spacing"},
                    React.createElement("div", {"className": "flex-row-item"},
                        Dbm.react.text.text(objectId)
                    ),
                    React.createElement("div", {"className": "flex-row-item"},
                        React.createElement(Dbm.react.area.HasData, {"check": this.item.properties.loaded},
                            React.createElement(Dbm.react.context.AddItemByIdToContext, {"id": objectId},
                                Dbm.react.text.text(Dbm.react.source.item("name"))
                            )
                        )
                    )
                ),
                React.createElement("div", {"className": "small-description"},
                    React.createElement(Dbm.react.area.HasData, {"check": this.item.properties.loaded},
                        React.createElement(Dbm.react.context.AddItemByIdToContext, {"id": objectId},
                            Dbm.react.text.text(Dbm.react.source.item("identifier"))
                        )
                    )
                )
            )
        )
    }
}