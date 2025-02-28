import React from "react";
import Dbm from "../../index.js";

export default class SelectImageFromLibrary extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("loaded", false);
        this.item.requireProperty("rows", []);

        this._selectCommand = Dbm.commands.callFunction(this._selected.bind(this), [Dbm.react.source.contextVariable("item")]);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        let request = graphApi.requestRange(
            [
                {"type": "byObjectType", "objectType": "image"}
            ],
            ["name", "image"]
        );

        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [request]));
    }

    _dataLoaded(aRequest) {
        console.log("_dataLoaded");
        console.log(aRequest);

        //METODO: create rows
        this.item.rows = aRequest.items;

        this.item.loaded = true;
    }

    _selected(aImage) {
        console.log("_selected");
        console.log(aImage);

        Dbm.commands.performCommands(this.getPropValue("selectedCommands"), this, aImage);
    }

    _renderMainElement() {

        return React.createElement("div", {},
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
                React.createElement("div", {className: "flex-row"},
                    React.createElement(Dbm.react.area.List, {items: this.item.properties.rows},
                        React.createElement(Dbm.react.interaction.CommandButton, {command: this._selectCommand},
                            React.createElement(Dbm.react.image.WidthScaledImage, {image: Dbm.react.source.contextVariable("item"), className: "background-contain image-library-preview"})
                        )
                    )
                )
            )
        );
    }
}

