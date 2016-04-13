'use strict';

// *****************************************
// **** FUNCTIONS USED BY HTML CONTROLS ****
// *****************************************

// Clear all the cells
function clearCells(){

	mainCanvas.pauseSim();
	mainCanvas.clearCells();
	mainCanvas.currentRow = 1;

}

// Update number and size of cells when changed
function updateGrid(){

	mainCanvas.pauseSim();	// first send pause signal

	// Get new values from HTML
	cells.n.x 	= Number( Math.floor(document.getElementById("cellWidthSelect").value) );
	cells.n.y 	= Number( Math.floor(document.getElementById("cellHeightSelect").value) );

	// Calculate new dimensions of cells
	cells.d.x 	= canvas.width  / cells.n.x;
	cells.d.y 	= canvas.height / cells.n.y;

	// Update all cells and render
	mainCanvas.updateCellDimensions( cells.n.x, cells.n.y );
	mainCanvas.renderCells();

	console.log( "Updated grid to ", cells.n.x, "x", cells.n.y );

}

// Update the cell neighbourhood from HTML
function changeNeighbourhood(){

	currentNeighbourhood.load( neighbourhoods[document.getElementById("neighbourhoodSelect").value] );

}

// Load a preset and update the HTML forms
function loadAndUpdatePreset(){

	currentRuleSet.loadPreset( presets[ document.getElementById("loadpreset").value] );

}

// Set a rulset from value of HTML form
function loadRuleFromHTMLInt(){

	currentRuleSet.setResultFromInt( parseInt(document.getElementById("ruleCode").value) );

}

// Fill screen with randomly assigned cells
function fillRandomCells(){

	mainCanvas.randomSeed( document.getElementById("pAlive").value );
	mainCanvas.renderCells();
}

// Change color schemes from menu
function changeColorScheme(){

	currentColorScheme.loadColorScheme( eval(document.getElementById("chooseColorScheme").value) );
	currentRuleSet.setOverlayColor(currentColorScheme.menu);
	currentRuleSet.renderTextures();
	mainCanvas.renderCells();

}

function setSeedFromHTMLInt(){

	mainCanvas.setSeedFromInt( parseInt(document.getElementById("seedint").value) );

}
