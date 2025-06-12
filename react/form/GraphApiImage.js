import React from "react";
import Dbm from "../../index.js";

export default class GraphApiImage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let value = this.getDynamicProp("value", null);
        this._callback_fileChangedBound = this._callback_fileChanged.bind(this);


        let imageElement = React.createElement("div", {className: "flex-row small-item-spacing"},
            React.createElement("div", {className: "flex-row-item flex-no-resize"},
                "Image selected"
            ),
            React.createElement("div", {className: "flex-row-item flex-no-resize"},
                React.createElement("div", {onClick: () => {this.removeImage()}}, "Remove")
            )
        );

        this.item.requireProperty("selectMode", "overview");

        let uploadElement = React.createElement("div", {className: "flex-row small-item-spacing halfs"},
            React.createElement("div", {className: "flex-row-item"},
                React.createElement("input", {"type": "file", onChange: this._callback_fileChangedBound, className: "full-width"})
            ),
            React.createElement("div", {className: "flex-row-item"},
                React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.setProperty(this.item.properties.selectMode, "library")}, 
                    React.createElement("div", {className: "flex-row-item"}, "Select from library")
                )
            ),
        );

        let libraryElement = React.createElement("div", {}, 
            React.createElement(Dbm.react.admin.SelectImageFromLibrary, {selectedCommands: [
                Dbm.commands.callFunction(this._imageSelected.bind(this), [Dbm.core.source.event()]),
                Dbm.commands.setProperty(this.item.properties.selectMode, "overview")
            ]})
        );

        let selectSwitch = Dbm.flow.updatefunctions.logic.switchValue(this.item.properties.selectMode).setDefaultValue(uploadElement).addCase("library", libraryElement);

        let selectElement = React.createElement("div", {},
            React.createElement(Dbm.react.area.InsertElement, {element: selectSwitch.output.properties.value})
        );

        let elementSwitch = Dbm.flow.updatefunctions.logic.switchValue(value).setDefaultValue(imageElement).addCase(null, selectElement);

        this.item.requireProperty("element", null).connectInput(elementSwitch.output.properties.value);
    }

    _callback_fileChanged(aEvent) {
        console.log("_callback_fileChanged");
        console.log(aEvent, aEvent.target.files);

        let files = aEvent.target.files;
        if(files.length > 0) {
            //METODO: upload image
        }
    }

    _imageSelected(aEvent) {
        console.log("_imageSelected");
        console.log(aEvent);

        this.getDynamicProp("value").getMostUpstreamProperty().value = aEvent.id;
    }

    removeImage() {
        this.getDynamicProp("value").getMostUpstreamProperty().value = null;
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value");

        return this._createMainElement("div", {"className": "standard-field standard-field-padding"},
            React.createElement(Dbm.react.area.InsertElement, {element: this.item.properties.element})
        );
    }
}

