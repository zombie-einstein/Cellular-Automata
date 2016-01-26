'use strict'

// ======= Cell constructor =======
function cell( x, y ){

	this.current	= false;		// Current state of the cell
	this.future		= false;		// Future state of the cell
	this.location	= new vec(x,y);	// grid reference of cell

	this.updateSignal = false;
	this.pauseUpdate  = false;

	this.neighbours = [];
 
	this.neighbours[0] = new vec( ( this.location.x -1 +numCellsWidth ) %numCellsWidth , ( this.location.y -1 +numCellsHeight ) %numCellsHeight );
	this.neighbours[1] = new vec( ( this.location.x -1 +numCellsWidth ) %numCellsWidth ,   this.location.y                                      );
	this.neighbours[2] = new vec( ( this.location.x -1 +numCellsWidth ) %numCellsWidth , ( this.location.y +1 ) %numCellsHeight                 );
	this.neighbours[3] = new vec(   this.location.x                                    , ( this.location.y -1 +numCellsHeight ) %numCellsHeight );
	this.neighbours[4] = new vec(   this.location.x                                    , ( this.location.y +1 ) %numCellsHeight                 );
	this.neighbours[5] = new vec( ( this.location.x +1 ) %numCellsWidth                , ( this.location.y -1 +numCellsHeight ) %numCellsHeight );
	this.neighbours[6] = new vec( ( this.location.x +1 ) %numCellsWidth                ,   this.location.y                                      );
	this.neighbours[7] = new vec( ( this.location.x +1 ) %numCellsWidth                , ( this.location.y +1 ) %numCellsHeight                 );
	
}

// ======= Create 2-d Array of cells =======
function createCells(){
	for ( var n = 0; n < numCellsWidth; n++ ){
		CELLS[n] = [];
		for ( var m = 0; m < numCellsHeight; m++ ){
			CELLS[n][m] = new cell( n, m );
		}
	}
}
 
// ======= Update cells state =======

cell.prototype.update =function(){
	
	// Check states of neighbouring cells, topologically this is currently a torus
	
	var count = 0;
	
	for ( var n = 0; n < this.neighbours.length; n++){
		if (  CELLS[this.neighbours[n].x][this.neighbours[n].y].current == true ){ count += 1; }
	}

	// Cellular automota rules are used below (values taken from HTML form)
	
	if ( this.current == true ){
		if 		( count <  document.getElementById("aliveDeadBelowValue").value ){ this.future = false; }
		else if ( count <  document.getElementById("aliveAliveBelowValue").value ){ this.future = true;  }
		else 	{ this.future = false; }
	}
	else if (  count == document.getElementById("deadAliveAt").value ){ this.future = true; }
	else { this.future = false; } 
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

	if ( updateMethod == "signal"){
		var updateList = [];
		for ( var n = 0; n < numCellsWidth; n++ ){
			for ( var m = 0; m < numCellsHeight; m++ ){
				if ( CELLS[n][m].updateSignal == true ){
					var tempVec = new vec( n, m );
					updateList.push(tempVec);
				}
				else{ CELLS[n][m].pauseUpdate  = false; }
			}
		}
		for ( var n = 0; n < updateList.length; n++){
			//alert( String( updateList[n].x ) +String( updateList[n].y ) );
			CELLS[ updateList[n].x ][ updateList[n].y ].update();
			CELLS[ updateList[n].x ][ updateList[n].y ].updateSignal = false;
			CELLS[ updateList[n].x ][ updateList[n].y ].pauseUpdate  = true;
			for ( var m = 0; m < CELLS[ updateList[n].x ][ updateList[n].y ].neighbours.length; m++){
				if ( CELLS[CELLS[ updateList[n].x ][ updateList[n].y ].neighbours[m].x][CELLS[ updateList[n].x ][ updateList[n].y ].neighbours[m].y].pauseUpdate == false ){
				 	CELLS[CELLS[ updateList[n].x ][ updateList[n].y ].neighbours[m].x][CELLS[ updateList[n].x ][ updateList[n].y ].neighbours[m].y].updateSignal = true;
				}
			}
		}
		for ( var n = 0; n < updateList.length; n++){
			CELLS[ updateList[n].x ][ updateList[n].y ].futureToCurrent();
		}
	}
	else{

		CELLS.forAll( testCell.update );
		CELLS.forAll( testCell.futureToCurrent );
	}
}

// Kill (reset) all cells
function killAll(){ 
	CELLS.forAll( testCell.kill ); 
	renderAllCells(); 
}