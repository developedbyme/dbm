export const clamp = function(aValue, aMinValue = 0, aMaxValue = 1) {
    return Math.max(Math.min(aValue, aMaxValue), aMinValue);
}

export const parametricValue = function(aValue, aStartValue, aEndValue) {
    return (aValue-aStartValue)/(aEndValue-aStartValue);
}

export const clampedParametricValue = function(aValue, aStartValue, aEndValue) {
    return clamp(parametricValue(aValue, aStartValue, aEndValue), 0, 1);
}

export const linearInerpolation = function(aParameter, aStartValue, aEndValue) {
    return (1-aParameter)*aStartValue+aParameter*aEndValue;
}