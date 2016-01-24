'use strict'

// Cell constructor
function cell( x, y ){
	this.current	= false;		// Current state of the cell
	this.future		= false;		// Future state of the cell
	this.location	= new vec(x,y);	// grid reference of cell
}

// Create 2-d Array of cells
function createCells(){
	for ( var n = 0; n < numCellsWidth; n++ ){
		CELLS[n] = [];
		for ( var m = 0; m < numCellsHeight; m++ ){
			CELLS[n][m] = new cell( n, m );
		}
	}
}
 
// Update cells state
cell.prototype.update =function(){
	
	// Check states of neighbouring cells, topologically this is currently a torus
	
	var count = 0;
	if ( CELLS[ ( this.location.x -1 + numCellsWidth ) % numCellsWidth ][ ( this.location.y -1 + numCellsHeight ) % numCellsHeight ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x -1 + numCellsWidth ) % numCellsWidth ][   this.location.y                                        ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x -1 + numCellsWidth ) % numCellsWidth ][ ( this.location.y +1 ) % numCellsHeight                  ].current == true ){ count +=1; }
	if ( CELLS[   this.location.x                                      ][ ( this.location.y -1 + numCellsHeight ) % numCellsHeight ].current == true ){ count +=1; }
	if ( CELLS[   this.location.x                                      ][ ( this.location.y +1 ) % numCellsHeight                  ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x +1 ) % numCellsWidth                 ][ ( this.location.y -1 + numCellsHeight ) % numCellsHeight ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x +1 ) % numCellsWidth                 ][   this.location.y                                        ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x +1 ) % numCellsWidth                 ][ ( this.location.y +1 ) % numCellsHeight                  ].current == true ){ count +=1; }
	
	// Cellular automota rules are used below (values taken from HTML form)
	
	if ( this.current == true ){
		if 		( count <  document.getElementById("aliveDeadBelowValue").value ){ this.future = false; }
		else if ( count <  document.getElementById("aliveAliveBelowValue").value ){ this.future = true;  }
		else 	{ this.future = false; }
	}
	else if (  count == document.getElementById("deadAliveAt").value ){ this.future = true; }
	else { this.future = false; } 
}

// Array method for iterating through all members and applying function (foo)
Array.prototype.forAll = function( foo ){
	for ( var n = 0; n < numCellsWidth; n++ ){
		for ( var m = 0; m < numCellsHeight; m++ ){
			foo.call(this[n][m]);
		}
	}
}

// Render individual cell function
cell.prototype.render = function(){
	if ( this.current == true ){ renderCell( this.location, aliveColor ); }
	else { renderCell( this.location, deadColor ); } 
}

// Switch state of individual cell
cell.prototype.switch = function(){ this.current =!this.current; }
// Update individual cells current state
cell.prototype.futureToCurrent = function(){ this.current = this.future; }
// Kill individual cell
cell.prototype.kill = function(){ 
	this.current = false;
}

// Render all cells
function renderAllCells(){ CELLS.forAll( testCell.render ); }

// Update all cells
function updateAllCells(){ 
	CELLS.forAll( testCell.update ); 
	CELLS.forAll( testCell.futureToCurrent );
}

// Kill (reset) all cells
function killAll(){ 
	CELLS.forAll( testCell.kill ); 
	renderAllCells(); 
}