'use strict';

// ***** Variable Declerations *****

var numCellsWidth  	= Math.floor(document.getElementById("numCellsWidthForm").value);
var numCellsHeight 	= Math.floor(document.getElementById("numCellsHeightForm").value);

var aliveColor		= '#ff0000';
var deadColor		= '#0000ff';

var updateMethod	= document.getElementById("updating").value;

var timeStep;
var paused 			= true;

var canvas 			= document.getElementById("canvas");
var ctx 			= canvas.getContext("2d");
ctx.canvas.width  	= window.innerWidth;
ctx.canvas.height 	= window.innerHeight-100;
var canvasWidth 	= canvas.width;
var canvasHeight 	= canvas.height;		

var cellWidth 		= canvasWidth / numCellsWidth;
var cellHeight 		= canvasHeight / numCellsHeight;

var topology		= document.getElementById("topology").value;


var CELLS = [];

createCells();

var testCell = new cell(0,0);	// blank cell to generate methods to apply

renderAllCells();

makeTitle();

console.log("Loaded Succesfully");


