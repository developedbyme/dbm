import Dbm from "../../index.js";

export default class HtmlText extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {
        
        let text = "" + this.getPropValue("text");

        return this._createMainElement("span", {"dangerouslySetInnerHTML": {__html: text}});;
    }
}