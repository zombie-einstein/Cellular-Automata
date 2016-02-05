'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

var presets = { gameOfLife: new ruleSet, oneD: new ruleSet, dayAndNight: new ruleSet, highLife: new ruleSet };

	// Conway's game of life ruleset
	presets.gameOfLife.name 	= "Game of Life";
	presets.gameOfLife.number 	= 3;
	presets.gameOfLife.if     	= [true,true,false];
	presets.gameOfLife.and 		= ["<",">","="];
	presets.gameOfLife.than		= [2,3,3];
	presets.gameOfLife.then		= [false,false,true];

	// 2-D ruleset
	presets.oneD.name 			= "1-dimensional";
	presets.oneD.number 		= 3;
	presets.oneD.if 			= [true,true,false];
	presets.oneD.and 			= ["=","=","="];
	presets.oneD.than			= [2,0,1];
	presets.oneD.then			= [false,false,true];

	// Day and Night
	presets.dayAndNight.name 	= "Day and Night";
	presets.dayAndNight.number 	= 4;
	presets.dayAndNight.if 		= [true,true,false,false];
	presets.dayAndNight.and 	= ["<","=","=",">"];
	presets.dayAndNight.than	= [3,5,3,5];
	presets.dayAndNight.then	= [false,false,true,true];

	// High life
	presets.highLife.name 		= "High Life";
	presets.highLife.number 	= 4;
	presets.highLife.if 		= [true,true,false,false];
	presets.highLife.and 		= ["<",">","=","="];
	presets.highLife.than		= [2,3,3,6];
	presets.highLife.then		= [false,false,true,true];


// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}