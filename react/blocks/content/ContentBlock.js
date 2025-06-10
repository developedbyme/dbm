import React from "react";
import Dbm from "../../../index.js";

export default class ContentBlock extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let contentBlockId = this.context.blockData.contentBlock;

        this.item.requireProperty("item", null);

        let graphApi = Dbm.getInstance().repository.getItem("cachedGraphApi").controller;
        {
            let request = graphApi.requestRange(
                [
                    {type: "idSelection", "ids": [contentBlockId]}
                ],
                ["content"]
            );
            
            this.item.requireProperty("loadedStatus", 0);
            Dbm.flow.addUpdateCommandWhenMatched(this.item.properties.loadedStatus, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._loaded.bind(this), [request]));
            this.item.properties.loadedStatus.connectInput(request.properties.status);
        }
    }

    _loaded(aRequest) {
      console.log("_loaded");
      this.item.item = aRequest.items[0];
      console.log(aRequest);
    }

    _renderMainElement() {

      let element = Dbm.getInstance().repository.getItem("contentBlock").element;

        return React.createElement("div", {}, 
          React.createElement(Dbm.react.area.HasData, {check: this.item.properties.item},
            React.createElement(Dbm.react.context.AddItemToContext, {item: this.item.properties.item, "as": "page"},
              element
            )
          )

        );
    }
}