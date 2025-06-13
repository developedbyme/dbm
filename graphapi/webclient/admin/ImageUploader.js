import Dbm from "../../../index.js";

export default class ImageUploader extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this.item.requireProperty("file", null);
        this.item.requireProperty("status", 0);
        this.item.requireProperty("item", null);

        this._fileUploadedBound = this._fileUploaded.bind(this);
    }

    setFile(aFile) {
        this.item.file = aFile;
        return this;
    }

    uploadImage() {
        console.log("uploadImage");
        if(this.item.status !== 0) {
            console.warn("Image is already uploading", this);
            return this;
        }

        let file = this.item.file;
        if(!file) {
            console.warn("No file set", this);
            return this;
        }

        this.item.status = 2;
                
        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let preSign = graphApi.requestData("fileUpload", {"fileName": file.name, "mimeType": file.type});

        Dbm.flow.addDirectUpdateCommand(preSign.getProperty("status"), Dbm.commands.callFunction(this._statusChanged.bind(this), [preSign, file]));
        
        return this;
    }
        
    _statusChanged(aPreSign, aFile) {
        console.log("_statusChanged");
        console.log(aPreSign, aFile);

        let item = Dbm.getInstance().repository.getItem(aPreSign.data.id);
        item.setValue("name", aPreSign.data.name);
        item.setValue("url", aPreSign.data.publicUrl);
        item.setValue("resizeUrl", aPreSign.data.publicResizeUrl);
        item.setValue("identifier", aPreSign.data.identifier);
        this.item.item = item;

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

            fetch(url, {method: 'PUT', headers: new Headers(headers), body: aFile}).then(this._fileUploadedBound)

        }
    }

    _fileUploaded() {
        console.log("_fileUploaded");

        this.item.status = 1;

        console.log("Uploaded", this.item.item);
    }
}