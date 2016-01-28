'use strict';

// ***** Variable Declerations *****

var canvas 			= document.getElementById("canvas");
var ctx 			= canvas.getContext("2d");
ctx.canvas.width  	= window.innerWidth-document.getElementById("menus").offsetWidth;
ctx.canvas.height 	= window.innerHeight;
var canvasWidth 	= canvas.width;
var canvasHeight 	= canvas.height;

// Get number of cells from HTMl and thus calculate height of single cell
var numCellsWidth  	= Math.floor(document.getElementById("numCellsWidthForm").value);
var cellWidth 		= canvasWidth / numCellsWidth;

// Calculate number of cells that most closely produces an integer number of square cells
var numCellsHeight 	= Math.round( canvasHeight / cellWidth ); 
document.getElementById("numCellsHeightForm").value = numCellsHeight;
var cellHeight 		= canvasHeight / numCellsHeight;

var aliveColor		= document.getElementById("aliveColor").value;
var deadColor		= document.getElementById("deadColor").value;

var updateMethod	= document.getElementById("updating").value;

var timeStep;	// Initialize timestep variable outside scope of animation function

var paused 			= true;	// Simulation status switch
		
var topology		= document.getElementById("topology").value;

// Initialize cells and render

var CELLS = [];

createCells();

var testCell = new cell(0,0);	// blank cell to generate methods to apply

renderAllCells();

// Write title in cells

makeTitle();

console.log("Loaded Succesfully");


