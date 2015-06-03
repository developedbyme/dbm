(function() {
	var theCanvas = document.getElementById("canvasLowAlpha");
	
	var theContext = theCanvas.getContext("2d");
	
	theContext.beginPath();
	
	theContext.moveTo(100, 100);
	theContext.quadraticCurveTo(150, 80, 200, 100);
	theContext.quadraticCurveTo(220, 150, 200, 200);
	theContext.quadraticCurveTo(150, 220, 100, 200);
	theContext.quadraticCurveTo(80, 150, 100, 100);
	
	theContext.closePath();
	
	theContext.fillStyle = "rgba(255, 255, 255, 5.5e-2)";
	//theContext.fillStyle = "rgba(255, 255, 255, 0.055)";
	theContext.fill();
	
	theContext.strokeStyle = "#FF0000";
	theContext.stroke();
	
	
})();