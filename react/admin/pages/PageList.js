import React from "react";
import Dbm from "../../../index.js";

export default class PageList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        this.item.requireProperty("items", []);

        let request = graphApi.requestRange(
            [
                {"type": "includePrivate"},
                {"type": "includeDraft"},
                {"type": "byObjectType", "objectType": "page"},
            ],
            ["urlRequest"]
        );
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._loaded.bind(this), [request]));
        
    }

    _loaded(aRequest) {
        console.log("_loaded");
        console.log(aRequest);

        let items = [...aRequest.items];
        let field = "url";
        items.sort(function(aA, aB) {

            let aValue = Dbm.objectPath(aA, field);
            let bValue = Dbm.objectPath(aB, field);

            if(aValue < bValue) {
                return -1;
            }
            else if(aValue < bValue) {
                return 1;
            }
            else {
                return 0;
            }
        });

        console.log(items);

        this.item.setValue("items", items);
    }

    _renderMainElement() {

        return React.createElement("div", {"className": "centered-site"},
            React.createElement(Dbm.react.area.List, {"items": this.item.properties.items},
                React.createElement("div", {},
                    React.createElement(Dbm.react.text.Link, {"href": Dbm.react.source.contextVariable("item.url")}, 
                        Dbm.react.text.text(Dbm.react.source.contextVariable("item.url")),
                        " - ",
                        Dbm.react.text.text(Dbm.react.source.contextVariable("item.title")),
                    )
                )
            )
        );
    }
}

