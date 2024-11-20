import React from "react";
import Dbm from "../../index.js";

import EditorBlock from "./EditorBlock.js";

export default class Editor extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/image@latest");
        Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/header@latest");
        Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/image@latest");
        //METODO: select which tools should be used

        let scriptLoader = Dbm.loading.loadScript("https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest");

        this.item.setValue("element", document.createElement("div"));

        let updateFunction = new Dbm.flow.updatefunctions.basic.RunCommand();
        
        updateFunction.input.command = Dbm.commands.callFunction(this._scriptStatus.bind(this), [scriptLoader]);

        updateFunction.output.properties.value.startUpdating();
        updateFunction.input.properties.value.connectInput(scriptLoader.item.properties.status);
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
                resolve({success: true, file: {url: aPreSign.data.publicUrl}});
             })

            
        }
    }

    _scriptStatus(aLoader) {
        //console.log("_scriptStatus");
        //console.log(aLoader);

        if(aLoader.item.status === 1) {

            let element = this.item.element;
            element.classList.add("full-size");

            let content = Dbm.getInstance().repository.getItem("siteDataLoader").currentPage.page.content;

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
                }
            };


            let editorConfigItem = Dbm.getInstance().repository.getItem("editorjs");
            let toolsFromConfig = editorConfigItem.tools;

            tools = {...tools, ...toolsFromConfig}
		
		    const editor = new window.EditorJS({ 
                minHeight: 0,
                holder: element,
                tools: tools,
                data: content
            });

            this.item.setValue("editor", editor);
        }
    }

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
            React.createElement("div", {"ref": this.createRef("holder")}),
            React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                "Save"
            )
        );
        /*
        return <div>
            <div ref={this.createRef("holder")} />
            <div className="standard-button standard-button-padding" onClick={() => {this._save()}}>
                Save
            </div>
        </div>;
        */
    }
}

