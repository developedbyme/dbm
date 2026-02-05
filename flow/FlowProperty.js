import Dbm from "../index.js";

export default class FlowProperty extends Dbm.flow.FlowBaseObject {

    _constructProperties() {
        super._constructProperties();

        this._value = null;
        
        this._upstreamConnection = null;
        
    }

    get isFlowProperty() {
        return true;
    }

    setValue(aValue) {
        if(this._upstreamConnection) {
			console.warn("Property has upstream connection, can't set value", this, aValue);
            //METODO: check if upstream can be changed
        }
        else {
            if(aValue !== this._value) {
                this._value = aValue;
                this.isDirty = false;
                this.setDownstreamAsDirty();
            }
        }

        return this;
    }

    setOrConnect(aValueOrProperty) {
        if(aValueOrProperty && aValueOrProperty.isFlowProperty) {
            this.connectInput(aValueOrProperty);
        }
        else {
            this.setValue(aValueOrProperty);
        }

        return this;
    }

    animateValue(aToValue, aTime = 0.5, aDelay = 0, aEasing = null) {
        Dbm.getInstance().repository.getItem("propertyUpdater").controller.animateProperty(this, aToValue, aTime, aDelay, aEasing);

        return this;
    }

    addAddionalAnimation(aFromValue, aToValue, aTime = 0.5, aDelay = 0, aEasing = null) {
        Dbm.getInstance().repository.getItem("propertyUpdater").controller.addPropertyAnimation(this, aFromValue, aToValue, aTime, aDelay, aEasing);

        return this;
    }

    delayValue(aToValue, aDelay = 0) {
        Dbm.getInstance().repository.getItem("propertyUpdater").controller.delayUpdateProperty(this, aToValue, aDelay);

        return this;
    }

    getMostUpstreamProperty() {

        let debugCounter = 0;

        let currentProperty = this;
        while(currentProperty._upstreamConnection) {
            if(debugCounter++ > 10000) {
                console.error("Loop ran for too long");
                return null;
            }
            currentProperty = currentProperty._upstreamConnection;
        }
        return currentProperty;
    }

    _connection_connectUpstream(aFlowObject) {
        if(this._upstreamConnection) {
            //METODO: disconnect old input

        }

        this._upstreamConnection = aFlowObject;
    }

    _internal_setValueInFlow(aValue) {
        this._value = aValue;
        this.isDirty = false;
    }

    _internal_setValueInFlowOutsideOfUpdate(aValue) {
        if(aValue !== this._value) {
            this._value = aValue;
            this.isDirty = false;
            this.setDownstreamAsDirty();
        }
    }

    set value(aValue) {
        this.setValue(aValue);
    }

    get value() {

        this.updateFlow();
        
        return this._value;
    }

    updateFlow() {
        //console.log("updateFlow");
        if(this.isDirty) {
            if(this._upstreamConnection) {
                this._upstreamConnection._internal_updateFlow();
            }
            else {
                this.isDirty = false;
            }
        }

        return this;
    }

    getValueWithoutFlow() {
        return this._value;
    }

    _internal_updateFlow() {
        let newValue = this.value;
        let currentArray = this._downstreamConnections;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentConnection = currentArray[i];
            currentConnection._internal_setValueInFlow(newValue);
        }
    }

    startUpdating() {
        Dbm.getRepositoryItem("propertyUpdater").controller.addProperty(this);
        return this;
    }

    stopUpdating() {
        Dbm.getRepositoryItem("propertyUpdater").controller.removeProperty(this);
        return this;
    }

    destroy() {
        super.destroy();

        this._value = null;
        if(this._upstreamConnection) {
            //METODO: remove as outgoing
            this._upstreamConnection = null;
        }
    }
}