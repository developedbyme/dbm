import Dbm from "../index.js";
import {Component, createElement} from "react";
import Context from "./context/Context.js";

export default class BaseObject extends Component {
    constructor(aProps, aContext) {
        super(aProps, aContext);
        this.state = {"dynamicUpdate": 0};
        this._dynamicProps = {}
        this._construct();

        this._prepareProps();
        this._constructAfterProps();
    }

    _construct() {

    }

    _constructAfterProps() {

    }

    _prepareProps() {
        //console.log("_prepareProps");
        let props = this.props;
        for(let objectName in props) {
            let currentProp = props[objectName];

            if(currentProp && currentProp.isSource) {
                currentProp = currentProp.getSource(this);
                let currentDynamicProperty = this.getDynamicProp(objectName);
                currentDynamicProperty.setOrConnect(currentProp);
            }
            else if(currentProp && currentProp.isFlowProperty) {
                let currentDynamicProperty = this.getDynamicProp(objectName);
                currentDynamicProperty.connectInput(currentProp);
            }
			else if(this._dynamicProps[objectName]) {
                let currentDynamicProperty = this._dynamicProps[objectName];
                currentDynamicProperty.value = currentProp;
			}
        }

        //METODO: remove unused connections
    }

    _getStateUpdate() {
        let updateState = this.item.updateState;
        if(!updateState) {
            updateState = new Dbm.flow.updatefunctions.react.UpdateState();
            this.item.setValue("updateState", updateState);
            updateState.input.owner = this;
            updateState.output.properties.dynamicUpdate.startUpdating();
        }
        return updateState;
    }

    getDynamicProp(aName, aInitialValue = null) {
        if(!this._dynamicProps[aName]) {
            let newProperty = this.item.requireProperty("props/" + aName, aInitialValue);
            this._dynamicProps[aName] = newProperty;
            let updateState = this._getStateUpdate();
            let stateProperty = updateState.input.register(aName, aInitialValue);
            stateProperty.connectInput(newProperty);
        }
        return this._dynamicProps[aName];
    }

    getDynamicPropWithoutState(aName, aInitialValue = null) {
        if(!this._dynamicProps[aName]) {
            let newProperty = this.item.requireProperty("props/" + aName, aInitialValue);
            this._dynamicProps[aName] = newProperty;
        }
        return this._dynamicProps[aName];
    }

    get item() {
        if(!this._item) {
            this._item = new Dbm.repository.Item();
            this._item.setValue("controller", this);
        }
        return this._item;
    }

    getProp(aName) {
        if(this._dynamicProps[aName]) {
            return this._dynamicProps[aName];
        }

        return this.props[aName];
    }

    getPropValue(aName) {
        let currentProp = this.getProp(aName);

        if(currentProp && currentProp.isFlowProperty) {
            return currentProp.value;
        }

        return currentProp;
    }

    getPropValueWithDefault(aName, aDefaultValue) {
        let value = this.getPropValue(aName);

        if(!value) {
            value = aDefaultValue;
        }

        return value;
    }

    createRef(aName) {
        let refToProperty = this.item["ref/" + aName];

        if(!refToProperty) {
            this.item.setValue(aName, null);
            let property = this.item.properties[aName];
            refToProperty = new Dbm.react.RefToProperty();
            refToProperty.property = property;
            this.item.setValue("ref/" + aName, refToProperty);
        }
        
        return refToProperty;
    }

    componentWillUnmount() {
        
    }

    render() {
        let returnObject;

        //METODO: add switch for if it should be safe
        try {
            returnObject = this._renderMainElement();
        }
        catch(theError) {
            console.error("Error while rendering", theError);
            returnObject = React.createElement("div", {}, "Error");
        }

        return returnObject;
    }

    _renderMainElement() {
        return this._createMainElement("div", {ref: this.createRef("mainElement")}, this.props.children);
    }

    _mainElement(aReactElement) {
        let returnObject = this._performCreateMainElement(aReactElement.type, aReactElement.props, aReactElement.props.children);
        return returnObject;
    }

    _createMainElement(aType, aProps, ...children) {
        return this._performCreateMainElement(aType, aProps, children);
    }

    _removedUsedProps(aProps) {
        
    }

    _copyProps(aProps) {
        let newProps = {...aProps};

        let incomingProps = {...this.props};
        this._removedUsedProps(incomingProps);

        for(let objectName in incomingProps) {
            let currentValue = this.getPropValue(objectName);
            switch(objectName) {
                case "className":
                    {
                        if(newProps[objectName]) {
                            newProps[objectName] += " " + currentValue;
                        }
                        else {
                            newProps[objectName] = currentValue;
                        }
                    }
                    break;
                case "style":
                    {
                        
                        let newStyleObject = {...newProps[objectName]};
                        for(let styleProperty in currentValue) {
                            if(!newStyleObject[styleProperty]) {
                                newStyleObject[styleProperty] = currentValue[styleProperty];
                            }
                        }
                        
                        newProps[objectName] = newStyleObject;
                    }
                    break;
                case "ref":
                case "children":
                case "elementType":
                case "key":
                    //MENOTE: do nothing
                    break;
                default:
                    if(!newProps[objectName]) {
                        newProps[objectName] = currentValue;
                    }
                    break;
            }
        }
        
        return newProps;
    }

    _performCreateMainElement(aType, aProps, children) {

        let newProps = this._copyProps(aProps);

        let elementType = this.getProp("elementType");
        if(elementType) {
            aType = elementType;
        }

        if(!children || !children.length) {
            return createElement(aType, newProps);
        }

        let callArray = [aType, newProps].concat(children);

        return createElement.apply(null, callArray);
    }

    _getScopedCallFunctionCommand(aFunction, aArguments = []) {
        let CallFunction = Dbm.objectPath(Dbm.getRepositoryItem("library"), "Dbm/commands/CallFunction");
        let command = new CallFunction();
        command.item.scopeObject = this;
        command.item.callFunction = aFunction;
        command.item.callArguments = aArguments;

        return command;
    }

    _propertyOrName(aPropertyOrName) {
        if(typeof(aPropertyOrName) === "string") {
            return this.item.properties[aPropertyOrName];
        }

        return aPropertyOrName;
    }

    addUpdateCall(aPropertyOrName, aFunction, aArguments = []) {
        this._propertyOrName(aPropertyOrName).addUpdate(this._getScopedCallFunctionCommand(aFunction, aArguments));
    }

    addUpdateCallWhenMatched(aPropertyOrName, aMatchValue, aFunction, aArguments = []) {
        console.log(this._propertyOrName(aPropertyOrName), aPropertyOrName);
        this._propertyOrName(aPropertyOrName).addUpdateWhenMatched(aMatchValue, this._getScopedCallFunctionCommand(aFunction, aArguments));
    }
}

BaseObject.contextType = Context;