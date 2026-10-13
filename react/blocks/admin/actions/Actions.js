import React from "react";
import Dbm from "../../../../index.js";

export default class Actions extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("items", []);

        let currentUrl = new URL(document.location.href);

        let startDate = currentUrl.searchParams.get("date");
        if(!startDate) {
            startDate = (new Date()).toISOString().split("T")[0];
        }

        let date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + 1);

        let endDate = date.toISOString().split("T")[0];

        Dbm.graphapi.webclient.loadRange([{"type": "byObjectType", "objectType": "action"}, {"type": "includePrivate"}, {"type": "inDateRange", "startDate": startDate, "endDate": endDate}], ["action"], this._actionsLoaded.bind(this))
    }

    _actionsLoaded(aItems) {
        console.log("_actionsLoaded");
        console.log(aItems);

        let sortedItems = [...aItems];
        Dbm.utils.ArrayFunctions.sortOnField(sortedItems, "creationDate");
        sortedItems.reverse();

        this.item.items = sortedItems;
    }

    _renderMainElement() {

        return React.createElement("div", {className: "standard-alternating-rows"}, 
            React.createElement(Dbm.react.area.List, {"items": this.item.properties.items},
                React.createElement("div", {"className": "standard-row standard-row-padding"},
                    React.createElement("div", {"className": "flex-row small-item-spacing"},
                        React.createElement("div", {"className": "flex-no-resize"},
                            Dbm.react.text.sourced.fromContext("item.id")
                        ),
                        React.createElement("div", {"className": "flex-no-resize"},
                            Dbm.react.text.sourced.fromContext("item.status.name"),
                        ),
                        React.createElement("div", {"className": "flex-no-resize"},
                            Dbm.react.text.sourced.fromContext("item.type.name"),
                            Dbm.react.text.sourced.fromContext("item.data")
                        ),
                        React.createElement("div", {"className": "flex-resize"},
                            Dbm.react.text.sourced.fromContext("item.from.id")
                        ),
                        React.createElement("div", {"className": "flex-no-resize"},
                            Dbm.react.text.sourced.fromContext("item.creationDate")
                        )
                    )
                    
                )
            )
        );
    }
}