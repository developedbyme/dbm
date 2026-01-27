import Dbm from "../../../index.js";
import React from "react";

export default class ImageGallery extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("widthElement", null);
        
        let elementSize = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("elementSize", elementSize);
        elementSize.input.properties.element.connectInput(this.item.properties.widthElement);
        elementSize.start();
        this.item.requireProperty("width", 0).connectInput(elementSize.output.properties.width);

        let images = this.getPropValue("images");
        

        this.item.requireProperty("sections", []);

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);
        Dbm.flow.runWhenMatched(this.item.properties.loaded, true, Dbm.commands.callFunction(this._loaded.bind(this)));

        let urlPath = this.getPropValueWithDefault("urlPath", "url");

        let imageLoaders = [];
        let currentArray = images;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];
            console.log(currentData);
            let currentUrl = Dbm.objectPath(currentData, urlPath);
            console.log(currentUrl);
            let loader = Dbm.loading.loadImage(currentUrl);
            imageLoaders.push(loader.item);
            allLoaded.addCheck(loader.item.properties.status);
        }
        this.item.setValue("images", imageLoaders);
        
        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _removedUsedProps(aProps) {
        delete aProps["images"];
        delete aProps["urlPath"];
    }

    _loaded() {
        console.log("loaded");
        console.log(this.item.images);

        let groups = Dbm.utils.ArrayFunctions.splitArray(this.item.images, 4);

        let length = groups.length;
		if(length > 1 && groups[length - 1].length === 1) {
			let last = groups[length-1];
			let prev = groups[length-2];

			let lastInPrevious = prev.pop();
			last.unshift(lastInPrevious);
		}

        let sections = [];
        let currentArray = groups;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let section = React.createElement(Dbm.react.image.gallery.ImageGallerySection, {"images": currentArray[i], width: this.item.properties.width, spacing: 20});
            sections.push({"id": i, "element": section});
        }

        this.item.sections = sections;
    }

    _renderMainElement() {

        return this._createMainElement("div", {ref: this.createRef("widthElement")},
            React.createElement(Dbm.react.area.List, {items: this.item.properties.sections},
                React.createElement(Dbm.react.area.InsertElement, {"element": Dbm.react.source.item("element")}),
                React.createElement("div", {"data-slot": "spacing", "className": "spacing", "style": {"height": 20}})
            )
        );
    }
}