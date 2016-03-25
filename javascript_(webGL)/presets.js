'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

// ******** NOTE ******** //
// Currently the rule sets are stored as values in arrays. Ideally this could be done using image files which are then
// easily imported into the rule texture. Need a means of sorting cross site scripting though.

var presets = { gameOfLife: new ruleSet(10,3), dayAndNight: new ruleSet(10,2), highLife: new ruleSet(10,2) };

	// Conway's game of life ruleset
	presets.gameOfLife.name 		= "Game of Life";

	presets.gameOfLife.setAlive(0);
	presets.gameOfLife.setAlive(3);
	presets.gameOfLife.setAlive(4);
	presets.gameOfLife.setAlive(14);

	// 2-D ruleset


	// Day and Night
	presets.dayAndNight.name 	= "Day and Night";

	presets.dayAndNight.setAlive(0);
	presets.dayAndNight.setAlive(4);
	presets.dayAndNight.setAlive(5);
	presets.dayAndNight.setAlive(7);
	presets.dayAndNight.setAlive(8);
	presets.dayAndNight.setAlive(9);
	presets.dayAndNight.setAlive(14);
	presets.dayAndNight.setAlive(17);
	presets.dayAndNight.setAlive(18);
	presets.dayAndNight.setAlive(19);

	// High life
	presets.highLife.name 		= "High Life";

	presets.highLife.setAlive(0);
	presets.highLife.setAlive(3);
	presets.highLife.setAlive(4);
	presets.highLife.setAlive(14);
	presets.highLife.setAlive(17);

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
