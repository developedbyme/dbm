import Dbm from "../../index.js";

export default class LocalImage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("url", null);
        let fileProp = this.getDynamicProp("file");

        Dbm.flow.addUpdateCommand(fileProp, Dbm.commands.callFunction(this._fileChanged.bind(this)));
    }

    _fileChanged() {

        let file = this.getPropValue("file");

        if(file) {
            let fileReader = new FileReader();
            fileReader.onload = (function(aEvent) {
                this._fileLoaded(file, fileReader.result);
            }).bind(this);
            fileReader.readAsDataURL(file);
        }
        else {
            this.item.setValue("url", null);
        }
    }

    _fileLoaded(aFile, aData) {
        this.item.setValue("url", aData);
    }

    _removedUsedProps(aProps) {
        delete aProps["file"];
    }

    _renderMainElement() {

        return this._createMainElement(Dbm.react.image.Image, {src: this.item.properties.url}, this.getPropValue("children"));
        
    }
}