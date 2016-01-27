'use strict';

// ======= Cell constructor ======= //

function cell( x, y ){

	this.current			= false;		// Current state of the cell

	this.aliveNeighbours	= 0;
	
	this.location			= new vec(x,y);	// grid reference of cell

	this.updateSignal 		= false;		// Indicates whether a cell should update this turn

	this.neighbours 		= [];			// Array of neighbour vectors, depending on topology
 	
 	this.findNeighbours( x, y );
	
}

// ======= Populate neighbour array ======= // 

cell.prototype.findNeighbours = function( x, y ){
	switch ( topology ){

		case "torus":
			
			this.neighbours[0] = new vec( ( x -1 +numCellsWidth ) %numCellsWidth , ( y -1 +numCellsHeight ) %numCellsHeight );
			this.neighbours[1] = new vec( ( x -1 +numCellsWidth ) %numCellsWidth ,   y                                      );
			this.neighbours[2] = new vec( ( x -1 +numCellsWidth ) %numCellsWidth , ( y +1 ) %numCellsHeight                 );
			this.neighbours[3] = new vec(   x                                    , ( y -1 +numCellsHeight ) %numCellsHeight );
			this.neighbours[4] = new vec(   x                                    , ( y +1 ) %numCellsHeight                 );
			this.neighbours[5] = new vec( ( x +1 ) %numCellsWidth                , ( y -1 +numCellsHeight ) %numCellsHeight );
			this.neighbours[6] = new vec( ( x +1 ) %numCellsWidth                ,   y                                      );
			this.neighbours[7] = new vec( ( x +1 ) %numCellsWidth                , ( y +1 ) %numCellsHeight                 );

		break;
	
		case "flat":

			this.neighbours[0] = new vec( x -1, y -1 );
			this.neighbours[1] = new vec( x -1, y    );
			this.neighbours[2] = new vec( x -1, y +1 );
			this.neighbours[3] = new vec( x   , y -1 );
			this.neighbours[4] = new vec( x   , y +1 );
			this.neighbours[5] = new vec( x +1, y -1 );
			this.neighbours[6] = new vec( x +1, y    );
			this.neighbours[7] = new vec( x +1, y +1 );

			this.neighbours = this.neighbours.filter( isInside );

		break;
	}
}

// ======= Test if a co-ordinate outside canvas ======= //

function isInside( vector ){
	if( vector.x < 0 || vector.x >= numCellsWidth ) { return false; }
	else if( vector.y < 0 || vector.y >= numCellsHeight ) { return false; }
	else { return true; }
}

// ======= Create 2-d Array of cells ======= //

function createCells(){
	for ( var n = 0; n < numCellsWidth; n++ ){
		CELLS[n] = [];
		for ( var m = 0; m < numCellsHeight; m++ ){
			CELLS[n][m] = new cell( n, m );
		}
	}
}
 
// ======= Update a cells state ======= //

cell.prototype.update =function(){
	
	//var count = 0;	// Counts alive neighbours
	
	if ( !this.neighbours.length ){ alert("error"); }	// Check, cell should have neighbours!

	for ( var n = 0; n < this.neighbours.length; n++){
		if (  CELLS[this.neighbours[n].x][this.neighbours[n].y].current === true ){ 
			this.aliveNeighbours += 1;	// Count alive neighbours 
		}
	}
}

// ======= // Apply cellular automota rules (values taken from HTML form) ======= //

cell.prototype.applyRules = function(){

	if ( this.current == true ){
		if 		( this.aliveNeighbours <  document.getElementById("aliveDeadBelowValue").value  ){ this.current = false; }
		else if ( this.aliveNeighbours <  document.getElementById("aliveAliveBelowValue").value ){ this.current = true;  }
		else 	{ this.current = false; }
	}
	else if ( this.aliveNeighbours == document.getElementById("deadAliveAt").value ){ this.current = true; }
	else { this.current = false; }

	this.aliveNeighbours = 0;
}
	
// ============ Array method for iterating through all members and applying cell::method (foo) ===========

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

	switch ( updateMethod ){

	case "signal" :
		
		var updateArray = [];

		for ( var n = 0; n < numCellsWidth; n++ ){
			for ( var m = 0; m < numCellsHeight; m++ ){
				if ( CELLS[n][m].updateSignal == true ){
					updateArray.push( CELLS[n][m].location );
				}
			}
		}

		for ( var n = 0; n < updateArray.length; n++ ){
			
			var x = updateArray[n].x;
			var y = updateArray[n].y;

			CELLS[x][y].update();

			for ( var m = 0; m < CELLS[x][y].neighbours.length; m++ ){

					CELLS[CELLS[x][y].neighbours[m].x][CELLS[x][y].neighbours[m].y].updateSignal = true;
				
			}
		}	

		for ( var n = 0; n < updateArray.length; n++ ){
			
			CELLS[updateArray[n].x][updateArray[n].y].updateSignal = false;

			CELLS[updateArray[n].x][updateArray[n].y].applyRules();

		}
		
	break;

	case "simultaneous" :

		CELLS.forAll( testCell.update );
		CELLS.forAll( testCell.applyRules );

	break;

	}
}

// Kill (reset) all cells
function killAll(){ 
	CELLS.forAll( testCell.kill ); 
	renderAllCells(); 
}