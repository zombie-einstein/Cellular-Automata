'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

var presets = { gameOfLife: new ruleSet(10,2), dayAndNight: new ruleSet(10,2), highLife: new ruleSet(10,2) };

	// Conway's game of life ruleset
	presets.gameOfLife.name 		= "Game of Life";

	presets.gameOfLife.data[0]   = 255;
	presets.gameOfLife.data[3]   = 255;
	presets.gameOfLife.data[12]  = 255;
	presets.gameOfLife.data[15]  = 255;
	presets.gameOfLife.data[16]  = 255;
	presets.gameOfLife.data[19]  = 255;
	presets.gameOfLife.data[56]  = 255;
	presets.gameOfLife.data[59]  = 255;

	// 2-D ruleset
	//presets.oneD.name 			= "1-dimensional";
	//presets.oneD.number 		= 3;
	//presets.oneD.if 			= [true,true,false];
	//presets.oneD.and 			= ["=","=","="];
	//presets.oneD.than			= [2,0,1];
	//presets.oneD.then			= [false,false,true];

	// Day and Night
	presets.dayAndNight.name 	= "Day and Night";

	// High life
	presets.highLife.name 		= "High Life";

	presets.highLife.data[0]   = 255;
	presets.highLife.data[3]   = 255;
	presets.highLife.data[12]  = 255;
	presets.highLife.data[15]  = 255;
	presets.highLife.data[16]  = 255;
	presets.highLife.data[19]  = 255;
	presets.highLife.data[56]  = 255;
	presets.highLife.data[59]  = 255;
	presets.highLife.data[68]  = 255;
	presets.highLife.data[71]  = 255;

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
