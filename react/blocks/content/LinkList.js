import React from "react";
import Dbm from "../../../index.js";

export default class LinkList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let listId = this.context.blockData.list;

        this.item.requireProperty("loaded", false);
        this.item.requireProperty("items", []);

        let graphApi = Dbm.getInstance().repository.getItem("cachedGraphApi").controller;
        {
            let request = graphApi.requestRange(
                [
                    {type: "objectRelationQuery", "path": "in:in:linkPreview", "fromIds": [listId]}
                ],
                ["linkPreview"]
            );
            
            this.item.requireProperty("loadedStatus", 0);
            Dbm.flow.addUpdateCommandWhenMatched(this.item.properties.loadedStatus, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._loaded.bind(this), [request]));
            this.item.properties.loadedStatus.connectInput(request.properties.status);
        }
    }

    _loaded(aRequest) {
      console.log("LinkList::_loaded");
      console.log(aRequest);

      let items = aRequest.items;

      let today = (new Date()).toISOString().split("T")[0];
      items = Dbm.utils.ArrayFunctions.filterByField(items, "page", null, function(aItem) {
        if(aItem && aItem.publishDate) {
          if(aItem.publishDate > today) {
            return false;
          }
          return true;
        }
        
        return false;
      });

      Dbm.utils.ArrayFunctions.sortOnField(items, "page.publishDate");
      items.reverse();

      this.item.items = items;
      this.item.loaded = true;
    }

    _renderMainElement() {

      let element = Dbm.getInstance().repository.getItem("linkListCard").element;

        return React.createElement("div", {"className": "content-narrow"},
          React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
            React.createElement(Dbm.react.area.List, {items: this.item.properties.items},
              element,
              React.createElement("div", {"data-slot": "spacing", "className": "spacing small"})
            )
          )

        );
    }
}