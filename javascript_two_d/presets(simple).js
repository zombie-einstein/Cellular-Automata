'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

// ******** NOTE ******** //
// Currently the rule sets are stored as values in arrays. Ideally this could be done using image files which are then
// easily imported into the rule texture. Need a means of sorting cross site loading though.

var presets = { gameOfLife: new ruleSet(8,1),
		 						highLife:		new ruleSet(8,1),
								dayAndNight:new ruleSet(8,1), };

		// Conway's game of life ruleset
		presets.gameOfLife.name 		= "Game of Life";
		presets.gameOfLife.setStateValue(1, 255, 0, 0, 255);
		presets.gameOfLife.addRule(0,3,1);
		presets.gameOfLife.addRule(1,2,1);
		presets.gameOfLife.addRule(1,3,1);

		// Conway's game of life ruleset
		presets.highLife.name 		= "High Life";
		presets.highLife.setStateValue(1, 255, 0, 0, 255);
		presets.highLife.addRule(0,3,1);
		presets.highLife.addRule(0,6,1);
		presets.highLife.addRule(1,2,1);
		presets.highLife.addRule(1,3,1);

		// Conway's game of life ruleset
		presets.dayAndNight.name 		= "Day & Night";
		presets.dayAndNight.setStateValue(1, 255, 0, 0, 255);
		presets.dayAndNight.addRule(0,3,1);
		presets.dayAndNight.addRule(0,6,1);
		presets.dayAndNight.addRule(0,7,1);
		presets.dayAndNight.addRule(0,8,1);
		presets.dayAndNight.addRule(1,3,1);
		presets.dayAndNight.addRule(1,4,1);
		presets.dayAndNight.addRule(1,6,1);
		presets.dayAndNight.addRule(1,7,1);
		presets.dayAndNight.addRule(1,8,1);


// Create a dropdown menu of presets

for ( var x in presets ){
		document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
