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
	var count = 0;
	if ( CELLS[ ( this.location.x -1 + numCellsWidth ) % numCellsWidth ][ ( this.location.y -1 + numCellsHeight ) % numCellsHeight ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x -1 + numCellsWidth ) % numCellsWidth ][   this.location.y                                        ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x -1 + numCellsWidth ) % numCellsWidth ][ ( this.location.y +1 ) % numCellsHeight                  ].current == true ){ count +=1; }
	if ( CELLS[   this.location.x                                      ][ ( this.location.y -1 + numCellsHeight ) % numCellsHeight ].current == true ){ count +=1; }
	if ( CELLS[   this.location.x                                      ][ ( this.location.y +1 ) % numCellsHeight                  ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x +1 ) % numCellsWidth                 ][ ( this.location.y -1 + numCellsHeight ) % numCellsHeight ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x +1 ) % numCellsWidth                 ][   this.location.y                                        ].current == true ){ count +=1; }
	if ( CELLS[ ( this.location.x +1 ) % numCellsWidth                 ][ ( this.location.y +1 ) % numCellsHeight                  ].current == true ){ count +=1; }
	if 		( count < 3 ){ this.future = false; }
	else if ( count < 6 ){ this.future = true;  }
	else 				 { this.future = false; }
}

Array.prototype.forAll = function( foo ){
	for ( var n = 0; n < numCellsWidth; n++ ){
		for ( var m = 0; m < numCellsHeight; m++ ){
			foo.call(this[n][m]);
		}
	}
}

// Render cell function
cell.prototype.render = function(){
	if ( this.current == true ){ renderCell( this.location, '#ff0000' ); }
	else { renderCell( this.location, '#0000ff' ); } 
}

cell.prototype.switch = function(){ this.current =!this.current; }
cell.prototype.futureToCurrent = function(){ this.current = this.future; }
cell.prototype.kill = function(){ this.current = false; }

// Render cells
function renderAllCells(){ CELLS.forAll( testCell.render ); }

// Update all cells
function updateAllCells(){ 
	CELLS.forAll( testCell.update ); 
	CELLS.forAll( testCell.futureToCurrent );
}

function killAll(){ CELLS.forAll( testCell.kill ); renderAllCells(); }