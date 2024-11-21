export let floatMod = function(aValue, aDivisor) {
    
    let times = Math.floor(aValue/aDivisor);

    let returnValue = aValue-(times*aDivisor);

    return returnValue;
}