import React from "react";
import Dbm from "../../../index.js";

export default class ObjectList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        this.item.requireProperty("items", []);

        let objectType = this.getPropValue("objectType");
        let encodings = this.getPropValueWithDefault("encodings", ["name"]);

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "byObjectType", "objectType": objectType},
                ],
                encodings
            );
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._loaded.bind(this), [request]));
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _loaded(aRequest) {
        console.log("_loaded");

        let currentArray = [].concat(aRequest.items);

        let nameField = this.getPropValueWithDefault("nameField", "name");
        Dbm.utils.ArrayFunctions.sortOnField(currentArray, nameField);
        
        this.item.items = currentArray;
    }

    _create() {
        console.log("_create");

        let objectType = this.getPropValue("objectType");
        let encodings = this.getPropValueWithDefault("encodings", ["name"]);
        let visibility = this.getPropValueWithDefault("visibility", "private");

        let changes = [
            {"type": "setField", "data": {"value": "Unnamed " + objectType, "field": "name"}}
        ];

        let types = [objectType];
        let additionalTypes = this.getPropValue("additionalTypes");
        if(additionalTypes) {
            types = types.concat(additionalTypes);
        }

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem(types, visibility, changes, encodings);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._created.bind(this), [request]));
    }

    _created(aRequest) {
        console.log("_created");
        console.log(aRequest);

        let newItems = [].concat(this.item.items);
        console.log(newItems);
        newItems.push(aRequest.item);
        this.item.items = newItems;
    }

    _renderMainElement() {
        
        let nameField = this.getPropValueWithDefault("nameField", "name");

        let id = Dbm.react.source.contextVariable("item.id");
        let text = Dbm.react.source.contextVariable("item." + nameField);

        return React.createElement("div", {"className": "standard-alternating-rows"},
            React.createElement(Dbm.react.area.List, {items: this.item.properties.items},
                React.createElement(Dbm.react.admin.objects.ObjectListRow, {"id": id, "text": text})
            ),
            React.createElement("div", {"className": "spacing standard"}),
            React.createElement("div", {"className": "flex-row"},
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement(Dbm.react.interaction.CommandButton, {"command": Dbm.commands.callFunction(this._create.bind(this))},
                        React.createElement("div", {"className": "standard-button standard-button-padding"}, "Create")
                    )
                )
            )
            
        )
    }
}