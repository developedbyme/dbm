import Dbm from "../../index.js";

export default class Image extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _removedUsedProps(aProps) {
        let elementType = this.getPropValue("elementType");
        
        let isDiv = (elementType !== "img");
        if(isDiv) {
            delete aProps["src"];
            delete aProps["alt"];
        }
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

            let props = {style: imageStyle, className: className};

            let altText = this.getPropValue("alt");
            if(altText) {
                props["role"] = "img";
                props["aria-label"] = altText;
            }

            return this._createMainElement("div", props, this.getPropValue("children"));
        }
        else {
            let className = "image";
            return this._createMainElement("img", {src: src, className: className});
        }
        
    }
}