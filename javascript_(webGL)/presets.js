'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

var deadValue  = [0.0,0.0,0.0,0.0];
var aliveValue = [1.0,0.0,0.0,1.0];

var presets = { gameOfLife: new ruleSet, oneD: new ruleSet, dayAndNight: new ruleSet, highLife: new ruleSet };

	// Conway's game of life ruleset
	presets.gameOfLife.name 		= "Game of Life";
	
	presets.gameOfLife.aliveSet[0]	= deadValue;
	presets.gameOfLife.aliveSet[1]	= deadValue;
	presets.gameOfLife.aliveSet[2]	= aliveValue;
	presets.gameOfLife.aliveSet[3]	= aliveValue;
	presets.gameOfLife.aliveSet[4]	= deadValue;
	presets.gameOfLife.aliveSet[5]	= deadValue;
	presets.gameOfLife.aliveSet[6]	= deadValue;
	presets.gameOfLife.aliveSet[7]	= deadValue;
	presets.gameOfLife.aliveSet[8]	= deadValue;
	
	presets.gameOfLife.deadSet[0]	= deadValue;
	presets.gameOfLife.deadSet[1]	= deadValue;
	presets.gameOfLife.deadSet[2]	= deadValue;
	presets.gameOfLife.deadSet[3]	= aliveValue;
	presets.gameOfLife.deadSet[4]	= deadValue;
	presets.gameOfLife.deadSet[5]	= deadValue;
	presets.gameOfLife.deadSet[6]	= deadValue;
	presets.gameOfLife.deadSet[7]	= deadValue;
	presets.gameOfLife.deadSet[8]	= deadValue;

	// 2-D ruleset
	presets.oneD.name 			= "1-dimensional";
	presets.oneD.number 		= 3;
	presets.oneD.if 			= [true,true,false];
	presets.oneD.and 			= ["=","=","="];
	presets.oneD.than			= [2,0,1];
	presets.oneD.then			= [false,false,true];

	// Day and Night
	presets.dayAndNight.name 	= "Day and Night";
	
	presets.dayAndNight.aliveSet[0]	= deadValue;
	presets.dayAndNight.aliveSet[1]	= deadValue;
	presets.dayAndNight.aliveSet[2]	= deadValue;
	presets.dayAndNight.aliveSet[3]	= aliveValue;
	presets.dayAndNight.aliveSet[4]	= aliveValue;
	presets.dayAndNight.aliveSet[5]	= deadValue;
	presets.dayAndNight.aliveSet[6]	= aliveValue;
	presets.dayAndNight.aliveSet[7]	= aliveValue;
	presets.dayAndNight.aliveSet[8]	= aliveValue;
	
	presets.dayAndNight.deadSet[0]	= deadValue;
	presets.dayAndNight.deadSet[1]	= deadValue;
	presets.dayAndNight.deadSet[2]	= deadValue;
	presets.dayAndNight.deadSet[3]	= aliveValue;
	presets.dayAndNight.deadSet[4]	= deadValue;
	presets.dayAndNight.deadSet[5]	= deadValue;
	presets.dayAndNight.deadSet[6]	= aliveValue;
	presets.dayAndNight.deadSet[7]	= aliveValue;
	presets.dayAndNight.deadSet[8]	= aliveValue;

	// High life
	presets.highLife.name 		= "High Life";
	
	presets.highLife.aliveSet[0]	= deadValue;
	presets.highLife.aliveSet[1]	= deadValue;
	presets.highLife.aliveSet[2]	= aliveValue;
	presets.highLife.aliveSet[3]	= aliveValue;
	presets.highLife.aliveSet[4]	= deadValue;
	presets.highLife.aliveSet[5]	= deadValue;
	presets.highLife.aliveSet[6]	= deadValue;
	presets.highLife.aliveSet[7]	= deadValue;
	presets.highLife.aliveSet[8]	= deadValue;
	
	presets.highLife.deadSet[0]	= deadValue;
	presets.highLife.deadSet[1]	= deadValue;
	presets.highLife.deadSet[2]	= deadValue;
	presets.highLife.deadSet[3]	= aliveValue;
	presets.highLife.deadSet[4]	= deadValue;
	presets.highLife.deadSet[5]	= deadValue;
	presets.highLife.deadSet[6]	= aliveValue;
	presets.highLife.deadSet[7]	= deadValue;
	presets.highLife.deadSet[8]	= deadValue;


// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}