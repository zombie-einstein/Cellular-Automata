
'use strict';

// ***** Variable Declerations *****

var numCellsWidth  = 100;
var numCellsHeight = 50;

var timeStep;
var paused = true;

var canvas 			= document.getElementById("canvas");
var ctx 			= canvas.getContext("2d");
ctx.canvas.width  	= window.innerWidth;
ctx.canvas.height 	= window.innerHeight-100;
var canvasWidth 	= canvas.width;
var canvasHeight 	= canvas.height;		

var cellWidth 		= canvasWidth / numCellsWidth;
var cellHeight 		= canvasHeight / numCellsHeight; 


var CELLS = [];

createCells();

var testCell = new cell(0,0);

renderAllCells();

alert("Copmleted Succesfully");


