import React from "react";
import Dbm from "../../../../index.js";

export default class ImageField extends Dbm.react.BaseObject {

    _construct() {
        super._construct();

        this._valueChangedBound = this._valueChanged.bind(this);
        this._objectChangedBound = this._objectChanged.bind(this);
        this._callback_fileChangedBound = this._callback_fileChanged.bind(this);
        this._altTextChangedBound = this._altTextChanged.bind(this);

        let fieldName = this.getPropValue("name");

        

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        Dbm.flow.addUpdateCommand(this.item.requireProperty("value", this._getObjectData()), Dbm.commands.callFunction(this._valueChangedBound));

        let altText = Dbm.objectPath(this.item.value, "altText");

        Dbm.flow.addUpdateCommand(this.item.requireProperty("altText", altText), Dbm.commands.callFunction(this._altTextChangedBound));

        Dbm.flow.addUpdateCommand(editorData.properties.data, Dbm.commands.callFunction(this._objectChangedBound));

        let imageElement = React.createElement("div", {className: "flex-row small-item-spacing"},
            React.createElement("div", {className: "flex-row-item flex-no-resize"},
                React.createElement(Dbm.react.image.WidthScaledImage, {"image": Dbm.react.source.contextVariable("moduleData.editorData.data." + fieldName), targetWidth: 120, className: "editor-preview background-contain"}),
            ),
            React.createElement("div", {className: "flex-row-item flex-resize"},
                Dbm.react.text.text(Dbm.react.source.contextVariable("moduleData.editorData.data." + fieldName + ".url")),
                React.createElement("div", {className: "spacing small"}),
                React.createElement("div", {},
                    React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("moduleData.editorData.data." + fieldName + ".id"), checkType: "invert/default"},
                        React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._addToLibrary.bind(this))},
                            React.createElement("div", {className: "action-button action-button-padding"},
                                "Add to library"
                            )
                        )
                            
                    ),
                    React.createElement(Dbm.react.area.HasData, {check: Dbm.react.source.contextVariable("moduleData.editorData.data." + fieldName + ".id")},
                        React.createElement(Dbm.react.form.FormField, {value: this.item.properties.altText, className: "standard-field standard-field-padding full-width"}),
                        React.createElement("div", {className: "spacing micro"}),
                        React.createElement("div", {className: "flex-row small-item-spacing"},
                            React.createElement("div", {className: "flex-row-item"},
                                React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._generateAltText.bind(this))},
                                    React.createElement("div", {className: "action-button action-button-padding"},
                                        "Generate"
                                    )
                                )
                            ),
                            React.createElement("div", {className: "flex-row-item"},
                                React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._saveAltTextToLibrary.bind(this))},
                                    React.createElement("div", {className: "action-button action-button-padding"},
                                        "Save to library"
                                    )
                                )
                            )
                        )
                    )
                ),
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

        let elementSwitch = Dbm.flow.updatefunctions.logic.switchValue(this.item.properties.value).setDefaultValue(imageElement).addCase(null, selectElement);

        this.item.requireProperty("element", null).connectInput(elementSwitch.output.properties.value);
    }

    _addToLibrary() {
        let imageData = this.item.value;

        let objectType = "image";

        let parsedUrl = URL.parse(imageData.url);
        
        let fileName = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/")+1);

        let changes = [
            {"type": "setIdentifier", "data": {"value": imageData.identifier, "field": "name"}},
            {"type": "setField", "data": {"value": fileName, "field": "name"}},
            {"type": "setField", "data": {"value": fileName, "field": "originalFileName"}},
            {"type": "setField", "data": {"value": parsedUrl.pathname, "field": "path"}},
            {"type": "setField", "data": {"value": imageData.url, "field": "url"}},
            {"type": "setField", "data": {"value": imageData.resizeUrl, "field": "resizeUrl"}},
        ];

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem([objectType], "public", changes);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._libraryImageCreated.bind(this), [request]));
    }

    _libraryImageCreated(aRequest) {
        //console.log("_libraryImageCreated");
        //console.log(aRequest);

        let imageData = {...this.item.value};

        imageData.id = aRequest.item.id;
        this.item.value = imageData;
    }

    _generateAltText() {

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.requestData("admin/altText", {"id": this.item.value.id});
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._altTextLoaded.bind(this), [request]));

    }

    _altTextLoaded(aRequest) {
        this.item.altText = Dbm.objectPath(aRequest, "data.altText");
    }

    _saveAltTextToLibrary() {
        let changes = [
            {"type": "setField", "data": {"value": this.item.altText, "field": "altText"}},
        ];

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.editItem(this.item.value.id, changes);
    }

    _imageSelected(aImage) {
        //console.log("_imageSelected");
        //console.log(aImage);

        let imageData = {id: aImage.id, url: aImage.url, resizeUrl: aImage.resizeUrl, identifier: aImage.identifier, altText: aImage.altText};
        this.item.value = imageData;
    }

    _getObjectData() {
        let fieldName = this.getPropValue("name");

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let returnData = editorData.data[fieldName];
        if(!returnData) {
            returnData = null;
        }

        return returnData;
    }

    _valueChanged() {
        //console.log("_valueChanged");

        let fieldName = this.getPropValue("name");
        let newValue = this.item.value;
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let newData = {...editorData.data};
        newData[fieldName] = newValue;

        editorData.data = newData;
        this.context.moduleData.editorData.editorBlock.dataUpdated();

        if(newValue) {
            this.item.altText = newValue.altText;
        }
        
    }

    _altTextChanged() {

        if(this.item.value && this.item.value.altText !== this.item.altText) {
            let newValue = {...this.item.value};
            newValue.altText = this.item.altText;
            this.item.value = newValue;
        }
    }

    _objectChanged() {
        //console.log("_objectChanged");

        let fieldName = this.getPropValue("name");
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        this.item.value = this._getObjectData();
    }

    _callback_fileChanged(aEvent) {
        console.log("_callback_fileChanged");
        console.log(aEvent, aEvent.target.files);

        let files = aEvent.target.files;
        if(files.length > 0) {
            this.uploadImage(files[0]);
        }
    }

    removeImage() {
        this.item.value = null;

        return this;
    }

    uploadImage(aFile) {
            
                let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
    
                let preSign = graphApi.requestData("fileUpload", {"fileName": aFile.name, "mimeType": aFile.type});
        
                Dbm.flow.addDirectUpdateCommand(preSign.getProperty("status"), Dbm.commands.callFunction(this._statusChanged.bind(this), [preSign, aFile]));
            
        }
    
        _statusChanged(aPreSign, aFile) {
            console.log("_statusChanged");
            console.log(aPreSign, aFile);
    
            if(aPreSign.status === 1) {
                let url = aPreSign.data.url;
                console.log(url, aPreSign.data);
    
                let headers = {
                    'Content-Type': aFile.type,
                    'Cache-Control': 'no-cache',
                };

                let additionalHeaders = aPreSign.data.additionalHeaders;
                for(let objectName in additionalHeaders) {
                    headers[objectName] = additionalHeaders[objectName];
                }

                fetch(url, {
                    method: 'PUT',
                    headers: new Headers(headers),
                    body: aFile
                 }).then(() => {
                    this.item.value = {id: aPreSign.data.id, url: aPreSign.data.publicUrl, resizeUrl: aPreSign.data.publicResizeUrl, identifier: aPreSign.data.identifier};
                    console.log("Uploaded", this.item.value);
                    //METODO: send update to editor
                 })
    
            }
        }

    _renderMainElement() {
        return this._createMainElement("div", {},
            React.createElement(Dbm.react.area.InsertElement, {element: this.item.properties.element})
        );
    }
}