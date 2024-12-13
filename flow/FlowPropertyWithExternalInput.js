import Dbm from "../index.js";

export default class FlowPropertyWithExternalInput extends Dbm.flow.FlowProperty {

    setValue(aValue) {
        if(aValue !== this._value) {
            this._value = aValue;
            this.isDirty = false;
            this.setDownstreamAsDirty();
        }

        return this;
    }

    _internal_setValueInFlow(aValue) {
        //MENOTE: do nothing
    }
}