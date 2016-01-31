'use strict';

// ************ Functions that make changes to the canvas ******************

// Animate function called at each timestep

function animate(){
	updateAllCells();
	renderAllCells();
}

// Step simulation

function stepSim(){ animate(); }

// Render a square cell at a vector location

function renderCell( location , color ){
	ctx.beginPath();
	ctx.moveTo( location.x*cellWidth, location.y*cellHeight );
	ctx.lineTo( (location.x +1)*cellWidth, location.y*cellHeight );
	ctx.lineTo( (location.x +1)*cellWidth, (location.y +1)*cellHeight );
	ctx.lineTo( location.x*cellWidth, (location.y +1)*cellHeight );
	ctx.fillStyle =  color;
	ctx.fill();
}

// Render Line

function renderLine( start, end, color ){
	ctx.beginPath();
	ctx.moveTo( start.x, start.y );
	ctx.lineTo( end.x, end.y );
	ctx.strokeStyle =  color;
	ctx.stroke();
}

// Run simulation function

function startSim(){
	if( paused == true ){ 
	timeStep = setInterval( animate, simSpeed ); 
	paused	 = false; 
	}
	else { return; }
}

// Pause Simulation function

function pauseSim(){
	if( paused == false ){ 
	clearInterval( timeStep );
	paused = true;
	}
}

// Mouse position relative to canvas

function getMousePos(canvas, evt) {
    var rect 		= canvas.getBoundingClientRect();
	var mousePos 	= new vec(evt.clientX - rect.left,evt.clientY - rect.top);
	return mousePos;
}

// If the window is resized, resize the canvas and shift all the elements
function resizeFunction() {
	var xScaling 		= (window.innerWidth-document.getElementById("menus").offsetWidth) / canvasWidth ;
	var yScaling 		= window.innerHeight / canvasHeight ;
	ctx.canvas.width  	= window.innerWidth-document.getElementById("menus").offsetWidth;
	ctx.canvas.height 	= window.innerHeight;
	canvasWidth 		= canvas.width;
	canvasHeight 		= canvas.height;
	cellWidth 	*= xScaling;
	cellHeight 	*= yScaling;
	renderAllCells();
}

// Click to change cell state or add preset pattern
function clickEvent(event){
	if ( paused == false ){ return; }
	var mousePos 	= getMousePos( canvas, event );
	var x = Math.floor(mousePos.x/cellWidth);
	var y = Math.floor(mousePos.y/cellHeight);
	var mouseVec = new vec( x, y );

	switch ( document.getElementById("presets").value ){

		case "single":
			CELLS[mouseVec.x][mouseVec.y].switch();
			//CELLS[mouseVec.x][mouseVec.y].render();
			renderAllCells();
			break;

		case "glider":
			var glider = createGlider();
			CELLS.printPattern( mouseVec, glider );
			break;

		case "block":
			var block = createBlock();
			CELLS.printPattern( mouseVec, block );
			break;

		case "beehive":
			var beehive = createBeehive();
			CELLS.printPattern( mouseVec, beehive );
			break;

		case "LWSS":
			var LWSS = createLWSS();
			CELLS.printPattern( mouseVec, LWSS );
			break;

		case "gospelgun":
			var gospelGun = createGospelGun();
			CELLS.printPattern( mouseVec, gospelGun );
			break;

		case "random5":
			var random = createRandomBlock(5,5);
			CELLS.printPattern( mouseVec, random );
			break;

		case "random10":
			var random = createRandomBlock(10,10);
			CELLS.printPattern( mouseVec, random );
			break;

		case "random50":
			var random = createRandomBlock(50,50);
			CELLS.printPattern( mouseVec, random );
			break;
	}
}

// Render a title splash using cells "GAME OF LIFE"

function makeTitle(){
	var titleLocation = new vec(5,5);	// Top left location of the pattern
	var title = createTitle();
	CELLS.printPattern( titleLocation, title );
}