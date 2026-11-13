export let floatMod = function(aValue, aDivisor) {
    
    let times = Math.floor(aValue/aDivisor);

    let returnValue = aValue-(times*aDivisor);

    return returnValue;
}

export const closestLoopingValue = function(aCurrentValue, aWantedValue, aLoopLength) {
    let wantedValue = floatMod(aWantedValue, aLoopLength);

    let currentIndex = Math.floor(aCurrentValue/aLoopLength);

    let midValue = currentIndex*aLoopLength+wantedValue;

    if(midValue > aCurrentValue) {
        let lowValue = (currentIndex-1)*aLoopLength+wantedValue;

        if(Math.abs(aCurrentValue-lowValue) < Math.abs(aCurrentValue-midValue)) {
            return lowValue;
        }
    }
    else {
        let highValue = (currentIndex+1)*aLoopLength+wantedValue;

        if(Math.abs(aCurrentValue-highValue) < Math.abs(aCurrentValue-midValue)) {
            return highValue;
        }
    }

    return midValue;
}