import Dbm from "../../index.js";

export default class Image extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let src = this.getPropValue("src");
        let elementType = this.getPropValue("elementType");
        
        let isDiv = (elementType !== "img");
        if(isDiv) {
            let imageStyle = {
                "backgroundImage": "url(" + src + ")"
            };
            let className = "image";

            return this._createMainElement("div", {style: imageStyle, className: className}, this.getPropValue("children"));
        }
        else {
            let className = "image";
            return this._createMainElement("img", {src: src, className: className});
        }
        
    }
}