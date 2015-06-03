(function() {
	
	var fileName = "../../../audio/soundwaves/AKWF/AKWF_bw_perfectwaves/AKWF_sin.wav";
	
	var loader = new XMLHttpRequest();
	
	loader.open("GET", fileName, true);
	loader.responseType = "arraybuffer";
	
	loader.onreadystatechange = function() {
		if(loader.readyState === 4 && loader.status < 400) {
			var theContext = new AudioContext();
			
			theContext.decodeAudioData(loader.response, function(buffer) {
				document.getElementById("playButton").addEventListener("click", function(aEvent) {
					var sineSource = theContext.createBufferSource();
					sineSource.buffer = buffer;
					sineSource.loop = true;
					var startTime = theContext.currentTime+0.5;
					sineSource.start(startTime);
					var numberOfLoops = 18;
					sineSource.stop(startTime+numberOfLoops*buffer.duration);
					sineSource.connect(theContext.destination);
				});
			}, function() {});
		}
	}
	loader.send(null);
})();