import Dbm from "../../index.js";

export default class HtmlText extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {
        
        let rawText = this.getPropValue("text");;
        let text = "";

        if(rawText !== undefined && rawText !== null) {
            text += rawText;
        }

        return this._createMainElement("span", {"dangerouslySetInnerHTML": {__html: text}});;
    }
}