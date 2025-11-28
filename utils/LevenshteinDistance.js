import Dbm from "../index.js";

export const compare = function(aString1, aString2) {
		
	let string1Length = aString1.length+1;
	let string2Length = aString2.length+1;

	let values = new Dbm.utils.MultidimensionalArrayHolder();
	
	values.setLengths([string1Length, string2Length]);
	
	values.setValue(0, 0, 0);
	
	for(let i = 0; i < string1Length; i++) {
		values.setValue(i, 0, i);
	}
	for(let i = 1; i < string2Length; i++) {
		values.setValue(0, i, i);
	}
	
	for(let i = 1; i < string2Length; i++) {
		for(let j = 1; j < string1Length; j++) {
			let char1 = aString1[j-1];
			let char2 = aString2[i-1];
			
			if(char1 === char2) {
				values.setValue(j, i, values.getValue(j-1, i-1));
			}
			else {
				values.setValue(j, i, Math.min(values.getValue(j-1, i), values.getValue(j, i-1), values.getValue(j-1, i-1))+1);
			}
		}
	}
	
	return values.getValue(string1Length-1, string2Length-1);
};