'use strict';

// ======= Cell constructor ======= //

function cell( x, y ){

	this.current			= false;		// Current state of the cell

	this.aliveNeighbours	= 0;
	
	this.location			= new vec(x,y);	// grid reference of cell

	this.updateSignal 		= false;		// Indicates whether a cell should update next turn

	this.updateThisTurn		= false;		// Used to flag cell to be updated 
	
	this.generateNeighbours( );
	
}

// Reset and calculate cell's neighbours

cell.prototype.generateNeighbours = function( ){
	
	this.neighbours 		= [];

	// General list of neighbours, not taking into account topology
	this.neighbours[0] 		= new vec( this.location.x -1, this.location.y -1 );
	this.neighbours[1] 		= new vec( this.location.x -1, this.location.y    );
	this.neighbours[2] 		= new vec( this.location.x -1, this.location.y +1 );
	this.neighbours[3] 		= new vec( this.location.x   , this.location.y -1 );
	this.neighbours[4] 		= new vec( this.location.x   , this.location.y +1 );
	this.neighbours[5] 		= new vec( this.location.x +1, this.location.y -1 );
	this.neighbours[6] 		= new vec( this.location.x +1, this.location.y    );
	this.neighbours[7] 		= new vec( this.location.x +1, this.location.y +1 );

	// Restrict cells if von neumann is true
	if ( vonNeumann ){ this.neighbours = [this.neighbours[1],this.neighbours[3],this.neighbours[4],this.neighbours[6]]; }

	// Restrict cells if using 1-D algorithm
	if ( currentUpdateMethod.name == "One-Dimensional" ){ this.applyOneD( numCellsWidth, numCellsHeight ); }		

	// Apply topological rules to neighbour list
	this.findNeighbours( numCellsWidth, numCellsHeight );

}

// Change neighbour locations according to topology

cell.prototype.findNeighbours = function( width, height ){
	
	switch ( topology ){

		case "torus":
			
			this.applyTorus( width, height );

		break;
	
		case "flat":
			
			this.applyFlat( width, height );

		break;
	}
}

// Create 2-d Array of cells 

Array.prototype.createCells = function( width, height ){
	for ( var n = 0; n < width; n++ ){
		this[n] = [];
		for ( var m = 0; m < height; m++ ){
			this[n][m] = new cell( n, m );
		}
	}
	console.log("Array of cells "+width.toString()+"x"+height.toString()+" created");
}

// Apply torus rules to neighbour list

cell.prototype.applyTorus = function( width, height ){
	this.neighbours = this.neighbours.map( function( obj ){
		obj.x = ( obj.x +width ) %width ;
		obj.y = ( obj.y +height) %height;
		return obj;
	});
}

// Apply flat space to neighbour list

cell.prototype.applyFlat = function( width, height ){
	this.neighbours = this.neighbours.filter( function( obj ){
		return obj.x >= 0 && obj.x < width && obj.y >= 0 && obj.y < height;
	});
}

// Apply one dimensional rules to neighbours list

cell.prototype.applyOneD = function( width, height ){
	this.neighbours = [ this.neighbours[0],this.neighbours[2]];
}

// Count the cells number of live neighbours

cell.prototype.update =function(){
	
	if ( this.neighbours.length == 0 ){ return; }	// Check, cell should have neighbours!

	for ( var n = 0; n < this.neighbours.length; n++){
		if (  CELLS[this.neighbours[n].x][this.neighbours[n].y].current === true ){ 
			this.aliveNeighbours += 1;	// Count alive neighbours 
		}
	}
}

// Apply cellular automota rules (values taken from HTML form)

cell.prototype.applyRules = function(){

	for( var n = 0; n < currentRuleSet.number; n++){
		if( this.current == currentRuleSet.if[n] && this.conditionCheck( currentRuleSet.than[n], currentRuleSet.and[n]  ) ){
		this.current = currentRuleSet.then[n];
		}
	}	
	
	// reset neigbour count before next loop
	this.aliveNeighbours = 0;
}

// Check a condition given a operator in the form of a string

cell.prototype.conditionCheck = function( value, condition ){
	switch( condition ){

		case "<":
			return this.aliveNeighbours < value;
			break;

		case "=":
			return this.aliveNeighbours == value;
			break;

		case ">":
			return this.aliveNeighbours > value;
			break;
	}
}

// Array method for iterating through all members and applying cell method 

Array.prototype.forAll = function( callback ){
	for ( var n = 0; n < numCellsWidth; n++ ){
		for ( var m = 0; m < numCellsHeight; m++ ){
			callback.call(this[n][m]);
		}
	}
}

// Render individual cell function

cell.prototype.render = function(){

	if ( this.current == true ){ renderCell( this.location, aliveColor ); }
	if ( showUpdating != false ){ 
		if ( this.updateSignal == true){ renderCell( this.location, showUpdating ); }
	 }
}

// Switch state of individual cell
cell.prototype.switch = function(){ 

	this.current =!this.current;

	if ( currentUpdateMethod.name == "Signal" ){
		this.updateSignal = this.current;
	}
}

// Make individual cell alive
cell.prototype.makeAlive = function(){
	this.current = true;
	if ( currentUpdateMethod.name == "Signal" ){
		this.sendSignal();
	}
}

// Kill individual cell
cell.prototype.kill = function(){ 
	this.current = false; 
	if ( currentUpdateMethod.name == "Signal" ){
		this.killSignal();
	}
}

// Clear update signal
cell.prototype.killSignal = function(){
	this.updateSignal = false;
}

// Send update signal
cell.prototype.sendSignal = function(){
	this.updateSignal = true;
}

// Render all cells
function renderAllCells(){ 
	// clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	CELLS.forAll( testCell.render ); }

// Update all cells according to method

function updateAllCells(){ 

	// Apply the current update method
	currentUpdateMethod.apply();
	
}

// Kill (reset) all cells
function killAll(){ 
	
	// Reset all cells and signals to false, then render
	pauseSim();
	CELLS.forAll( testCell.kill );
	CELLS.forAll( testCell.killSignal );
	renderAllCells();

	// Use this method to reset initial conditions
	// Specific to certain algorithms
	changeUpdateMethod();

	console.log("All cells & signals reset")
}
