export const createNiceFileName = function(aFileName) {
    let fileName = aFileName.toLowerCase();

    fileName = fileName.replace(/[åäã]/gi, 'a');
    fileName = fileName.replace(/[ö]/gi, 'o');
    fileName = fileName.replace(/ /gi, '-');
    fileName = fileName.replace(/[\(\),\*']/gi, '');
    fileName = fileName.replace(/[^a-z0-9\-_\.]/gi, '-');
    fileName = fileName.replace(/\-+/gi, '-');

    return fileName;
}

export const createNiceFilePath = function(aFileName) {
    let fileName = aFileName.toLowerCase();

    fileName = fileName.replace(/[åäã]/gi, 'a');
    fileName = fileName.replace(/[ö]/gi, 'o');
    fileName = fileName.replace(/ /gi, '-');
    fileName = fileName.replace(/[\(\),\*']/gi, '');
    fileName = fileName.replace(/[^a-z0-9\-_\.\/]/gi, '-');
    fileName = fileName.replace(/\-+/gi, '-');

    return fileName;
}

export const convertToCamelCase = function(aText) {
    let currentArray = aText.split(" ");
    let currentArrayLength = currentArray.length;
    let returnText = currentArray[0].toLowerCase();
    //METODO: handle special characters
    for(let i = 1; i < currentArrayLength; i++) { //MENOTE: first iteration is done outside of loop
        let currentString = currentArray[i].toLowerCase();
        if(currentString.length > 0) {
            returnText += currentString[0].toUpperCase() + currentString.substring(1, currentString.length);
        }
    }
    
    return returnText;
};

export const getMatchingPrefix = function(aString1, aString2) {
    let maxLength = Math.min(aString1.length, aString2.length);
    let i = 0;

    while(i < maxLength && aString1[i] === aString2[i]) {
        i++;
    }

    return aString1.slice(0, i);
}