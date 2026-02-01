import React from "react";
import Dbm from "../../index.js";

export default class GraphApiObjectSelection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("value", "");
        this.item.requireProperty("items", []);

        let objectType = this.getPropValue("objectType");
        let encodings = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(this.getPropValueWithDefault("encoding", "name"), ",", true);

        {
            let request = Dbm.getGraphApi().requestRange(
                [
                    {"type": "byObjectType", "objectType": objectType},
                    {"type": "includeDraft"},
                    {"type": "includePrivate"}
                ],
                encodings
            );
            
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._itemsLoaded.bind(this), [request]));
        }
    }

    _itemsLoaded(aRequest) {
        let options = [];

        options.push(React.createElement("option", {key: 0, value: 0}, "None"));

        let nameField = this.getPropValue("nameField");
        if(!nameField) {
            nameField = "name";
        }

        let currentArray = [].concat(aRequest.items);
        Dbm.utils.ArrayFunctions.naturalSortOnField(currentArray, nameField);

        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            options.push(React.createElement("option", {key: currentItem["id"], value: currentItem["id"]}, currentItem[nameField] + " (id: " + currentItem["id"] + ")"));
        }

        this.item.items = options;
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value");

        return this._createMainElement(Dbm.react.form.Selection, {"value": value}, this.item.properties.items);
    }
}

