'use strict';

// ************ Functions that make changes to the canvas ******************
// ** Includes main loop of simulation

// Animate function called at each timestep
function animate(){
	// Main loop contained in web_gl.js
	mainLoop();

}

// Step simulation
function stepSim(){ animate(); }

// Run simulation function
function startSim(){
	if( paused == true ){ 
	timeStep = setInterval( animate, simSpeed ); 
	paused	 = false;
	document.getElementById("startbutton").style.backgroundColor = LightenDarkenColor(deadColor,40);
	document.getElementById("stopbutton").style.backgroundColor  = deadColor;
	}
	else { return; }
}

// Pause Simulation function
function pauseSim(){
	if( paused == false ){ 
	clearInterval( timeStep );
	paused = true;
	document.getElementById("startbutton").style.backgroundColor = deadColor;
	document.getElementById("stopbutton").style.backgroundColor = LightenDarkenColor(deadColor,40);
	}
}

// Mouse position relative to canvas
function getMousePos(canvas, evt) {
    var rect 		= canvas.getBoundingClientRect();
	var mousePos 	= new vec( evt.clientX -rect.left, rect.bottom-evt.clientY );
	return mousePos;
}

// If the window is resized, resize the canvas and shift all the elements
function resizeFunction() {
	var xScaling 		= (window.innerWidth-document.getElementById("menus").offsetWidth) / canvasWidth ;
	var yScaling 		= window.innerHeight / canvasHeight ;
	canvas.width  	= window.innerWidth-document.getElementById("menus").offsetWidth;
	canvas.height 	= window.innerHeight;

	canvasWidth 		= canvas.width;
	canvasHeight 		= canvas.height;
	cellWidth 	*= xScaling;
	cellHeight 	*= yScaling;

	gl.viewport(0, 0, canvas.width, canvas.height);
	renderAllCells();
}

// Click to change cell state or add preset pattern
function clickEvent(event){

	// Don't change the canvas whilst sim running 
	if ( paused == false ){ return; }

	// Get mouse position and convert to cell grid number
	var mousePos 	= getMousePos( canvas, event );
	var x = Math.floor(mousePos.x/cellWidth);
	var y = Math.floor(mousePos.y/cellHeight);
	var mouseVec = new vec( x, y );

	// Print desired pattern
	switch ( document.getElementById("presetlist").value ){

		case "single":
			switchPixelState( mouseVec.x, mouseVec.y );
			renderAllCells();
			break;

		case "random5":
			var random = createRandomBlock(5,5);
			random.printPattern( mouseVec);
			break;

		case "random10":
			var random = createRandomBlock(10,10);
			random.printPattern( mouseVec);
			break;

		case "random50":
			var random = createRandomBlock(50,50);
			random.printPattern( mouseVec);
			break;

		default:
			eval(document.getElementById("presetlist").value).printPattern( mouseVec );
	}
}

// Render a title splash using cells "GAME OF LIFE"
function makeTitle(){
	var titleLocation = new vec(5,numCellsHeight-5);	// Top left location of the pattern
	var title = createTitle();
	title.printPattern( titleLocation );
}