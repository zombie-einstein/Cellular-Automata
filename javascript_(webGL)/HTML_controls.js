'use strict';

// **** Functions used by HTML controls **** // 

// Get sim speed from HTML

function getSimSpeed(){
	simSpeed = document.getElementById("speedRange").value;
	// If the simulation is running pause and restart to
	// avoid problem of continually increasing speed
	if ( paused == false ){ 
		pauseSim(); 
		startSim();
	}
}

function clearCells(){
	pauseSim();
	killAll();
}

// Update number and size of cells when changed
function updateGrid(){
	
	pauseSim();	// first send pause signal

	// Get new values from HTML
	numCellsWidth 	= Number( Math.floor(document.getElementById("cellWidthSelect").value) );
	numCellsHeight 	= Number( Math.floor(document.getElementById("cellHeightSelect").value) );

	// Calculate new width of cell
	cellWidth 		= canvasWidth / numCellsWidth; 
	cellHeight 		= canvasHeight / numCellsHeight;

	// Update all cells and render
	createTextures( numCellsWidth, numCellsHeight )
	renderAllCells();

	console.log("Updated grid succesfully");
}

// load a preset and update the HTML forms

function loadAndUpdatePreset(){

	// Check if value of form matches element of preset
	// and if so load it to the current ruleset
	for( var x in presets ){
		if ( x ==  document.getElementById("loadpreset").value ){
			currentRuleSet.loadPreset( presets[x] );
		}
	}
	rulesetCanvas();

	console.log("Preset ruleset loaded");
}

// Fill screen with randomly assigned cells
function fillRandomCells(){

	loadRandomTexture(1-document.getElementById("pAlive").value);

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

	renderAllCells();
	
	// Update color of HTML elements
	var elementsToChange = document.getElementsByClassName("main");
	for ( var i = 0; i < elementsToChange.length; i++ ){
		elementsToChange[i].style.backgroundColor = deadColor;
	
	}
	rulesetCanvas();
}

// Change the color of alive cells and re-render

function changeAliveColor(){
	// Convert HTML hex value to normalized RGB values
	aliveColor = convertHex( document.getElementById("choosealivecolor").value ).map(function(x){return x/255;});
	// Subtract live cell color used for calculation
	aliveColor[0] = aliveColor[0]-1;
	// re-render
	renderAllCells();
	rulesetCanvas();
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
	rulesetCanvas();
}