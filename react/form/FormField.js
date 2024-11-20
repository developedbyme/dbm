import Dbm from "../../index.js";

export default class FormField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicProp("value", "");

        this._callback_changeBound = this._callback_change.bind(this);
    }

    _callback_change(aEvent) {
        //console.log("_callback_change");
        //console.log(aEvent);

        let value = aEvent.target.value;

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(value);
    }

    _renderMainElement() {

        let value = this.getDynamicProp("value").value;

        return this._createMainElement("input", {"value": value, onChange: this._callback_changeBound});
    }
}

