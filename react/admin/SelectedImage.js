import React from "react";
import Dbm from "../../index.js";

export default class SelectedImage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let id = this.getPropValue("id");
        this.item.requireProperty("item", null);
        this.item.requireProperty("loaded", false);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        let request = graphApi.requestRange(
            [
                {"type": "idSelection", "ids": [id]}
            ],
            ["name", "image"]
        );

        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._dataLoaded.bind(this), [request]));
    }

    _dataLoaded(aRequest) {
        console.log("_dataLoaded");
        console.log(aRequest);

        this.item.item = aRequest.items[0];

        this.item.loaded = true;
    }

    _renderMainElement() {
        return React.createElement("div", {}, 
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.item}, 
                React.createElement(Dbm.react.context.AddItemToContext, {item: this.item.properties.item},
                    React.createElement("div", {className: "flex-row small-item-spacing"},
                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                            React.createElement(Dbm.react.image.WidthScaledImage, {"image": Dbm.react.source.contextVariable("item"), targetWidth: 120, className: "editor-preview background-contain"}),
                        ),
                        React.createElement("div", {className: "flex-row-item flex-resize", style: {wordBreak: "break-word", overflowWrap: "break-word"}},
                            Dbm.react.text.text(Dbm.react.source.contextVariable("item.url"))
                        )
                    )
                )
            )
        );
    }
}
