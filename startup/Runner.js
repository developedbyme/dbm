import Dbm from "../index.js";

export default class Runner extends Dbm.core.BaseObject {
    constructor() {
        super();

        this._element = null;
        this._moduleName = null;
        this._data = null;
        this._id = -1;
        this._reactRoot = null;
    }

    setup(aElement, aModuleName, aData, aId) {
        this._element = aElement;
        this._moduleName = aModuleName;
        this._data = aData;
        this._id = aId;

        return this;
    }

    start() {
        //console.log("Runner::start");
        //console.log(this);

        let preRenderContent = this._element.querySelector("#preRenderContent");

        if(preRenderContent) {
            preRenderContent.style["display"] = "none";
            preRenderContent.parentElement.removeChild(preRenderContent);
        }

        let root = document.createElement("div");
        this._element.appendChild(root);

        let module = Dbm.getInstance().repository.getItem("moduleCreators/" + this._moduleName).controller;

        this._reactRoot = module.createModule(root, this._data);
    }

    stop() {
        //console.log("Runner::stop");
        
        this._reactRoot.unmount();
    }
}