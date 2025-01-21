import React from "react";
import Dbm from "../../../index.js";

import EditorBlock from "./EditorBlock.js";

export default class Editor extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let all = Dbm.flow.updatefunctions.logic.allAtValue(1);

        all.addCheck(Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/image@latest").item.properties.status);
        all.addCheck(Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/header@latest").item.properties.status);
        all.addCheck(Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/image@latest").item.properties.status);
        all.addCheck(Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/list@latest").item.properties.status);
        all.addCheck(Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/raw@latest").item.properties.status);
        
        
        //METODO: select which tools should be used

        all.addCheck(Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest").item.properties.status);

        this.item.setValue("element", document.createElement("div"));

        let updateFunction = new Dbm.flow.updatefunctions.basic.RunCommand();
        
        updateFunction.input.command = Dbm.commands.callFunction(this._scriptStatus.bind(this), [all]);

        updateFunction.output.properties.value.startUpdating();
        updateFunction.input.properties.value.connectInput(all.output.properties.value);

        this.getDynamicPropWithoutState("value", {});

        this._callback_saveDataUpdatedBound = this._callback_saveDataUpdated.bind(this);
        this._callback_editorChangeBound = this._callback_editorChange.bind(this);
    }

    uploadImage(aFile) {
        return new Promise((resolve, reject) => {
            let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

            let preSign = graphApi.requestData("fileUpload", {"fileName": aFile.name, "mimeType": aFile.type});
    
            Dbm.flow.addDirectUpdateCommand(preSign.getProperty("status"), Dbm.commands.callFunction(this._statusChanged.bind(this), [preSign, aFile, resolve]));
        });
    }

    _statusChanged(aPreSign, aFile, resolve) {
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
                resolve({success: true, file: {url: aPreSign.data.publicUrl, resizeUrl: aPreSign.data.publicResizeUrl, identifier: aPreSign.data.identifier}});
             })

        }
    }

    _callback_saveDataUpdated(aData) {
        //console.log("_callback_saveDataUpdated");
        //console.log(aData);

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(aData);
    }

    _callback_editorChange(aApi, aEvent) {
        console.log("_callback_editorChange");
        this.item.editor.save().then(this._callback_saveDataUpdatedBound);
    }

    _scriptStatus(aLoader) {
        //console.log("_scriptStatus");
        //console.log(aLoader);

        if(aLoader.output.value) {

            let element = this.item.element;
            element.classList.add("full-size");

            let content = this.getDynamicProp("value").value;

            let tools = {
                image: window.ImageTool,
                heading: window.Header,
                image: {
                    "class": window.ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: (aFile) => {
                                return this.uploadImage(aFile);
                            },
                            uploadByUrl: function(aUrl) {
                                console.log(aUrl);
                            }
                        }
                    }
                },
                list: {
                    class: window.EditorjsList,
                    inlineToolbar: true,
                    config: {
                      defaultStyle: 'unordered'
                    },
                },
                raw: window.RawTool
            };


            let editorConfigItem = Dbm.getInstance().repository.getItem("editorjs");
            let toolsFromConfig = editorConfigItem.tools;

            tools = {...tools, ...toolsFromConfig};
		
		    const editor = new window.EditorJS({ 
                minHeight: 0,
                holder: element,
                tools: tools,
                data: content,
                onChange: this._callback_editorChangeBound
            });

            this.item.setValue("editor", editor);
        }
    }

    /*
    _save() {
        this.item.editor.save().then((aOutputData) => {
            console.log('Article data: ', aOutputData);
            
            let id = Dbm.getInstance().repository.getItem("siteDataLoader").currentPage.page.id;
            let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

            console.log(graphApi, Dbm.getInstance().repository.getItem("siteDataLoader"));

            graphApi.editItem(id, [{"type": "setField", "data": {"value": aOutputData, "field": "content"}}], ["content"]);

          }).catch((error) => {
            console.log('Saving failed: ', error)
          });
    }
    */

    componentDidMount() {
        //console.log("componentDidMount");
        let parentElement = this.item.holder;
        parentElement.appendChild(this.item.element);
    }

    componentDidUpdate() {
        //console.log("componentDidUpdate");
        let parentElement = this.item.holder;
        parentElement.appendChild(this.item.element);
    }

    _renderMainElement() {

        return React.createElement("div", {style: {"position": "relative", "zIndex": 0}},
            React.createElement("div", {"ref": this.createRef("holder")})
        );
    }
}

