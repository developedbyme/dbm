var x = 0, y = 0, h = 200, w = 300;
var x2 = 0, y2 = 0, h = 200, w = 300;
var x3 = 0, y3 = 0, h = 200, w = 300;
var x4 = 0, y4 = 0, h = 200, w = 300;
var x5 = 0, y5 = 0, h = 200, w = 300;
var x6 = 0, y6 = 0, h = 200, w = 300;
var dx = 30, dy = 30;
var movex = 10, movey = 10;
var bhx, bhy;
var bx1 = 200, by1 = 300, bx2 = 200, by2 = 500, bx3 = 200, by3 = 600, bx4 = 200, by4 = 500;
var newWindow;
var window2;
var window3;
var window4;
var window5;
var window6;
var bubbleHolder;
var bubble1, bubble2, bubble3, bubble4;
var randomGate = 0;

function makeNewWindow() {
	if (!newWindow || newWindow.closed) {
		newWindow = window.open("","sub","status,height=200,width=300");
		newWindow.moveTo(x,y);
		if (!newWindow.oponer) {
			newWindow.opener = window;
		}
		setTimeout("writeToWindow()", 500);
	} else if (newWindow.focus) {
		newWindow.focus();
	}
}

function secondWin() {
	window2 = window.open("", "sub2", "status, height=200,width=300");
	x2 = 0;
	y2 = 200;
	window2.moveTo(x2,y2);
}

function thirdWin() {
	window3 = window.open("", "sub3", "status, height=200,width=300");
	x3 = 0;
	y3 = 400;
	window3.moveTo(x3,y3);
}

function fourthWin() {
	window4 = window.open("", "sub4", "status, height=200,width=300");
	x4 = 0;
	y4 = 600;
	window4.moveTo(x4,y4);
}

function fithWin() {
	window5 = window.open("", "sub5", "status, height=200,width=300");
	x5 = 0;
	y5 = 800;
	window5.moveTo(x5,y5);
}

function sixthWin() {
	window6 = window.open("", "sub6", "status, height=200,width=300");
	x6 = 0;
	y6 = 1000;
	window6.moveTo(x6,y6);
}

function windowLoop() {
	for(i = 0; i< 50; i++) {
		var xrand_no = Math.floor(Math.random()*innerWidth);
		var yrand_no = Math.floor(Math.random()*innerHeight);
		x += (xrand_no - x) * 0.3;
		y += (yrand_no - y) * 0.3;
		var ranWidth = Math.floor(Math.random()*innerWidth/60);
		var ranHeight = Math.floor(Math.random()*innerHeight/60);
		console.log("ranWidth"+ranWidth);
		newWindow.moveTo(x,y);
		newWindow.resizeBy(ranWidth,ranHeight);
		setTimeout("writeToWindow()", 500);	}
}


function writeToWindow() {
	var newContent = "<html><head><title>Sub Window</title></head>";
	newContent += "<body><h1>Control this new window.</h1>";
	newContent += "</body></html>";
	newWindow.document.write(newContent);
	newWindow.document.close();
}


function moveWindowLeft() {
	x -= dx;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowRight() {
	x += dx;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowUp() {
	y -= dy;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowDown() {
	y += dy;
	
	console.log("x:"+x);
	console.log("y:"+y);
	
	newWindow.moveTo(x, y);
	newWindow.focus();
}
//
function moveWindowUpLeft() {
	x -= dx;
	y -= dy;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowUpRight() {
	x += dx;
	y -= dy;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowDownLeft() {
	y += dy;
	x -= dx;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowDownRight() {
	y += dy;
	x += dx;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function moveWindowReset() {
	x = 0;
	y = 0;
	
	console.log("x:"+x);
	console.log("y:"+y);
	newWindow.moveTo(x, y);
	newWindow.height(200);
	newWidnow.width(300);
	newWindow.focus();
}

function random() {
		var xrand_no = Math.floor(Math.random()*innerWidth);
		var yrand_no = Math.floor(Math.random()*innerHeight);

		x = xrand_no;
		y = yrand_no;
		
		
		newWindow.moveTo(x, y);
}

function shake() {
	x += 40
	newWindow.moveTo(x, y);
	x -= 80
	newWindow.moveTo(x, y);
	x += 80
	newWindow.moveTo(x, y);
	x -= 80
	newWindow.moveTo(x, y);
	x += 40
	newWindow.moveTo(x, y);
	newWindow.focus();
}

function resize() {
	newWindow.resizeBy(-50, -50);
	newWindow.resizeBy(50, 50);
	newWindow.resizeBy(-100, -100);
	newWindow.resizeBy(50, 50);
	newWindow.resizeBy(50, 50);
	newWindow.resizeBy(100, 100);
	newWindow.resizeBy(-50, -50);
	newWindow.resizeBy(-50, -50);
	newWindow.focus();
}

function scrollRight() {
	for(h = 0; h< 100; h++) {
		x +=dx;
		x2 +=dx-2;
		x3 +=dx-4;
		x4 +=dx-6;
		x5 +=dx-8;
		x6 +=dx-10;
		newWindow.moveTo(x,y);
		window2.moveTo(x2,y2);
		window3.moveTo(x3,y3);
		window4.moveTo(x4,y4);
		window5.moveTo(x5,y5);
		window6.moveTo(x6,y6);
	}
}

function moveLeft() {
	for(h = 0; h< 100; h++) {
		x -=dx;
		x2 -=dx+2;
		x3 -=dx+4;
		x4 -=dx+6;
		x5 -=dx+8;
		x6 -=dx+10;
		newWindow.moveTo(x,y);
		window2.moveTo(x2,y2);
		window3.moveTo(x3,y3);
		window4.moveTo(x4,y4);
		window5.moveTo(x5,y5);
		window6.moveTo(x6,y6);
	}
}

function openMoveMultiple() {
	if (!bubbleHolder || bubbleHolder.closed) {
		bubbleHolder = window.open("", "bubbleHolder", "status, height=500,width=200");
		bhx = 200;
		bhy = 300;
		bubbleHolder.moveTo(bhx,bhy);
		var bubbleContent = "<html><head><title>Bubble Window</title></head>";
		bubbleContent += "<body><h1>Bubble</h1>";
		bubbleContent += "</body></html>";
		bubbleHolder.document.write(bubbleContent);
		bubbleHolder.document.close();
		if (!bubbleHolder.oponer) {
			bubbleHolder.opener = window;
		}
		setTimeout("smallBubbles()", 1000);
	} else if (bubbleHolder.focus) {
		bubbleHolder.focus();
	}
}

function smallBubbles() {
	bubble1 = window.open("", "bubble1", "status, height=200,width=200");
	bubble2 = window.open("", "bubble2", "status, height=200,width=200");
	bubble3 = window.open("", "bubble3", "status, height=200,width=200");
	bubble4 = window.open("", "bubble4", "status, height=100,width=100");
	bubble1.moveTo(bx1,by1);
	bubble2.moveTo(bx2,by2);
	bubble3.moveTo(bx3,by3);
	bubble4.moveTo(bx4,by4);
	
	// bubble 1 //
	var bubble1Content = "<html><head><title>Bubble1 Window</title></head>";
	bubble1Content += "<body style='background-color: red;'><h1>Bubble1</h1>";
	bubble1Content += "</body></html>";
	bubble1.document.write(bubble1Content);
	bubble1.document.close();
	
	// bubble 2 //
	var bubble2Content = "<html><head><title>Bubble2 Window</title></head>";
	bubble2Content += "<body style='background-color: yellow;'><h1>Bubble2</h1>";
	bubble2Content += "</body></html>";
	bubble2.document.write(bubble2Content);
	bubble2.document.close();
	
	// bubble 3 //
	var bubble3Content = "<html><head><title>Bubble3 Window</title></head>";
	bubble3Content += "<body style='background-color: blue;'><h1>Bubble3</h1>";
	bubble3Content += "</body></html>";
	bubble3.document.write(bubble3Content);
	bubble3.document.close();
	
	// bubble 4 //
	var bubble4Content = "<html><head><title>Bubble4 Window</title></head>";
	bubble4Content += "<body style='background-color: green;'><h1>Bubble4</h1>";
	bubble4Content += "</body></html>";
	bubble4.document.write(bubble4Content);
	bubble4.document.close();
	//
	setTimeout("moveBubbles()", 500);
}

function moveBubbles() {
	for(i = 0; i< 150; i++){
		if(i < 75) {
			bx1 = bx1+movex;
			by1 = by1-movey;
			bx2 = bx2+movex;
			by2 = by2;
			bx3 = bx3+movex;
			by3 = by3+movey;
			bx4 = bx4+(movex*1.5);
			by4 = by4+(movey*1.5);

			bubble1.moveTo(bx1,by1);
			bubble2.moveTo(bx2,by2);
			bubble3.moveTo(bx3,by3);
			bubble4.moveTo(bx4,by4);
		} else if (i > 75) {
			bx1 = bx1-movex;
			by1 = by1+movey;
			bx2 = bx2-movex;
			by2 = by2;
			bx3 = bx3-movex;
			by3 = by3-movey;
			bx4 = bx4-(movex*1.5);
			by4 = by4-(movey*1.5);

			bubble1.moveTo(bx1,by1);
			bubble2.moveTo(bx2,by2);
			bubble3.moveTo(bx3,by3);
			bubble4.moveTo(bx4,by4);
		} else if(i = 150) {
				bubble1.close();
				bubble2.close();
				bubble3.close();
				bubble4.close();
		}

	}
}
function closeAll() {
	
	newWindow.close();
	window2.close();
	window3.close();
	window4.close();
	window5.close();
	window6.close();
	bubble1.close();
	bubble2.close();
	bubble3.close();
	bubble4.close();
}
