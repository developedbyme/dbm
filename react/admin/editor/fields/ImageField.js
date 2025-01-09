import React from "react";
import Dbm from "../../../../index.js";

export default class ImageField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._valueChangedBound = this._valueChanged.bind(this);
        this._objectChangedBound = this._objectChanged.bind(this);
        this._callback_fileChangedBound = this._callback_fileChanged.bind(this);

        let fieldName = this.getPropValue("name");

        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        let initialData = editorData.data[fieldName];
        if(!initialData) {
            initialData = null;
        }
        Dbm.flow.addUpdateCommand(this.item.requireProperty("value", initialData), Dbm.commands.callFunction(this._valueChangedBound));

        Dbm.flow.addUpdateCommand(editorData.properties.data, Dbm.commands.callFunction(this._objectChangedBound));

        let imageElement = React.createElement("div", {className: "flex-row small-item-spacing"},
            React.createElement("div", {className: "flex-row-item flex-no-resize"},
                React.createElement(Dbm.react.image.Image, {"src": Dbm.react.source.contextVariable("moduleData.editorData.data." + fieldName + ".url"), className: "editor-preview background-contain"}),
            ),
            React.createElement("div", {className: "flex-row-item flex-resize"},
                Dbm.react.text.text(Dbm.react.source.contextVariable("moduleData.editorData.data." + fieldName + ".url"))
            ),
            React.createElement("div", {className: "flex-row-item flex-no-resize"},
                React.createElement("div", {onClick: () => {this.removeImage()}}, "Remove")
            )
        );

        let uploadElement = React.createElement("input", {"type": "file", onChange: this._callback_fileChangedBound, className: "full-width"});

        let elementSwitch =Dbm.flow.updatefunctions.logic.switchValue(this.item.properties.value).setDefaultValue(imageElement).addCase(null, uploadElement);

        this.item.requireProperty("element", null).connectInput(elementSwitch.output.properties.value);
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
    }

    _objectChanged() {
        //console.log("_objectChanged");

        let fieldName = this.getPropValue("name");
        let editorData = Dbm.objectPath(this.context, "moduleData.editorData");

        this.item.value = editorData.data[fieldName];
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
                console.log(url);
    
                const myHeaders = new Headers({
                    'Content-Type': aFile.type,
                    'x-amz-acl': 'public-read'
                });
                fetch(url, {
                    method: 'PUT',
                    headers: myHeaders,
                    body: aFile
                 }).then(() => {
                    this.item.value = {url: aPreSign.data.publicUrl};
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