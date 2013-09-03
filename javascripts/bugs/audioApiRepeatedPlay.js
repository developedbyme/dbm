(function() {
	
	var fileName = "../audio/soundwaves/AKWF/AKWF_0012/AKWF_1101.wav";
	
	var loader = new XMLHttpRequest();
	
	loader.open("GET", fileName, true);
	loader.responseType = "arraybuffer";
	
	loader.onreadystatechange = function() {
		if(loader.readyState === 4 && loader.status < 400) {
			var theContext = new webkitAudioContext();
			
			theContext.decodeAudioData(loader.response, function(buffer) {
				var sineSource = theContext.createBufferSource();
				sineSource.buffer = buffer;
				sineSource.loop = true;
				sineSource.noteOn(1);
				sineSource.noteOff(2);
				sineSource.noteOn(3);
				sineSource.noteOff(4);
				sineSource.connect(theContext.destination);
			}, function() {});
		}
	}
	loader.send(null);
})();