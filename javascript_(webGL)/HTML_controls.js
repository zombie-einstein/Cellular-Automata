'use strict';

// *****************************************
// **** FUNCTIONS USED BY HTML CONTROLS ****
// *****************************************

// Get sim speed from HTML
function getSimSpeed(){
	mainCanvas.speed = document.getElementById("speedRange").value;
	// If the simulation is running pause and restart to
	// avoid problem of continually increasing speed
	if ( mainCanvas.paused == false ){
		mainCanvas.pauseSim();
		mainCanvas.startSim();
	}
}

// Clear all the cells
function clearCells(){

	mainCanvas.pauseSim();
	mainCanvas.clearCells();

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

// load a preset and update the HTML forms
function loadAndUpdatePreset(){

	ruleCanvas.loadPreset( presets[ document.getElementById("loadpreset").value] );

}

// Fill screen with randomly assigned cells
function fillRandomCells(){

	mainCanvas.fillRandomCells( document.getElementById("pAlive").value );
	mainCanvas.renderCells();
}

// Change color schemes from menu
function changeColorScheme(){

	currentColorScheme = eval(document.getElementById("chooseColorScheme").value);
	currentColorScheme.clearMenus();
	currentColorScheme.createMenus();
	changeBackgroundColor();
	changeAliveColor();
	changeTextColor();

}

// Change background & dead cell color from HTML element and re-render
function changeBackgroundColor(){

	deadColor	= document.getElementById("choosedeadcolor").value;

	document.getElementById("body").style.backgroundColor = deadColor;

	mainCanvas.renderCells();

	// Update color of HTML elements
	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.backgroundColor = deadColor;

	}

}

// Change the color of alive cells and re-render
function changeAliveColor(){
	// Convert HTML hex value to normalized RGB values
	aliveColor = convertHex( document.getElementById("choosealivecolor").value ).map(function(x){return x/255;});
	// Subtract live cell color used for calculation
	aliveColor[0] = aliveColor[0]-1;
	// re-render
	mainCanvas.renderCells();
	ruleCanvas.renderRules();

}

// Change menu and logo colors using HTML element
function changeTextColor(){
	var textColor	= document.getElementById("choosemenucolor").value;

	document.getElementById("logo").style.fill = textColor;

	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.color = textColor;
		elementsToChange[i].style.borderColor = textColor;
	}
	var elementsToChange = document.getElementsByClassName("bordersTop");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.color = textColor;
		elementsToChange[i].style.borderColor = textColor;
	}

}
