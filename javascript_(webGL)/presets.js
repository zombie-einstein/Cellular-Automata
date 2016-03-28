'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

// ******** NOTE ******** //
// Currently the rule sets are stored as values in arrays. Ideally this could be done using image files which are then
// easily imported into the rule texture. Need a means of sorting cross site scripting though.

var presets = { gameOfLife: new ruleSet(10,10), dayAndNight: new ruleSet(10,10), highLife: new ruleSet(10,10) };

	// Conway's game of life ruleset
	presets.gameOfLife.name 		= "Game of Life";

	presets.gameOfLife.setAlive(0);
	presets.gameOfLife.setAlive(3);
	presets.gameOfLife.setAlive(4);
	presets.gameOfLife.setAlive(14);

	presets.gameOfLife.setAlive(22);
	presets.gameOfLife.setAlive(23);
	presets.gameOfLife.setAlive(24);
	presets.gameOfLife.setAlive(25);
	presets.gameOfLife.setAlive(26);
	presets.gameOfLife.setAlive(27);
	presets.gameOfLife.setAlive(28);
	presets.gameOfLife.setAlive(29);

	presets.gameOfLife.setAlive(33);
	presets.gameOfLife.setAlive(34);
	presets.gameOfLife.setAlive(35);
	presets.gameOfLife.setAlive(36);
	presets.gameOfLife.setAlive(37);
	presets.gameOfLife.setAlive(38);
	presets.gameOfLife.setAlive(39);

	presets.gameOfLife.setAlive(44);
	presets.gameOfLife.setAlive(45);
	presets.gameOfLife.setAlive(46);
	presets.gameOfLife.setAlive(47);
	presets.gameOfLife.setAlive(48);
	presets.gameOfLife.setAlive(49);

	presets.gameOfLife.setAlive(55);
	presets.gameOfLife.setAlive(56);
	presets.gameOfLife.setAlive(57);
	presets.gameOfLife.setAlive(58);
	presets.gameOfLife.setAlive(59);

	presets.gameOfLife.setAlive(66);
	presets.gameOfLife.setAlive(67);
	presets.gameOfLife.setAlive(68);
	presets.gameOfLife.setAlive(69);

	presets.gameOfLife.setAlive(77);
	presets.gameOfLife.setAlive(78);
	presets.gameOfLife.setAlive(79);

	presets.gameOfLife.setAlive(88);
	presets.gameOfLife.setAlive(89);

	presets.gameOfLife.setAlive(99);

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

	presets.dayAndNight.setAlive(22);
	presets.dayAndNight.setAlive(23);
	presets.dayAndNight.setAlive(24);
	presets.dayAndNight.setAlive(25);
	presets.dayAndNight.setAlive(26);
	presets.dayAndNight.setAlive(27);
	presets.dayAndNight.setAlive(28);
	presets.dayAndNight.setAlive(29);

	presets.dayAndNight.setAlive(33);
	presets.dayAndNight.setAlive(34);
	presets.dayAndNight.setAlive(35);
	presets.dayAndNight.setAlive(36);
	presets.dayAndNight.setAlive(37);
	presets.dayAndNight.setAlive(38);
	presets.dayAndNight.setAlive(39);

	presets.dayAndNight.setAlive(44);
	presets.dayAndNight.setAlive(45);
	presets.dayAndNight.setAlive(46);
	presets.dayAndNight.setAlive(47);
	presets.dayAndNight.setAlive(48);
	presets.dayAndNight.setAlive(49);

	presets.dayAndNight.setAlive(55);
	presets.dayAndNight.setAlive(56);
	presets.dayAndNight.setAlive(57);
	presets.dayAndNight.setAlive(58);
	presets.dayAndNight.setAlive(59);

	presets.dayAndNight.setAlive(66);
	presets.dayAndNight.setAlive(67);
	presets.dayAndNight.setAlive(68);
	presets.dayAndNight.setAlive(69);

	presets.dayAndNight.setAlive(77);
	presets.dayAndNight.setAlive(78);
	presets.dayAndNight.setAlive(79);

	presets.dayAndNight.setAlive(88);
	presets.dayAndNight.setAlive(89);

	presets.dayAndNight.setAlive(99);


	// High life
	presets.highLife.name 		= "High Life";

	presets.highLife.setAlive(0);
	presets.highLife.setAlive(3);
	presets.highLife.setAlive(4);
	presets.highLife.setAlive(14);
	presets.highLife.setAlive(17);

	presets.highLife.setAlive(22);
	presets.highLife.setAlive(23);
	presets.highLife.setAlive(24);
	presets.highLife.setAlive(25);
	presets.highLife.setAlive(26);
	presets.highLife.setAlive(27);
	presets.highLife.setAlive(28);
	presets.highLife.setAlive(29);

	presets.highLife.setAlive(33);
	presets.highLife.setAlive(34);
	presets.highLife.setAlive(35);
	presets.highLife.setAlive(36);
	presets.highLife.setAlive(37);
	presets.highLife.setAlive(38);
	presets.highLife.setAlive(39);

	presets.highLife.setAlive(44);
	presets.highLife.setAlive(45);
	presets.highLife.setAlive(46);
	presets.highLife.setAlive(47);
	presets.highLife.setAlive(48);
	presets.highLife.setAlive(49);

	presets.highLife.setAlive(55);
	presets.highLife.setAlive(56);
	presets.highLife.setAlive(57);
	presets.highLife.setAlive(58);
	presets.highLife.setAlive(59);

	presets.highLife.setAlive(66);
	presets.highLife.setAlive(67);
	presets.highLife.setAlive(68);
	presets.highLife.setAlive(69);

	presets.highLife.setAlive(77);
	presets.highLife.setAlive(78);
	presets.highLife.setAlive(79);

	presets.highLife.setAlive(88);
	presets.highLife.setAlive(89);

	presets.highLife.setAlive(99);

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
