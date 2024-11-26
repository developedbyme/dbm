export let createNiceFileName = function(aFileName) {
    let fileName = aFileName.toLowerCase();

    fileName = fileName.replace(/[åäã]/gi, 'a');
    fileName = fileName.replace(/[ö]/gi, 'o');
    fileName = fileName.replace(/ /gi, '-');
    fileName = fileName.replace(/[\(\),\*']/gi, '');
    fileName = fileName.replace(/[^a-z0-9\-_\.]/gi, '-');
    fileName = fileName.replace(/\-+/gi, '-');

    return fileName;
}

export let createNiceFilePath = function(aFileName) {
    let fileName = aFileName.toLowerCase();

    fileName = fileName.replace(/[åäã]/gi, 'a');
    fileName = fileName.replace(/[ö]/gi, 'o');
    fileName = fileName.replace(/ /gi, '-');
    fileName = fileName.replace(/[\(\),\*']/gi, '');
    fileName = fileName.replace(/[^a-z0-9\-_\.\/]/gi, '-');
    fileName = fileName.replace(/\-+/gi, '-');

    return fileName;
}