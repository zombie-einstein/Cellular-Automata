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

// ======= Recalculate cell's neighbours =======//

cell.prototype.generateNeighbours = function(){
	this.neighbours 	= [];
	this.findNeighbours( this.location.x, this.location.y );
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

// ======= Apply cellular automota rules (values taken from HTML form) ======= //

cell.prototype.applyRules = function(){

	for( var n = 0; n < 3; n++){
		if( this.current == rulesIf[n] && conditionCheck( this.aliveNeighbours, rulesThan[n], rulesAnd[n]  ) ){
		this.current = rulesThen[n];
		}
	}
	
	this.aliveNeighbours = 0;
}

// Check a condition given a string operator

function conditionCheck( count, value, condition ){
	switch( condition ){

		case "<":
			return count < value;
			break;

		case "=":
			return count == value;
			break;

		case ">":
			return count > value;
			break;
	}
}

// update ruleset from HTML
function updateRuleset(){
	rulesIf 	= [( document.getElementById("AIf").value == "true"),( document.getElementById("BIf").value == "true"),( document.getElementById("CIf").value == "true")];
	rulesAnd 	= [ document.getElementById("AAnd").value, document.getElementById("BAnd").value, document.getElementById("CAnd").value];
	rulesThan 	= [ document.getElementById("AThan").value, document.getElementById("BThan").value, document.getElementById("CThan").value];
	rulesThen 	= [( document.getElementById("AThen").value == "true"),( document.getElementById("BThen").value == "true"), (document.getElementById("CThen").value == "true")];

	console.log(rulesIf);
	console.log(rulesAnd);
	console.log(rulesThan);
	console.log(rulesThen);
}


// ============ Array method for iterating through all members and applying cell::method (foo) ===========

Array.prototype.forAll = function( foo ){
	for ( var n = 0; n < numCellsWidth; n++ ){
		for ( var m = 0; m < numCellsHeight; m++ ){
			foo.call(this[n][m]);
		}
	}
}

// ======= Render individual cell function ======= //

cell.prototype.render = function(){
	if ( this.current == true ){ renderCell( this.location, aliveColor ); }
	else { renderCell( this.location, deadColor ); } 
}

// Switch state of individual cell
cell.prototype.switch = function(){ this.current =!this.current; }
// Kill individual cell
cell.prototype.kill = function(){ this.current = false; }

// Render all cells
function renderAllCells(){ CELLS.forAll( testCell.render ); }

// Update all cells
function updateAllCells(){ 

	switch ( updateMethod ){

	case "signal" :
		
		// First mark cells to be updated this turn
		for ( var n = 0; n < numCellsWidth; n++ ){
			for ( var m = 0; m < numCellsHeight; m++ ){
				if ( CELLS[n][m].updateSignal == true ){
					
					CELLS[n][m].updateThisTurn = true;

				}
			}
		}
		// Update marked cells and send signal to neighbour 
		for ( var n = 0; n < numCellsWidth; n++ ){
			for ( var m = 0; m < numCellsHeight; m++ ){
				if ( CELLS[n][m].updateThisTurn == true ){
					
					CELLS[n][m].update();

					for ( var i = 0; i < CELLS[n][m].neighbours.length; i++ ){

						CELLS[CELLS[n][m].neighbours[i].x][CELLS[n][m].neighbours[i].y].updateSignal = true;
				
					}

				}
			}
		}
		// Apply rules to marked cells, and reset their update signal so they don't update next turn
		for ( var n = 0; n < numCellsWidth; n++ ){
			for ( var m = 0; m < numCellsHeight; m++ ){
				if ( CELLS[n][m].updateThisTurn == true ){
					
					CELLS[n][m].updateSignal = false;
					CELLS[n][m].updateThisTurn = false;
					CELLS[n][m].applyRules();

				}
			}
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