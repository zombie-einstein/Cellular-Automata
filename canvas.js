'use strict';

// ************ Functions ******************

// Update number and size of cells
function updateGrid(){
	pauseSim();
	numCellsWidth 	= Math.floor(document.getElementById("numCellsWidthForm").value);
	numCellsHeight 	= Math.floor(document.getElementById("numCellsHeightForm").value);
	cellWidth 		= canvasWidth / numCellsWidth; 
	cellHeight 		= canvasHeight / numCellsHeight;
	CELLS = [];
	createCells();
	renderAllCells(); 
}

function changeUpdateMethod(){
	updateMethod	= document.getElementById("updating").value;

	if ( updateMethod == "signal"){
		for ( var n = 0; n < numCellsWidth; n++ ){
			for ( var m = 0; m < numCellsHeight; m++ ){
				if ( CELLS[n][m].current == true ){
					CELLS[n][m].updateSignal = true;
					CELLS[n][m].pauseUpdate = true;
				}
			}
		}
	}
}

// Animate
function animate(){
	updateAllCells();
	renderAllCells();
}

// Step simulation
function stepSim(){ animate(); }

// Render square cell
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
	timeStep = setInterval( animate, 200 ); 
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
	var xScaling 		= window.innerWidth / canvas.width ;
	var yScaling 		= (window.innerHeight -100) / canvas.height ;
	ctx.canvas.width  	= window.innerWidth;
	ctx.canvas.height 	= window.innerHeight -100;
	canvasWidth 		= canvas.width;
	canvasHeight 		= canvas.height;
	cellWidth 	*= xScaling;
	cellHeight 	*= yScaling;
	renderAllCells();
}

// Click to change cell state
function clickEvent(event){
	if ( paused == false ){ return; }
	var mousePos 	= getMousePos( canvas, event );
	var x = Math.floor(mousePos.x/cellWidth);
	var y = Math.floor(mousePos.y/cellHeight);
	var mouseVec = new vec( x, y );

	switch ( document.getElementById("presets").value ){

		case "single":
			CELLS[mouseVec.x][mouseVec.y].switch();
			CELLS[mouseVec.x][mouseVec.y].render();
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
	}
}

function makeTitle(){
	var titleLocation = new vec(5,5);
	var title = createTitle();
	CELLS.printPattern( titleLocation, title );
}
