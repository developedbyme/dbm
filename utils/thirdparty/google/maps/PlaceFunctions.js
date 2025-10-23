export const getAddressFromComponents = function(aComponents) {
    const returnObject = {};

    let currentArray = aComponents;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentComponent = currentArray[i];
        let types = currentComponent.types;

        if(types.includes("street_number")) {
            returnObject.streetNumber = currentComponent.longText;
        }
        else if(types.includes("route")) {
            returnObject.street = currentComponent.longText;
        }
        else if(types.includes("subpremise")) {
            returnObject.unit = currentComponent.longText;
        }
        else if(types.includes("floor")) {
            returnObject.floor = currentComponent.longText;
        }
        else if(types.includes("room")) {
            returnObject.room = currentComponent.longText;
        }
        else if(types.includes("postal_code")) {
            returnObject.postCode = currentComponent.longText;
        }
        else if(types.includes("locality")) {
            returnObject.city = currentComponent.longText;
        }
        else if(types.includes("postal_town")) {
            if(!returnObject.city) {
                returnObject.city = currentComponent.longText;
            }
        }
        else if(types.includes("administrative_area_level_2")) {
            if(!returnObject.city) {
                returnObject.city = currentComponent.longText;
            }
        }
        else if(types.includes("administrative_area_level_1")) {
            if(!returnObject.state) {
                returnObject.state = currentComponent.longText;
            }
            
        }
        else if(types.includes("country")) {
            returnObject.country = currentComponent.shortText;
        }
    }

    return returnObject;
}