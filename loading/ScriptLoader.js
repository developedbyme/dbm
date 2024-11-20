import Dbm from "../index.js";

export default class ScriptLoader extends Dbm.core.BaseObject {
    constructor() {
        super();

        this._url = null;
        this._script = null;

        this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);

        this._callback_scriptLoadedBound = this._callback_scriptLoaded.bind(this);
    }

    setUrl(aUrl) {
        this._url = aUrl;
        return this;
    }

    load() {

        if(!this._script) {
            this.item.setValue("status", Dbm.loading.LoadingStatus.LOADING);

            let scriptElement = document.createElement("script");
            this._script = scriptElement;
            scriptElement.addEventListener("load", this._callback_scriptLoadedBound, false);
            
            scriptElement.async = true;
            scriptElement.src = this._url;
            document.head.appendChild(scriptElement);
        }
        
        return this;
    }

    _callback_scriptLoaded(aEvent) {
        this.item.setValue("status", Dbm.loading.LoadingStatus.LOADED);
    }
}