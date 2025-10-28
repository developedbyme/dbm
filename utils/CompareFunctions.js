import Dbm from "../index.js";

export const objectExists = function(aA, aB) {
    if(aA) {
        return true;
    }
	return aA;
}

export const equals = function(aA, aB) {
	return aA == aB;
}

export const strictEquals = function(aA, aB) {
	return aA === aB;
}

export const notEquals = function(aA, aB) {
	return aA != aB;
}

export const strictNotEquals = function(aA, aB) {
	return aA !== aB;
}

export const arrayContains = function(aA, aB) {
    if(aA && aA.indexOf && aA.indexOf(aB) >= 0) {
        return true
    }

	return false;
}

export const inArray = function(aA, aB) {
    if(aB && aB.indexOf && aB.indexOf(aA) >= 0) {
        return true
    }

	return false;
}

export const notEmpty = function(aA, aB) {
    if(aA && aA.length > 0) {
        return true
    }

	return false;
}

export const greaterThan = function(aA, aB) {
    if(aA > aB) {
        return true
    }

	return false;
}

export const lesserThan = function(aA, aB) {
    if(aA < aB) {
        return true
    }

	return false;
}

export const fullSetup = function() {
    Dbm.getInstance().repository.getItem("compareFunctions/objectExists").setValue("compare", objectExists);

    Dbm.getInstance().repository.getItem("compareFunctions/==").setValue("compare", equals);
    Dbm.getInstance().repository.getItem("compareFunctions/equals").setValue("compare", equals);

    Dbm.getInstance().repository.getItem("compareFunctions/===").setValue("compare", strictEquals);
    Dbm.getInstance().repository.getItem("compareFunctions/strictEquals").setValue("compare", strictEquals);

    Dbm.getInstance().repository.getItem("compareFunctions/!=").setValue("compare", notEquals);
    Dbm.getInstance().repository.getItem("compareFunctions/notEquals").setValue("compare", notEquals);

    Dbm.getInstance().repository.getItem("compareFunctions/!==").setValue("compare", strictNotEquals);
    Dbm.getInstance().repository.getItem("compareFunctions/strictNotEquals").setValue("compare", strictNotEquals);

    Dbm.getInstance().repository.getItem("compareFunctions/arrayContains").setValue("compare", arrayContains);
    Dbm.getInstance().repository.getItem("compareFunctions/inArray").setValue("compare", inArray);

    Dbm.getInstance().repository.getItem("compareFunctions/notEmpty").setValue("compare", notEmpty);

    Dbm.getInstance().repository.getItem("compareFunctions/>").setValue("compare", greaterThan);
    Dbm.getInstance().repository.getItem("compareFunctions/greaterThan").setValue("compare", greaterThan);

    Dbm.getInstance().repository.getItem("compareFunctions/<").setValue("compare", lesserThan);
    Dbm.getInstance().repository.getItem("compareFunctions/lesserThan").setValue("compare", lesserThan);
}