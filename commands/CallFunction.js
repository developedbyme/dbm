import Dbm from "../index.js";
import CommandBaseObject from "./CommandBaseObject.js"

export default class CallFunction extends CommandBaseObject {
    _construct() {
        super._construct();

        this.item.setValue("scopeObject", null);
        this.item.setValue("callFunction", null);
        this.item.setValue("callArguments", []);
    }

    perform(aFromObject, aData) {
		
        let callFunction = this.getInputFrom("callFunction", aFromObject, aData);
		
		let currentArray = this.getInputFrom("callArguments", aFromObject, aData);
		let currentArrayLength = currentArray.length;
		let resolvedArguments = new Array(currentArrayLength);
		
        for(let i = 0; i < currentArrayLength; i++){
            let currentArgument = currentArray[i];
			
            if(currentArgument && currentArgument.isFlowProperty) {
                currentArgument = currentArgument.value;
            }
            else if(currentArgument && currentArgument.isSource) {
                currentArgument = currentArgument.getSource(aFromObject, aData);
            }
            
            resolvedArguments[i] = currentArgument;
        }

        let scopeObject = this.getInputFrom("scopeObject", aFromObject, aData);

        if(typeof(callFunction) === "string") {
            callFunction = scopeObject[callFunction];
        }
        //METODO: try catch
        return callFunction.apply(scopeObject, resolvedArguments);
    }
}