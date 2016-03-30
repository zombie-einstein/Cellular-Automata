'use strict';

// ************ Functions that make changes to the canvas ******************


// Step simulation
function stepSim(){ mainCanvas.mainLoop(); }

// Run simulation function
function startSim(){

	// Check sim isn't already running
	if( mainCanvas.paused == true ){
		mainCanvas.timeStep = setInterval( stepSim, mainCanvas.speed );
		mainCanvas.paused	= false;
		// Lighten start button to indicate status
		document.getElementById("startbutton").style.backgroundColor = LightenDarkenColor(deadColor,40);
		document.getElementById("stopbutton").style.backgroundColor  = deadColor;
	}
	else { return; }

}

// Pause Simulation function
function pauseSim(){

	// Check sim isn't already paused
	if( mainCanvas.paused == false ){
		clearInterval( mainCanvas.timeStep );
		mainCanvas.paused = true;
		// Lighten pause button to indicate status
		document.getElementById("startbutton").style.backgroundColor = deadColor;
		document.getElementById("stopbutton").style.backgroundColor  = LightenDarkenColor(deadColor,40);
	}
	else{ return; }

}

// Get Mouse position relative to canvas
function getMousePos( canvas, evt ){

    var rect 		= canvas.getBoundingClientRect();
		var mousePos 	= new vec( evt.clientX -rect.left, rect.bottom-evt.clientY );
		return mousePos;

}

// If the window is resized, resize the canvas and shift all the elements
function resizeFunction() {

	// Calculate scaling ratio of new canvas area
	var xScaling 		= ( window.innerWidth-document.getElementById("menus").offsetWidth) / mainCanvas.dimensions.x ;
	var yScaling 		= window.innerHeight / mainCanvas.dimensions.y ;
	// Set new canvas width
	mainCanvas.dimensions.x  	= window.innerWidth-document.getElementById("menus").offsetWidth;
	mainCanvas.dimensions.y 	= window.innerHeight;
	mainCanvas.resize();
	// Applying scaling to cell dimensions
	cells.d.x 	*= xScaling;
	cells.d.y 	*= yScaling;
	// Reset resolution of WebGL and re-render
	mainCanvas.gl.viewport(0, 0, mainCanvas.dimensions.x, mainCanvas.dimensions.y );
	mainCanvas.renderCells();

}

// Click to change cell state or add preset pattern
function clickEvent( event ){

	// Get mouse position and convert to cell grid number
	var mousePos 	= mainCanvas.getMousePos( event );
	var x = Math.floor(mousePos.x /cells.d.x);
	var y = Math.floor(mousePos.y /cells.d.y);
	var mouseVec = new vec( x, y );

	// Print desired pattern
	switch ( document.getElementById("presetlist").value ){

		case "single":
			mainCanvas.switchPixelState( mouseVec.x, mouseVec.y );
			mainCanvas.renderCells();
			break;

		case "random5":
			var random = createRandomBlock(5,5);
			random.printPattern( mouseVec );
			break;

		case "random10":
			var random = createRandomBlock(10,10);
			random.printPattern( mouseVec );
			break;

		case "random50":
			var random = createRandomBlock(50,50);
			random.printPattern( mouseVec );
			break;

		default:
			eval(document.getElementById("presetlist").value).printPattern( mouseVec );

	}
}

// Render a title splash using cells "GAME OF LIFE"
function makeTitle(){
	var titleLocation = new vec( 5, cells.n.y-5);	// Top left location of the pattern
	var title = createTitle();
	title.printPattern( titleLocation );
}