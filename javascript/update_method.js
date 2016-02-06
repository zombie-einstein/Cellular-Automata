'use strict';

// ======= Contains methods for updating cells =======
// ======= and functions for applying them     ======= 

// Update method structure
function method( x ){
	// String name of the method
	this.name = x;
	// Description text
	this.description;
	// Function run when method is changed (i.e. resetting updates)
	this.initialize;
	// Function applyed at each update step
	this.apply;
}

// Oject containing update methods
var updateMethods = { 	simultaneous: new method("Simultaneous"), 
						signal: new method("Signal"), 
						oneD: new method("One-Dimensional") 
					};

// ******* Descriptions *******

updateMethods.simultaneous.description = " All cells are updated every turn.";
updateMethods.signal.description = "Initially alive cells update then send a signal to adjecent cells to update next turn. Once a cell has updated it can't update next turn.";
updateMethods.oneD.description = "Starting from an intial pattern on the left each row updates each turn (moving to the right). Each cell in a row depend on it's state in the initial column and it's neighbours.";

// Create update functions function (used after CELLS has been created!)
function generateUpdateFunctions(){

// ******* Simultaneous update method *******
	
	// Set initialization function
	updateMethods.simultaneous.initialize = function(){ 
		console.log("Update method changed to "+this.name);
	}
	// Set update method
	updateMethods.simultaneous.apply = function(){
		// Just update all cells at the same time 
		CELLS.forAll( testCell.update );
		CELLS.forAll( testCell.applyRules );
	} 

// ******* Signal update method *******

	// Set initialization function
	updateMethods.signal.initialize = function(){
		console.log("Update method changed to "+this.name);

		// Kill all update signals then set live cells to update
		for ( var n = 0; n < CELLS.length; n++ ){
			for ( var m = 0; m < CELLS[n].length; m++ ){

					//CELLS[n][m].killSignal();

					if ( CELLS[n][m].current == true ){
						CELLS[n][m].sendSignal();
					}
				}
			}
		}	

	// Set update method
	updateMethods.signal.apply = function(){
		// First mark cells to be updated this turn
		for ( var n = 0; n < CELLS.length; n++ ){
			for ( var m = 0; m < CELLS[n].length; m++ ){
				if ( CELLS[n][m].updateSignal == true ){
					
					CELLS[n][m].updateThisTurn = true;

				}
			}
		}
		// Update marked cells and send signal to neighbour 
		for ( var n = 0; n < CELLS.length; n++ ){
			for ( var m = 0; m < CELLS[n].length; m++ ){
				if ( CELLS[n][m].updateThisTurn == true ){
					
					CELLS[n][m].update();

					for ( var i = 0; i < CELLS[n][m].neighbours.length; i++ ){

						CELLS[CELLS[n][m].neighbours[i].x][CELLS[n][m].neighbours[i].y].updateSignal = true;
				
					}

				}
			}
		}
		// Apply rules to marked cells, and reset their update signal so they don't update next turn
		for ( var n = 0; n < CELLS.length; n++ ){
			for ( var m = 0; m < CELLS[n].length; m++ ){
				if ( CELLS[n][m].updateThisTurn == true ){
					
					CELLS[n][m].updateSignal = false;
					CELLS[n][m].updateThisTurn = false;
					CELLS[n][m].applyRules();

				}
			}
		}

	}


// ******* One-dimensional update method *******
	
	
	
	// Set initialization function
	updateMethods.oneD.initialize = function(){
		console.log("Update method changed to "+this.name);
		// Can't be 1-D and von neumann
		vonNeumann = false;
		document.getElementById("vonneumann").value = "false";

		// Clear and find new neighbours of remaining rows and re-render
		for ( var n = 1; n < CELLS.length; n++ ){
			for ( var m = 0; m < CELLS[n].length; m++ ){

					CELLS[n][m].kill();
					//CELLS[n][m].killSignal();
			}
		}

		// Update the neighbours of the first row and
		// mark the next row for update next turn 
		for ( var m = 0; m < CELLS[0].length; m++ ){
					CELLS[0][m].generateNeighbours();
					CELLS[0][m].killSignal();
					CELLS[1][m].sendSignal();
		}

		renderAllCells();

	}

	// Set update method
	updateMethods.oneD.apply = function(){
	// First mark cells to be updated this turn
	// and turn of signal to update next turn
	for ( var n = 0; n < CELLS.length; n++ ){
		for ( var m = 0; m < CELLS[n].length; m++ ){
			if ( CELLS[n][m].updateSignal == true ){

				if ( topology == "flat" && n == numCellsWidth-1 ){
					pauseSim();
					break;
				}

				CELLS[n][m].updateThisTurn = true;
				CELLS[n][m].updateSignal = false;

			}
		}
	}
			
		for ( var n = 0; n < CELLS.length; n++ ){
			for ( var m = 0; m < CELLS[n].length; m++ ){
				if ( CELLS[n][m].updateThisTurn == true ){
					
					// Get current state from previous line
					CELLS[n][m].current = CELLS[(n-1+numCellsWidth)%numCellsWidth][m].current;
					// Get neighbour values from previous line
					CELLS[n][m].update();
					// Apply update rules
					CELLS[n][m].applyRules();
					// Send update signal to next row
					CELLS[(n+1)%numCellsWidth][m].updateSignal = true;
					// Cancel update this turn
					CELLS[n][m].updateThisTurn = false;
				}
			}
		}
	}
}

// Make menu of update options in HTML from list

function makeUpdateMenu(){
	for ( x in updateMethods ){
		document.getElementById("updatemethod").innerHTML+='<option value= "updateMethods.'+x.toString()+'"> '+updateMethods[x].name+' </option>';

	}
}

