import Dbm from "../../index.js";

export default class Text extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        let text = "" + this.getPropValue("text");

        return text;
    }
}