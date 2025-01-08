import Dbm from "../../index.js";

export default class Link extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let url = this.getPropValue("href");
        let prefix = this.getPropValue("prefix");
        if(prefix) {
            url = prefix + url;
        }

        return this._createMainElement("a", {href: url}, this.getPropValue("children"));
    }
}