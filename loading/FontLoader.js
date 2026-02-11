import Dbm from "../index.js";

export default class FontLoader extends Dbm.core.BaseObject {
    constructor() {
        super();

        this._url = null;
        this._fontName = null;
        this._element = null;
        this._promise = null;

        this.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
    }

    setUrl(aUrl) {
        this._url = aUrl;
        return this;
    }

    setFontName(aFontName) {
        this._fontName = aFontName;
        return this;
    }

    load() {

        if(!this._element) {
            this.item.setValue("status", Dbm.loading.LoadingStatus.LOADING);

            let element = document.createElement("link");
            element.href = this._url;
            element.rel = "stylesheet";

            this._element = element;

            document.head.appendChild(element);

            this._promise = document.fonts.load("16px " + JSON.stringify(this._fontName));
            this._promise.then(() => {
                this.item.setValue("status", Dbm.loading.LoadingStatus.LOADED);
            });
            
        }
        
        return this;
    }
}