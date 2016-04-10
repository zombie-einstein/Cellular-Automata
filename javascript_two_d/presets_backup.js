'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

// ******** NOTE ******** //
// Currently the rule sets are stored as values in arrays. Ideally this could be done using image files which are then
// easily imported into the rule texture. Need a means of sorting cross site loading though.

var presets = { gameOfLife: new ruleSet(10,10), dayAndNight: new ruleSet(10,10), highLife: new ruleSet(10,10) };

	// Conway's game of life ruleset
	presets.gameOfLife.name 		= "Game of Life";

	presets.gameOfLife.setAlive(0,0);
	presets.gameOfLife.setAlive(3,0);
	presets.gameOfLife.setAlive(4,0);
	presets.gameOfLife.setAlive(4,1);

	presets.gameOfLife.setAlive(2,2);
	presets.gameOfLife.setAlive(3,2);
	presets.gameOfLife.setAlive(4,2);
	presets.gameOfLife.setAlive(5,2);
	presets.gameOfLife.setAlive(6,2);
	presets.gameOfLife.setAlive(7,2);
	presets.gameOfLife.setAlive(8,2);
	presets.gameOfLife.setAlive(9,2);

	presets.gameOfLife.setAlive(3,3);
	presets.gameOfLife.setAlive(4,3);
	presets.gameOfLife.setAlive(5,3);
	presets.gameOfLife.setAlive(6,3);
	presets.gameOfLife.setAlive(7,3);
	presets.gameOfLife.setAlive(8,3);
	presets.gameOfLife.setAlive(9,3);

	presets.gameOfLife.setAlive(4,4);
	presets.gameOfLife.setAlive(5,4);
	presets.gameOfLife.setAlive(6,4);
	presets.gameOfLife.setAlive(7,4);
	presets.gameOfLife.setAlive(8,4);
	presets.gameOfLife.setAlive(9,4);

	presets.gameOfLife.setAlive(5,5);
	presets.gameOfLife.setAlive(6,5);
	presets.gameOfLife.setAlive(7,5);
	presets.gameOfLife.setAlive(8,5);
	presets.gameOfLife.setAlive(9,5);

	presets.gameOfLife.setAlive(6,6);
	presets.gameOfLife.setAlive(7,6);
	presets.gameOfLife.setAlive(8,6);
	presets.gameOfLife.setAlive(9,6);

	presets.gameOfLife.setAlive(7,7);
	presets.gameOfLife.setAlive(8,7);
	presets.gameOfLife.setAlive(9,7);

	presets.gameOfLife.setAlive(8,8);
	presets.gameOfLife.setAlive(9,8);

	presets.gameOfLife.setAlive(9,9);

	// Day and Night
	presets.dayAndNight.name 	= "Day and Night";

	presets.dayAndNight.setAlive(0,0);
	presets.dayAndNight.setAlive(4,0);
	presets.dayAndNight.setAlive(5,0);
	presets.dayAndNight.setAlive(7,0);
	presets.dayAndNight.setAlive(8,0);
	presets.dayAndNight.setAlive(9,0);
	presets.dayAndNight.setAlive(4,1);
	presets.dayAndNight.setAlive(7,1);
	presets.dayAndNight.setAlive(8,1);
	presets.dayAndNight.setAlive(9,1);

	presets.dayAndNight.setAlive(2,2);
	presets.dayAndNight.setAlive(3,2);
	presets.dayAndNight.setAlive(4,2);
	presets.dayAndNight.setAlive(5,2);
	presets.dayAndNight.setAlive(6,2);
	presets.dayAndNight.setAlive(7,2);
	presets.dayAndNight.setAlive(8,2);
	presets.dayAndNight.setAlive(9,2);

	presets.dayAndNight.setAlive(3,3);
	presets.dayAndNight.setAlive(4,3);
	presets.dayAndNight.setAlive(5,3);
	presets.dayAndNight.setAlive(6,3);
	presets.dayAndNight.setAlive(7,3);
	presets.dayAndNight.setAlive(8,3);
	presets.dayAndNight.setAlive(9,3);

	presets.dayAndNight.setAlive(4,4);
	presets.dayAndNight.setAlive(5,4);
	presets.dayAndNight.setAlive(6,4);
	presets.dayAndNight.setAlive(7,4);
	presets.dayAndNight.setAlive(8,4);
	presets.dayAndNight.setAlive(9,4);

	presets.dayAndNight.setAlive(5,5);
	presets.dayAndNight.setAlive(6,5);
	presets.dayAndNight.setAlive(7,5);
	presets.dayAndNight.setAlive(8,5);
	presets.dayAndNight.setAlive(9,5);

	presets.dayAndNight.setAlive(6,6);
	presets.dayAndNight.setAlive(7,6);
	presets.dayAndNight.setAlive(8,6);
	presets.dayAndNight.setAlive(9,6);

	presets.dayAndNight.setAlive(7,7);
	presets.dayAndNight.setAlive(8,7);
	presets.dayAndNight.setAlive(9,7);

	presets.dayAndNight.setAlive(8,8);
	presets.dayAndNight.setAlive(9,8);

	presets.dayAndNight.setAlive(9,9);

	// High life
	presets.highLife.name 		= "High Life";

	presets.highLife.setAlive(0,0);
	presets.highLife.setAlive(3,0);
	presets.highLife.setAlive(4,0);
	presets.highLife.setAlive(4,1);
	presets.highLife.setAlive(7,1);


	presets.highLife.setAlive(2,2);
	presets.highLife.setAlive(3,2);
	presets.highLife.setAlive(4,2);
	presets.highLife.setAlive(5,2);
	presets.highLife.setAlive(6,2);
	presets.highLife.setAlive(7,2);
	presets.highLife.setAlive(8,2);
	presets.highLife.setAlive(9,2);

	presets.highLife.setAlive(3,3);
	presets.highLife.setAlive(4,3);
	presets.highLife.setAlive(5,3);
	presets.highLife.setAlive(6,3);
	presets.highLife.setAlive(7,3);
	presets.highLife.setAlive(8,3);
	presets.highLife.setAlive(9,3);

	presets.highLife.setAlive(4,4);
	presets.highLife.setAlive(5,4);
	presets.highLife.setAlive(6,4);
	presets.highLife.setAlive(7,4);
	presets.highLife.setAlive(8,4);
	presets.highLife.setAlive(9,4);

	presets.highLife.setAlive(5,5);
	presets.highLife.setAlive(6,5);
	presets.highLife.setAlive(7,5);
	presets.highLife.setAlive(8,5);
	presets.highLife.setAlive(9,5);

	presets.highLife.setAlive(6,6);
	presets.highLife.setAlive(7,6);
	presets.highLife.setAlive(8,6);
	presets.highLife.setAlive(9,6);

	presets.highLife.setAlive(7,7);
	presets.highLife.setAlive(8,7);
	presets.highLife.setAlive(9,7);

	presets.highLife.setAlive(8,8);
	presets.highLife.setAlive(9,8);

	presets.highLife.setAlive(9,9);

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
