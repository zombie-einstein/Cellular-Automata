'use strict';

// ************ Functions ******************

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

// Click to change boid state
function clickEvent(event){
	if ( paused == false ){ return; }
	var mousePos 	= getMousePos( canvas, event );
	var x = Math.floor(mousePos.x/cellWidth);
	var y = Math.floor(mousePos.y/cellHeight);
	CELLS[x][y].switch();
	CELLS[x][y].render();
}	

// Add boid at mouse click
function addBoidAtClick(event){
	var mousePos 	= getMousePos( canvas, event );
	var mouseVec 	= new vec( mousePos.x, mousePos.y )
	if ( mousePos.obstacleDetect(5) == true ){ return; }
	var temp 	 	= new boid();
	temp.position 	= mouseVec;
	temp.velocity 	= randomVelocity( maxVelocity );
	Boids.push(temp);
	Boids[Boids.length-1].render();
	numBoids++;
	document.getElementById("boidNumber").innerHTML = numBoids;
}